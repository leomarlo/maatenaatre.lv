import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing menu items
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Māte Nātre',
        ingredients: ['vīgriezu', 'cidonija', 'nātre'],
        description: 'A herbal infusion with Latvian forest ingredients.',
        price: 2.0,
        purchasableOnline: false,
        inStock: true,
        visibleInMenu: true,
        imageUrl:
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80',
      },
      {
        name: 'Warm Pine',
        ingredients: ['pine syrup', 'almond milk'],
        description: 'Reminds of an autumn stroll in a pine forest.',
        price: 3.0,
        purchasableOnline: false,
        inStock: true,
        visibleInMenu: true,
        imageUrl:
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
      },
    ],
  });

  console.log('Seeded menu items.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
