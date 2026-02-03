// Middleware for Route Protection, Security, and Performance
// وسيط لحماية المسارات والأمان والأداء

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  SESSION_COOKIE_NAME,
  PROTECTED_ROUTES,
  AUTH_ROUTES,
  LOGIN_PAGE,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/auth/constants'

// Rate limiting (simple in-memory for Edge Runtime)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  
  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const allowed = checkRateLimit(ip, 100, 60000); // 100 requests per minute
    
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'تم تجاوز حد الطلبات' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  }
  
  // Stricter rate limiting for auth routes
  if (pathname.startsWith('/api/auth/') || pathname === '/login') {
    const allowed = checkRateLimit(`auth:${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
    
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'تم تجاوز حد محاولات تسجيل الدخول' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900', // 15 minutes
          },
        }
      );
    }
  }

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // Check if this is an auth route (login, etc.)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionToken) {
    const url = new URL(LOGIN_PAGE, request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If accessing auth route with session, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url))
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://upload-widget.cloudinary.com https://widget.cloudinary.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://api.cloudinary.com https://*.cloudinary.com https://upload.imagekit.io https://ik.imagekit.io https://*.imagekit.io",
    "frame-src 'self' https://upload-widget.cloudinary.com https://widget.cloudinary.com https://*.cloudinary.com https://*.imagekit.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // Note: Role-based access control is handled server-side in the page/layout
  // because middleware can't access the database directly in Edge Runtime

  return response;
}

export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
    // Match auth routes
    '/login',
    '/logout',
    '/forgot-password',
    '/reset-password',
  ],
}
