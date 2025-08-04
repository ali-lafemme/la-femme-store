import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // التحقق من صفحات لوحة التحكم
  if (pathname.startsWith('/admin')) {
    // تجاهل صفحة تسجيل الدخول
    if (pathname === '/login') {
      return NextResponse.next();
    }

    // التحقق من وجود token في localStorage (سيتم التحقق من جانب العميل)
    // هذا middleware أساسي، والتحقق الكامل سيتم في الصفحات
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
}; 