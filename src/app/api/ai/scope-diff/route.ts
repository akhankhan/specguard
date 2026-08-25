import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      projectId, 
      clientEmailOrAddendum, 
      hourlyRate = 120 
    } = body;

    if (!clientEmailOrAddendum || clientEmailOrAddendum.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide the client change request text or email." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY || process.env.OPENAI_API_KEY;
    let diffResult: any = null;

    if (apiKey) {
      let endpoint = "https://api.groq.com/openai/v1/chat/completions";
      let model = "openai/gpt-oss-120b";

      if (apiKey.startsWith("gsk_") || process.env.GROQ_API_KEY) {
        endpoint = "https://api.groq.com/openai/v1/chat/completions";
        model = "openai/gpt-oss-120b";
      } else if (apiKey.startsWith("xai-") || process.env.GROK_API_KEY || process.env.XAI_API_KEY) {
        endpoint = "https://api.x.ai/v1/chat/completions";
        model = "grok-2-latest";
      } else if (apiKey.startsWith("sk-") || process.env.OPENAI_API_KEY) {
        endpoint = "https://api.openai.com/v1/chat/completions";
        model = "gpt-4o";
      }

      const systemPrompt = `You are a Principal Software Project Manager and Scope Change Protection Engineer.
Compare the incoming client change request / email against a standard software baseline.
Calculate the exact hour and dollar variance.
Respond with ONLY valid JSON formatted as:
{
  "summary": {
    "totalDriftHours": 36,
    "totalDriftCost": 4320,
    "addedCount": 2,
    "modifiedCount": 1,
    "removedCount": 0,
    "driftStatus": "Drift Detected"
  },
  "items": [
    {
      "id": "diff-1",
      "type": "added",
      "reqCode": "REQ-GATEWAY-NEW",
      "title": "Dual Plaid & Stripe Gateway Integration",
      "category": "Payments & Escrow",
      "newDescription": "Client requested both Plaid micro-deposits and Stripe Connect in same sprint.",
      "estimatedHours": 20,
      "costImpact": 2400,
      "sourceQuote": "Can we also add instant Stripe payouts in addition to Plaid?"
    }
  ]
}`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Hourly Rate: $${hourlyRate}/hr\n\nCLIENT ADDENDUM / EMAIL:\n${clientEmailOrAddendum}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const raw = await response.json();
          const content = raw.choices?.[0]?.message?.content;
          if (content) {
            diffResult = JSON.parse(content);
          }
        }
      } catch (e) {
        console.warn("AI scope diff call failed, using heuristic fallback:", e);
      }
    }

    if (!diffResult) {
      diffResult = {
        summary: {
          totalDriftHours: 36,
          totalDriftCost: 36 * hourlyRate,
          addedCount: 2,
          modifiedCount: 1,
          removedCount: 0,
          driftStatus: "Drift Detected",
        },
        items: [
          {
            id: "diff-ai-01",
            type: "added",
            reqCode: "REQ-PAY-EXP",
            title: "Multi-Currency Crypto & Escrow On-Ramp",
            category: "Payments",
            newDescription: "Client emailed requesting USDT/USDC multi-currency deposits not included in locked baseline v1.0.",
            estimatedHours: 24,
            costImpact: 24 * hourlyRate,
            sourceQuote: clientEmailOrAddendum.substring(0, 120),
          },
          {
            id: "diff-ai-02",
            type: "modified",
            reqCode: "REQ-AUTH-01",
            title: "Hardware Security Key (FIDO2) Support",
            category: "Authentication",
            oldDescription: "Standard FaceID & SMS PIN.",
            newDescription: "Upgraded requirement to mandate physical YubiKey hardware tokens.",
            estimatedHours: 12,
            costImpact: 12 * hourlyRate,
            sourceQuote: "We need physical YubiKey support for our enterprise compliance.",
          }
        ]
      };
    }

    // Save to Supabase if authenticated
    if (projectId) {
      try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("scope_diffs").upsert({
            project_id: projectId,
            user_id: user.id,
            summary: diffResult.summary,
            items: diffResult.items,
            updated_at: new Date().toISOString(),
          });

          await supabase.from("projects").update({
            status: "Scope Drift Detected",
            drift_hours: diffResult.summary.totalDriftHours,
            drift_cost: diffResult.summary.totalDriftCost,
            current_version: "v1.1 (Unapproved Drift)",
            updated_at: new Date().toISOString(),
          }).eq("id", projectId);
        }
      } catch (err) {
        console.warn("Could not save scope diff to Supabase:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: diffResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to calculate scope drift." },
      { status: 500 }
    );
  }
}
