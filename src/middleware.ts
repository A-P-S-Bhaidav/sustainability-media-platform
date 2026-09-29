import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting map for Edge Middleware
// Note: In a real Vercel Edge environment, this Map resets when the lambda scales. 
// For a true 100/100 enterprise environment, this would connect to Upstash Redis.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 50; // Max requests per 10 seconds per IP
const TIME_WINDOW = 10000;

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();

  const isApi = request.nextUrl.pathname.startsWith('/api/');
  
  if (isApi) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
