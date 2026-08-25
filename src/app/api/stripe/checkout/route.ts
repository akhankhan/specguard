import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, STRIPE_PLANS } from "@/lib/stripe";
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

    // If Stripe secret key is not configured in env, graceful simulation mode
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      return NextResponse.json({
        success: true,
        isMock: true,
        message: "Stripe key not configured. Activated in simulation mode.",
        url: `${origin}/billing?session_id=mock_session_success&plan=${planId}`,
      });
    }

    const stripe = getStripeClient();
    const targetPriceId = STRIPE_PLANS[planId as "pro" | "enterprise"].priceId;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: targetPriceId,
          quantity: 1,
        },
      ],
      customer_email: user?.email || undefined,
      client_reference_id: user?.id || undefined,
      metadata: {
        userId: user?.id || "guest",
        planId,
      },
      success_url: `${origin}/billing?session_id={CHECKOUT_SESSION_ID}&status=success&plan=${planId}`,
      cancel_url: `${origin}/billing?status=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
