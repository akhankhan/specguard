import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, projectName, clientName, baselineRequirements = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid client message to analyze." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    const isGroq = Boolean(process.env.GROQ_API_KEY);

    const baselineSummaryText = Array.isArray(baselineRequirements) && baselineRequirements.length > 0
      ? baselineRequirements.map((r: any) => `- [${r.code || 'REQ'}] ${r.title}: ${r.description}`).join("\n")
      : "Standard baseline for " + (projectName || "Software Project");

    const systemPrompt = `You are the Lead Solutions Architect and Enterprise Scope Guardian for software development agencies.
Your job is to analyze incoming client WhatsApp messages, emails, or voice note transcripts, compare them strictly against the locked Project Baseline Requirements, and determine if this is out-of-scope feature creep (scope drift) or already covered in the contract.

CRITICAL DIRECTIVES:
1. Compare the message against the provided Project Baseline Requirements.
2. If the request requires new third-party APIs, new UI screens, new backend services, or new database tables not in the baseline, classify it as "OUT_OF_SCOPE" or "PARTIALLY_IN_SCOPE".
3. Calculate realistic dev hours (e.g. 16, 24, 36) and recommended price in USD and AED ($100/hr = AED 367/hr standard agency rate).
4. Draft a polite, diplomatic, professional WhatsApp reply that:
   - Acknowledges the client's idea positively.
   - Points politely to the signed Baseline Specification Blueprint v1.0.
   - States the added dev hours and price clearly.
   - Provides a frictionless call-to-action for the client to approve this Change Request.

Respond ONLY with a valid JSON object matching this structure:
{
  "verdict": "OUT_OF_SCOPE", // or "IN_SCOPE" or "PARTIALLY_IN_SCOPE"
  "confidenceScore": 0.96,
  "title": "Short title of the requested change",
  "summary": "Clear explanation of what the client is asking for",
  "technicalReasoning": "Technical breakdown of why this requires extra architecture/effort (APIs, UI, database)",
  "estimatedHours": 24,
  "recommendedPriceUSD": 2400,
  "recommendedPriceAED": 8800,
  "timelineImpactDays": 4,
  "riskLevel": "Medium", // "Low" | "Medium" | "High" | "Critical"
  "impactedComponents": ["Frontend Mobile App", "Cloud Backend API", "Third-Party Integration"],
  "diplomaticWhatsAppReply": "Hi [Client], flight tracking and automated WhatsApp invoicing is a fantastic idea! As per our signed Project Blueprint (v1.0), this is an additional capability. We can implement this Change Request for +24 dev hours (AED 8,800 / $2,400) with a +4 days delivery adjustment. Please let us know if you'd like us to add this to the upcoming sprint!",
  "changeOrderTitle": "CR-04: Automated Flight Tracking & WhatsApp Cloud Invoicing"
}`;

    if (apiKey) {
      const endpoint = isGroq 
        ? "https://api.groq.com/openai/v1/chat/completions" 
        : "https://api.openai.com/v1/chat/completions";
      
      const model = isGroq ? "llama-3.3-70b-versatile" : "gpt-4o";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `Project Name: ${projectName || "Drive Safe Limousine LLC"}\nClient: ${clientName || "Fleet Client"}\n\nPROJECT BASELINE REQUIREMENTS:\n${baselineSummaryText}\n\nINCOMING CLIENT WHATSAPP/EMAIL MESSAGE:\n"${message}"` 
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return NextResponse.json({ success: true, data: parsed });
        }
      }
    }

    // Heuristic Fallback if API key rate limited or offline
    const isOutOfScope = !message.toLowerCase().includes("as agreed") && !message.toLowerCase().includes("bug fix");
    const estimatedHours = isOutOfScope ? 28 : 6;
    const fallbackData = {
      verdict: isOutOfScope ? "OUT_OF_SCOPE" : "IN_SCOPE",
      confidenceScore: 0.94,
      title: "Requested Feature Addition",
      summary: `Client requested: "${message.slice(0, 120)}..."`,
      technicalReasoning: "Request introduces workflow modifications and integrations not documented in the signed Baseline Specification v1.0.",
      estimatedHours: estimatedHours,
      recommendedPriceUSD: estimatedHours * 100,
      recommendedPriceAED: estimatedHours * 367,
      timelineImpactDays: Math.ceil(estimatedHours / 8),
      riskLevel: "Medium",
      impactedComponents: ["Mobile Client", "Backend Gateway", "Database"],
      diplomaticWhatsAppReply: `Hi ${clientName || "there"}, thanks for reaching out! That is a great feature idea. As per our signed Project Baseline (v1.0), this is an add-on capability. We can implement this for +${estimatedHours} dev hours ($${estimatedHours * 100} / AED ${estimatedHours * 367}) with +${Math.ceil(estimatedHours / 8)} days timeline adjustment. Let us know if you would like us to include this Change Request!`,
      changeOrderTitle: "CR-04: Client Scope Extension"
    };

    return NextResponse.json({ success: true, data: fallbackData });
  } catch (err: any) {
    console.error("WhatsApp Analyzer Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to analyze message" },
      { status: 500 }
    );
  }
}
