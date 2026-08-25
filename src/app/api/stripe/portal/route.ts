import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      return NextResponse.json({
        success: true,
        isMock: true,
        message: "Stripe key not configured.",
        url: `${origin}/billing?portal=simulation`,
      });
    }

    const stripe = getStripeClient();

    // Lookup Stripe customer by user email or metadata
    const customers = await stripe.customers.list({
      email: user?.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No active Stripe customer found for this email account.",
      }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${origin}/billing`,
    });

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create portal session" },
      { status: 500 }
    );
  }
}
