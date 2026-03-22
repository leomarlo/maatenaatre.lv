import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.type !== undefined) data.type = body.type;
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.guide !== undefined) data.guide = body.guide;
    if (body.description !== undefined) data.description = body.description;
    if (body.cost !== undefined) data.cost = body.cost ? parseFloat(body.cost) : null;
    if (body.spots !== undefined) data.spots = body.spots ? parseInt(body.spots) : null;
    if (body.requiresRegistration !== undefined) data.requiresRegistration = Boolean(body.requiresRegistration);
    if (body.visible !== undefined) data.visible = Boolean(body.visible);

    const event = await prisma.event.update({ where: { id }, data });
    return NextResponse.json(event);
  } catch (error) {
    console.error('[PUT /api/events/[id]]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/events/[id]]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
