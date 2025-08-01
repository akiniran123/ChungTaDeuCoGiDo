import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// ✅ Middleware để kiểm tra đăng nhập cho một số route
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          res.headers.append('Set-Cookie', serializeCookie(name, value, options))
        },
        remove: (name: string, options: CookieOptions) => {
          res.headers.append('Set-Cookie', serializeCookie(name, '', { ...options, maxAge: -1 }))
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// 🔧 Giới hạn middleware chỉ chạy ở một số route cần đăng nhập
export const config = {
  matcher: ['/sell', '/profile/:path*', '/admin/:path*'],
}

// 🔒 Hàm tạo cookie cho SSR
function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const parts = [`${name}=${value}`]
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.domain) parts.push(`Domain=${options.domain}`)
  if (options.secure) parts.push(`Secure`)
  if (options.httpOnly) parts.push(`HttpOnly`)
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  return parts.join('; ')
}
