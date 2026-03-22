import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, category, ingredients, description, price, buyingPrice, inStock, visibleInMenu } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (ingredients !== undefined) data.ingredients = Array.isArray(ingredients) ? ingredients : String(ingredients).split(',').map((s: string) => s.trim());
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (buyingPrice !== undefined) data.buyingPrice = parseFloat(buyingPrice);
    if (inStock !== undefined) data.inStock = Boolean(inStock);
    if (visibleInMenu !== undefined) data.visibleInMenu = Boolean(visibleInMenu);

    const item = await prisma.menuItem.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (error) {
    console.error('[PUT /api/menu-items/[id]]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/menu-items/[id]]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
