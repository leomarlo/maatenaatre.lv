import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const cookieOptions = clearSessionCookie();
  const response = NextResponse.redirect(new URL('/login', request.url), { status: 303 });
  response.cookies.set(cookieOptions);
  return response;
}
