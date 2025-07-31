import { NextRequest, NextResponse } from 'next/server';
import createClient from '@/lib/supabase/serverClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, imageUrl, user_id } = body;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('images')
    .insert([{ title, image_url: imageUrl, user_id }]);

  return NextResponse.json({ data, error });
}
