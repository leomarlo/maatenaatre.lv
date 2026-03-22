import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendRegistrationNotification } from '@/lib/email';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { name } = await request.json() as { name: string };

    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const event = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event || !event.visible) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (!event.requiresRegistration) return NextResponse.json({ error: 'No registration needed' }, { status: 400 });
    if (event.spots !== null && event._count.registrations >= event.spots) {
      return NextResponse.json({ error: 'No spots available' }, { status: 409 });
    }

    const registration = await prisma.eventRegistration.create({
      data: { eventId: id, userId: session.userId, name: name.trim() },
    });

    await sendRegistrationNotification({
      eventTitle: event.title,
      eventDate: event.date,
      userName: name.trim(),
      userEmail: session.email,
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }
    console.error('[POST /api/events/[id]/register]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
