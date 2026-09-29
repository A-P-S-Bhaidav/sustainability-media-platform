import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

// Simple in-memory rate limiting map for Edge Middleware
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 50; // Max requests per 10 seconds per IP
const TIME_WINDOW = 10000;

export default auth((req) => {
  const isApi = req.nextUrl.pathname.startsWith('/api/');
  
  // 1. Rate Limiting Logic (Only for APIs)
  if (isApi) {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    let limitData = rateLimitMap.get(ip);

    if (!limitData) {
      limitData = { count: 0, lastReset: now };
    }

    if (now - limitData.lastReset > TIME_WINDOW) {
      limitData.count = 0;
      limitData.lastReset = now;
    }

    limitData.count += 1;
    rateLimitMap.set(ip, limitData);

    if (limitData.count > RATE_LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: "Too Many Requests" }),
        { status: 429, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // 2. Auth Logic
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === '/';
  
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return null;
  }

  // Next.js API routes or webhooks will handle their own auth internally. 
  // We just let them pass through the middleware.
  if (isApi) {
    return null;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
  
  return null;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
