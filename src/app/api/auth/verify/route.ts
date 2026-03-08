import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signJWT, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body as { token: string };

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const authToken = await prisma.authToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!authToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (authToken.used) {
      return NextResponse.json(
        { error: 'Token already used' },
        { status: 401 }
      );
    }

    if (authToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    // Mark token as used
    await prisma.authToken.update({
      where: { id: authToken.id },
      data: { used: true },
    });

    // Create JWT
    const jwt = signJWT({
      userId: authToken.user.id,
      email: authToken.user.email,
      isAdmin: authToken.user.isAdmin,
    });

    const cookieOptions = setSessionCookie(jwt);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error('[verify]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
