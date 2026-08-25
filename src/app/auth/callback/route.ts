import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development" || origin.includes("localhost");
      
      const hasQuery = next.includes("?");
      const nextWithOnboarding = `${next}${hasQuery ? "&" : "?"}onboarding=true`;
      const targetUrl = isLocalEnv 
        ? `${origin}${nextWithOnboarding}`
        : forwardedHost 
          ? `https://${forwardedHost}${nextWithOnboarding}` 
          : `${origin}${nextWithOnboarding}`;

      return NextResponse.redirect(targetUrl);
    }
  }

  // If code was not present or exchange had an error, redirect to login with query
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
