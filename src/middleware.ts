import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Bot user agents
const botUserAgents = ['bot', 'crawler', 'spider', 'crawling']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // 👇 This will correctly set cookie using header
          res.headers.append('Set-Cookie', createSerializedCookie(name, value, options))
        },
        remove(name: string, options: CookieOptions) {
          res.headers.append('Set-Cookie', createSerializedCookie(name, '', { ...options, maxAge: -1 }))
        },
      },
    }
  )

  // Bot detection
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || ''
  const isBot = botUserAgents.some((bot) => userAgent.includes(bot))
  if (isBot) {
    return new NextResponse('Bots are not allowed.', { status: 403 })
  }

  // Auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes
  const protectedPaths = ['/sell', '/profile', '/admin']
  const pathname = req.nextUrl.pathname
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Custom headers
  res.headers.set('x-custom-header', 'middleware-active')

  return res
}

// Cookie serializer (minimal)
function createSerializedCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${name}=${value}`]
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.domain) parts.push(`Domain=${options.domain}`)
  if (options.secure) parts.push(`Secure`)
  if (options.httpOnly) parts.push(`HttpOnly`)
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  return parts.join('; ')
}
