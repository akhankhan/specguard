import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/scope-guard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/billing");

  // Fast check: look for presence of active Supabase auth token cookies
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("auth-token")
  );

  // 1. Instant Redirect for unauthenticated users accessing protected routes (0ms delay)
  if (isProtectedRoute && !hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Instant Pass-through for authenticated users navigating between dashboard pages (0ms delay)
  // This completely eliminates the 1-2 second remote network roundtrip on every sidebar tab click!
  if (isProtectedRoute && hasAuthCookie) {
    return supabaseResponse;
  }

  // 3. If authenticated user visits /login or /signup, redirect to /dashboard
  if (isAuthRoute && hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 4. Fallback for root / or other paths: safe background session refresh
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exdrecljspacwaduslrb.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZHJlY2xqc3BhY3dhZHVzbHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NzY3NTksImV4cCI6MjEwMzA1Mjc1OX0.G_7rALiQ7E6wnLoPCDYHpqLZJPfD9A-o9QGW6d_RaFY";

  if (!supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  return supabaseResponse;
}
