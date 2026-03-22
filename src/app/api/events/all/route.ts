import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: { select: { registrations: true } },
        registrations: { include: { user: { select: { email: true } } }, orderBy: { createdAt: 'asc' } },
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('[GET /api/events/all]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
