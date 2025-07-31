import { createSupabaseServerClient } from '@/lib/supabase/serverClient';

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();

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
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}
