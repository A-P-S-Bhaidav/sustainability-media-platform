import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

describe('Middleware Rate Limiter', () => {
  const createRequest = (ip: string, pathname: string) => {
    const url = `http://localhost${pathname}`;
    return new NextRequest(url, {
      headers: new Headers({
        'x-forwarded-for': ip,
      }),
    });
  };

  it('allows requests under the rate limit', () => {
    const req = createRequest('192.168.1.1', '/api/dashboard');
    const res = middleware(req);
    expect(res.status).not.toBe(429);
  });

  it('blocks requests over the rate limit', () => {
    const ip = '192.168.1.2';
    // The limit is 50, so we send 51 requests
    let lastRes;
    for (let i = 0; i <= 50; i++) {
      const req = createRequest(ip, '/api/dashboard');
      lastRes = middleware(req);
    }
    
    expect(lastRes?.status).toBe(429);
  });

  it('ignores non-api routes', () => {
    const ip = '192.168.1.3';
    let lastRes;
    for (let i = 0; i <= 60; i++) {
      const req = createRequest(ip, '/dashboard');
      lastRes = middleware(req);
    }
    
    expect(lastRes?.status).not.toBe(429);
  });
});
