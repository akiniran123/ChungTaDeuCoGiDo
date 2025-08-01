import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Bot user agents
const botUserAgents = ['bot', 'crawler', 'spider', 'crawling']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // 1. Bot detection
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || ''
  const isBot = botUserAgents.some((bot) => userAgent.includes(bot))
  if (isBot) {
    return new NextResponse('Bots are not allowed.', { status: 403 })
  }

  // 2. Create Supabase server client manually
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          res.cookies.delete({ name, ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Protect routes
  const protectedPaths = ['/sell', '/profile', '/admin']
  const pathname = req.nextUrl.pathname
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Custom headers
  req.headers.set('x-powered-by', 'middleware')
  res.headers.set('x-custom-header', 'middleware-active')

  return res
}
