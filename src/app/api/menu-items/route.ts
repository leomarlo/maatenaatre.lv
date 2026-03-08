import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      where: { visibleInMenu: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('[GET /api/menu-items]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    const item = await prisma.menuItem.create({
      data: {
        name,
        ingredients: Array.isArray(ingredients)
          ? ingredients
          : String(ingredients)
              .split(',')
              .map((s: string) => s.trim()),
        description,
        price: parseFloat(price),
        purchasableOnline: Boolean(purchasableOnline),
        inStock: Boolean(inStock),
        visibleInMenu: Boolean(visibleInMenu),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[POST /api/menu-items]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
