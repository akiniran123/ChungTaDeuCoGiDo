import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value ?? ''
        },
        set(name: string, value: string, options: CookieOptions) {
          res.headers.append('Set-Cookie', serializeCookie(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          res.headers.append('Set-Cookie', serializeCookie(name, '', { ...options, maxAge: -1 }))
        },
      },
    }
  )

  // Bạn có thể thêm logic ở đây nếu cần sau này

  return res
}

function serializeCookie(name: string, value: string, options: CookieOptions = {}) {
  const parts = [`${name}=${value}`]
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.domain) parts.push(`Domain=${options.domain}`)
  if (options.secure) parts.push(`Secure`)
  if (options.httpOnly) parts.push(`HttpOnly`)
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  return parts.join('; ')
}
