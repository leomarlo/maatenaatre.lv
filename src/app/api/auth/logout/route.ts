import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const cookieOptions = clearSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieOptions);
  return response;
}
