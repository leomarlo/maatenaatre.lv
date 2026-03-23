import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const hours = await prisma.openingHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
  return NextResponse.json(hours);
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows: { dayOfWeek: number; morningOpen?: string | null; morningClose?: string | null; eveningOpen?: string | null; eveningClose?: string | null }[] = await request.json();

  await Promise.all(
    rows.map(row =>
      prisma.openingHours.upsert({
        where: { dayOfWeek: row.dayOfWeek },
        update: { morningOpen: row.morningOpen ?? null, morningClose: row.morningClose ?? null, eveningOpen: row.eveningOpen ?? null, eveningClose: row.eveningClose ?? null },
        create: { dayOfWeek: row.dayOfWeek, morningOpen: row.morningOpen ?? null, morningClose: row.morningClose ?? null, eveningOpen: row.eveningOpen ?? null, eveningClose: row.eveningClose ?? null },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
