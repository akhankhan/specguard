import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const FALLBACK_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZHJlY2xqc3BhY3dhZHVzbHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NzY3NTksImV4cCI6MjEwMzA1Mjc1OX0.G_7rALiQ7E6wnLoPCDYHpqLZJPfD9A-o9QGW6d_RaFY";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exdrecljspacwaduslrb.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored if called from a Server Component
        }
      },
    },
  });
}
