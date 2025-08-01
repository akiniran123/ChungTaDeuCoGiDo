// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value ?? '',
        set: (name: string, value: string, options: CookieOptions) => {
          const cookie = serializeCookie(name, value, options)
          res.headers.append('Set-Cookie', cookie)
        },
        remove: (name: string, options: CookieOptions) => {
          const cookie = serializeCookie(name, '', { ...options, maxAge: -1 })
          res.headers.append('Set-Cookie', cookie)
        },
      },
    }
  )

  // ví dụ logic auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // redirect nếu chưa login
  if (!user && req.nextUrl.pathname.startsWith('/sell')) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

// serialize cookie cho middleware
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
