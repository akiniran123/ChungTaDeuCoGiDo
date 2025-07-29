import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Chặn người dùng không login truy cập /upload, /profile
  const protectedRoutes = ['/upload', '/profile'];
  const isProtected = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
export const config = {
  matcher: ['/upload', '/profile'],
};

