import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const supabase = createServerComponentClient<Database>({ cookies });

  const { error } = await supabase.from('products').insert([
    {
      ...body,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}