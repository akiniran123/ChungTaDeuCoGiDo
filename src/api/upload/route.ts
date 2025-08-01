import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import type { CookieOptions } from '@supabase/ssr'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {
          // Không cần thiết trong Server Component hoặc API route
        },
        remove: () => {
          // Không cần thiết trong Server Component hoặc API route
        },
      },
    }
  )
}
