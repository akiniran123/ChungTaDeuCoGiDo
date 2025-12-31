// app/api/tag-groups/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase env vars");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { community_id, name, description } = body ?? {};

    if (!community_id || !name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1) Get user from token
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = userData.user.id;

    // 2) Check role in community_members
    const { data: memberRows, error: memberErr } = await supabaseAdmin
      .from("community_members")
      .select("role")
      .eq("community_id", community_id)
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (memberErr) {
      return NextResponse.json({ error: "Failed to check membership" }, { status: 500 });
    }

    const role = (memberRows as any)?.role;
    const allowed = ["owner", "admin", "mod"];
    if (!role || !allowed.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3) Insert tag_group
    const { data: insertData, error: insertErr } = await supabaseAdmin
      .from("tag_groups")
      .insert([
        {
          community_id,
          name: name.trim(),
          description: description?.trim() ?? null,
        },
      ])
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ data: insertData }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}