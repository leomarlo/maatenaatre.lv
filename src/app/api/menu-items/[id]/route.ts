import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      ingredients,
      description,
      price,
      purchasableOnline,
      inStock,
      visibleInMenu,
      imageUrl,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (ingredients !== undefined)
      updateData.ingredients = Array.isArray(ingredients)
        ? ingredients
        : String(ingredients)
            .split(',')
            .map((s: string) => s.trim());
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (purchasableOnline !== undefined)
      updateData.purchasableOnline = Boolean(purchasableOnline);
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (visibleInMenu !== undefined)
      updateData.visibleInMenu = Boolean(visibleInMenu);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;

    const item = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

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
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/menu-items/[id]]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
