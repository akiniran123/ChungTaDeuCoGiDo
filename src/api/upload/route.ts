// src/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient(); // ✅ Thêm await

  const body = await req.json();
  const { title, imageUrl, user_id } = body;

  const { data, error } = await supabase.from('images').insert([
    {
      title,
      image_url: imageUrl,
      user_id,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
