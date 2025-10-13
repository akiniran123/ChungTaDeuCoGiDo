// src/app/api/listing/route.ts
import { NextRequest } from 'next/server';
import { getServerClient } from '@/lib/supabase/serverClient';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await getServerClient();

  const { error } = await supabase.from('products').insert([
    {
      ...body,
      created_at: new Date().toISOString()
    },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
