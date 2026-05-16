import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthPath = authPaths.some(p => path.startsWith(p));

  const hasRefreshToken = request.cookies.has('refreshToken');

  if (isAuthPath && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path === '/') {
    if (hasRefreshToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/team/:path*',
    '/audit/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/',
  ],
};
