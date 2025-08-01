import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore =  await cookies(); // ✅ đây là object, không phải function

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // hoặc ANON KEY nếu không dùng service key
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: (key, value, options) => {
          // Không thể set cookie từ server action/SSR
          // Chỉ dùng nếu bạn đang ở trong middleware hoặc edge function
        },
        remove: (key, options) => {
          // Tương tự như set — thường không dùng ở đây
        },
      },
    }
  );
}
