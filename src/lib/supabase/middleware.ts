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

  // Verify actual authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Unauthenticated users trying to access protected routes -> Redirect to /login
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    const redirectRes = NextResponse.redirect(url);
    redirectRes.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    redirectRes.headers.set("Pragma", "no-cache");
    redirectRes.headers.set("Expires", "0");
    return redirectRes;
  }

  // 2. Authenticated users visiting /login or /signup -> Redirect to /dashboard
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Attach no-store cache headers to protected responses
  if (isProtectedRoute) {
    supabaseResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    supabaseResponse.headers.set("Pragma", "no-cache");
    supabaseResponse.headers.set("Expires", "0");
  }

  return supabaseResponse;
}
