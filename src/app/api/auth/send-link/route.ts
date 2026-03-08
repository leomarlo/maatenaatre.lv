import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/db';
import { sendMagicLink } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    // Create auth token
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.authToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
    const link = `${baseUrl}/auth/verify?token=${token}`;

    await sendMagicLink(email, link);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[send-link]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
