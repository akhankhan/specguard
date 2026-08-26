import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated", detail: error?.message }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      identities: user.identities?.map(i => ({
        provider: i.provider,
        identity_data: i.identity_data,
      })),
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
