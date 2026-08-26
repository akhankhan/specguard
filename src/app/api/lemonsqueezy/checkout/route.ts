import { NextRequest, NextResponse } from "next/server";
import { LEMON_SQUEEZY_CONFIG } from "@/lib/lemonsqueezy";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId || !["pro", "enterprise"].includes(planId)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = `${origin}/billing?status=success&plan=${planId}&session_id=lemon_${Date.now()}`;

    // Create checkout session via official Lemon Squeezy API with automatic redirect_url
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${LEMON_SQUEEZY_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              redirect_url: redirectUrl,
              receipt_button_text: "Return to SpecGuard AI",
              receipt_link_url: redirectUrl,
            },
            checkout_data: {
              email: user?.email || undefined,
              name: user?.user_metadata?.full_name || user?.user_metadata?.name || undefined,
              custom: {
                user_id: user?.id || "guest",
                plan_id: planId,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: "459989",
              },
            },
            variant: {
              data: {
                type: "variants",
                id: "2057364",
              },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.attributes?.url) {
      console.error("Lemon Squeezy API error:", data);
      // Fallback to direct checkout link with success_url param
      const fallbackUrl = `https://specguard.lemonsqueezy.com/checkout/buy/9e16942b-ac83-43b7-a38c-bff41eef80ff?checkout[email]=${encodeURIComponent(user?.email || "")}&checkout[name]=${encodeURIComponent(user?.user_metadata?.full_name || user?.user_metadata?.name || "")}&checkout[success_url]=${encodeURIComponent(redirectUrl)}`;
      return NextResponse.json({
        success: true,
        url: fallbackUrl,
      });
    }

    return NextResponse.json({
      success: true,
      url: data.data.attributes.url,
    });
  } catch (error: any) {
    console.error("Lemon Squeezy checkout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
