import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const origin = new URL(request.url).origin;
    const response = NextResponse.json({ success: true });

    // Explicitly delete any sb- auth cookies
    const allCookies = request.headers.get("cookie") || "";
    allCookies.split(";").forEach((cookieStr) => {
      const cookieName = cookieStr.split("=")[0]?.trim();
      if (cookieName && (cookieName.startsWith("sb-") || cookieName.includes("auth-token"))) {
        response.cookies.delete(cookieName);
      }
    });

    return response;
  } catch (error: any) {
    console.error("Signout API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
