// ✅ src/app/api/logout/route.ts
import { NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function GET() {
  const supabase = createServerActionClient<Database>({ cookies })

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL!))
}
