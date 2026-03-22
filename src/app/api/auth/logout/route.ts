import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const cookieOptions = clearSessionCookie();
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'), { status: 303 });
  response.cookies.set(cookieOptions);
  return response;
}
