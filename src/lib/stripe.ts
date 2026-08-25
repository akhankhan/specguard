import Stripe from "stripe";

export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_specguard";
  return new Stripe(key, {
    apiVersion: "2025-02-24.acacia" as any,
    typescript: true,
  });
}

export const STRIPE_PLANS = {
  free: {
    name: "Starter Workspace",
    priceUSD: 0,
    priceId: null,
  },
  pro: {
    name: "Pro Studio Subscription",
    priceUSD: 39,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_subscription",
  },
  enterprise: {
    name: "Agency Enterprise",
    priceUSD: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_subscription",
  },
};
