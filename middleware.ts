import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Protect /pdf-form routes
  if (request.nextUrl.pathname.startsWith('/pdf-form')) {
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pdf-form/:path*'],
};
