import { NextRequest, NextResponse } from 'next/server';
import { signJWT, setSessionCookie } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'sveiki@maatenaatre.lv';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'hellomaatenaatre8';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as {
      email: string;
      password: string;
    };

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signJWT({
      userId: 'admin',
      email: ADMIN_EMAIL,
      isAdmin: true,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(setSessionCookie(token));
    return response;
  } catch (error) {
    console.error('[login]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
