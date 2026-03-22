import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { visible: true },
      orderBy: { date: 'asc' },
      include: { _count: { select: { registrations: true } } },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('[GET /api/events]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        type: body.type,
        date: new Date(body.date),
        guide: body.guide ?? '',
        description: body.description ?? '',
        cost: body.cost ? parseFloat(body.cost) : null,
        spots: body.spots ? parseInt(body.spots) : null,
        requiresRegistration: Boolean(body.requiresRegistration),
        visible: body.visible !== false,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('[POST /api/events]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
