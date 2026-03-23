import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.inventoryItem.deleteMany();
  await prisma.menuItem.deleteMany();

  // ── Menu items ───────────────────────────────────────────────────────────────

  await prisma.menuItem.createMany({
    data: [
      // Cocktails
      {
        name: 'Frescobaldi',
        category: 'Cocktail',
        ingredients: ['Vīgriežu tēja', 'cidonija sīrups', 'kardamons'],
        description: 'fresh and energetic',
        price: 3.00,
        buyingPrice: 0.71,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Māte Nātre',
        category: 'Cocktail',
        ingredients: ['nātre tēja', 'cidonija sīrups', 'plūškoka ziedu sīrups'],
        description: 'green and salady',
        price: 3.00,
        buyingPrice: 0.75,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Plūnš',
        category: 'Cocktail',
        ingredients: ['plūškoka ogu nektārs', 'kanēlis', 'mežrozīte'],
        description: 'a spring punch',
        price: 3.00,
        buyingPrice: 1.83,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Meža Cūka',
        category: 'Cocktail',
        ingredients: ['ozolziļu kafija', 'čiekuru sīrups'],
        description: 'imagine living in the pine forest as a wild boar eating acorns',
        price: 3.00,
        buyingPrice: 0.98,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Lauras Aura',
        category: 'Cocktail',
        ingredients: ['mandeļu piens', 'čiekuru sīrups', 'kardamons'],
        description: 'a warm hug',
        price: 3.00,
        buyingPrice: 1.44,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Kaprīze',
        category: 'Cocktail',
        ingredients: ['salvijas tēja', 'cēriņu sīrups'],
        description: 'bittersweet',
        price: 3.00,
        buyingPrice: 0.80,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Pīlādžu karstais',
        category: 'Cocktail',
        ingredients: ['pīlādžu karstais nektārs'],
        description: '',
        price: 3.00,
        buyingPrice: 1.80,
        inStock: true,
        visibleInMenu: true,
      },

      // Lemonades
      {
        name: 'Pīlādžu limonāde',
        category: 'Lemonades',
        ingredients: ['LIVO pīlādžu limonāde'],
        description: '',
        price: 2.70,
        buyingPrice: 1.65,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Savvaļas ziedu limonāde',
        category: 'Lemonades',
        ingredients: ['LIVO savvaļas ziedu limonāde'],
        description: '',
        price: 2.70,
        buyingPrice: 1.65,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Kokmuižas bezalkoholiskais',
        category: 'Lemonades',
        ingredients: ['Kokmuiža bezalkoholiskais alus'],
        description: '',
        price: 2.70,
        buyingPrice: 1.99,
        inStock: true,
        visibleInMenu: true,
      },

      // Teas
      {
        name: 'Kumelīšu tēja',
        category: 'Teas',
        ingredients: ['kumelītes'],
        description: '',
        price: 2.00,
        buyingPrice: 0.175,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Piparmētru tēja',
        category: 'Teas',
        ingredients: ['piparmētras'],
        description: '',
        price: 2.00,
        buyingPrice: 0.33,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Vīgriežu tēja',
        category: 'Teas',
        ingredients: ['vīgrieze'],
        description: '',
        price: 2.00,
        buyingPrice: 0.20,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Salvijas tēja',
        category: 'Teas',
        ingredients: ['salvija'],
        description: '',
        price: 2.00,
        buyingPrice: 0.30,
        inStock: true,
        visibleInMenu: true,
      },

      // Snacks
      {
        name: 'Sukādes asorti',
        category: 'Snacks',
        ingredients: ['rabarberi', 'cidonija', 'ogas'],
        description: '',
        price: 3.00,
        buyingPrice: 1.60,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Cidoniju sukādes',
        category: 'Snacks',
        ingredients: ['cidonija'],
        description: '',
        price: 3.00,
        buyingPrice: 1.60,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Čiekuru sukādes',
        category: 'Snacks',
        ingredients: ['priedes čiekuri'],
        description: '',
        price: 5.00,
        buyingPrice: 3.00,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Ķirbju cepumi (2 gb)',
        category: 'Snacks',
        ingredients: ['ķirbji'],
        description: '',
        price: 0.80,
        buyingPrice: 0.4375,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Mandeļu cepumi (2 gb)',
        category: 'Snacks',
        ingredients: ['mandeles'],
        description: '',
        price: 0.80,
        buyingPrice: 0.4375,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Dzērveņu cepumi (2 gb)',
        category: 'Snacks',
        ingredients: ['dzērvenes'],
        description: '',
        price: 0.80,
        buyingPrice: 0.4375,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Linsēklu cepumi (2 gb)',
        category: 'Snacks',
        ingredients: ['linsēklas'],
        description: '',
        price: 0.80,
        buyingPrice: 0.4375,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Zemesriekstu cepumi (2 gb)',
        category: 'Snacks',
        ingredients: ['zemesrieksti'],
        description: '',
        price: 0.80,
        buyingPrice: 0.4375,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Lakricas nūjiņas (pk.)',
        category: 'Snacks',
        ingredients: ['lakrica'],
        description: '',
        price: 4.00,
        buyingPrice: 3.00,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Lakricas nūjiņa',
        category: 'Snacks',
        ingredients: ['lakrica'],
        description: '',
        price: 0.50,
        buyingPrice: 0.30,
        inStock: true,
        visibleInMenu: true,
      },
      {
        name: 'Ķirbju cepumi (pk.)',
        category: 'Snacks',
        ingredients: ['ķirbji'],
        description: '',
        price: 5.00,
        buyingPrice: 3.50,
        inStock: true,
        visibleInMenu: false,
      },
      {
        name: 'Mandeļu cepumi (pk.)',
        category: 'Snacks',
        ingredients: ['mandeles'],
        description: '',
        price: 5.00,
        buyingPrice: 3.50,
        inStock: true,
        visibleInMenu: false,
      },
      {
        name: 'Dzērveņu cepumi (pk.)',
        category: 'Snacks',
        ingredients: ['dzērvenes'],
        description: '',
        price: 5.00,
        buyingPrice: 3.50,
        inStock: true,
        visibleInMenu: false,
      },
      {
        name: 'Linsēklu cepumi (pk.)',
        category: 'Snacks',
        ingredients: ['linsēklas'],
        description: '',
        price: 5.00,
        buyingPrice: 3.50,
        inStock: true,
        visibleInMenu: false,
      },
      {
        name: 'Zemesriekstu cepumi (pk.)',
        category: 'Snacks',
        ingredients: ['zemesrieksti'],
        description: '',
        price: 5.00,
        buyingPrice: 3.50,
        inStock: true,
        visibleInMenu: false,
      },
    ],
  });

  // ── Inventory items ──────────────────────────────────────────────────────────

  await prisma.inventoryItem.createMany({
    data: [
      // Teas
      { name: 'Mežrozīte', category: 'Teas', supplier: 'Rūķīšu tēja', size: '100g', pricePerUnit: 3.00, costPerDosage: 0.12, dosageDescription: '4g', quantity: 1, unit: 'gab.', notes: '' },
      { name: 'Vīgrieze', category: 'Teas', supplier: 'Rūķīšu tēja', size: '50g', pricePerUnit: 2.50, costPerDosage: 0.20, dosageDescription: '4g', quantity: 6, unit: 'gab.', notes: '' },
      { name: 'Nātre', category: 'Teas', supplier: 'Rūķīšu tēja', size: '30g', pricePerUnit: 2.50, costPerDosage: 0.25, dosageDescription: '3g', quantity: 6, unit: 'gab.', notes: '' },
      { name: 'Liepziedi', category: 'Teas', supplier: 'Rūķīšu tēja', size: '20g', pricePerUnit: 3.00, costPerDosage: 0.375, dosageDescription: '2.5g', quantity: 9, unit: 'gab.', notes: '' },
      { name: 'Kumelītes', category: 'Teas', supplier: 'Rūķīšu tēja', size: '100g', pricePerUnit: 5.00, costPerDosage: 0.175, dosageDescription: '3.5g', quantity: 2, unit: 'gab.', notes: '' },
      { name: 'Salvijas', category: 'Teas', supplier: 'Rūķīšu tēja', size: '30g', pricePerUnit: 2.50, costPerDosage: 0.30, dosageDescription: '3.5g', quantity: 3, unit: 'gab.', notes: '' },
      { name: 'Piparmētras', category: 'Teas', supplier: 'Rūķīšu tēja', size: '30g', pricePerUnit: 2.50, costPerDosage: 0.33, dosageDescription: '4g', quantity: 4, unit: 'gab.', notes: '' },

      // Cookies
      { name: 'Ķirbju cepumi', category: 'Cookies', supplier: 'FITY', size: '150g', pricePerUnit: 3.50, costPerDosage: 0.4375, dosageDescription: '2 gab.', quantity: 4, unit: 'gab.', notes: '' },
      { name: 'Mandeļu cepumi', category: 'Cookies', supplier: 'FITY', size: '150g', pricePerUnit: 3.50, costPerDosage: 0.4375, dosageDescription: '2 gab.', quantity: 5, unit: 'gab.', notes: '' },
      { name: 'Dzērveņu cepumi', category: 'Cookies', supplier: 'FITY', size: '150g', pricePerUnit: 3.50, costPerDosage: 0.4375, dosageDescription: '2 gab.', quantity: 5, unit: 'gab.', notes: '' },
      { name: 'Linsēklu cepumi', category: 'Cookies', supplier: 'FITY', size: '150g', pricePerUnit: 3.50, costPerDosage: 0.4375, dosageDescription: '2 gab.', quantity: 5, unit: 'gab.', notes: '' },
      { name: 'Zemesriekstu cepumi', category: 'Cookies', supplier: 'FITY', size: '150g', pricePerUnit: 3.50, costPerDosage: 0.4375, dosageDescription: '2 gab.', quantity: 5, unit: 'gab.', notes: '' },

      // Pine cones
      { name: 'Čiekuru sīrups', category: 'Pine cones', supplier: 'Mītavas čiekurs', size: '300ml', pricePerUnit: 5.00, costPerDosage: 0.53, dosageDescription: '40ml (shot)', quantity: 10, unit: 'gab.', notes: '' },
      { name: 'Čiekuru sukādes', category: 'Pine cones', supplier: 'Mītavas čiekurs', size: '100g', pricePerUnit: 3.00, costPerDosage: 0.05, dosageDescription: '1 gab. (no ~60)', quantity: 10, unit: 'gab.', notes: '' },

      // Syrups
      { name: 'Plūškoka ziedu sīrups', category: 'Syrups', supplier: 'LIVO', size: '750ml', pricePerUnit: 7.50, costPerDosage: 0.50, dosageDescription: '50ml (liela karotīte)', quantity: 3, unit: 'gab.', notes: '' },
      { name: 'Plūškoka ogu nektārs', category: 'Syrups', supplier: 'LIVO', size: '330ml', pricePerUnit: 5.00, costPerDosage: 1.70, dosageDescription: '110ml (trešdaļa krūzes)', quantity: 10, unit: 'gab.', notes: '' },
      { name: 'Cēriņu sīrups', category: 'Syrups', supplier: 'LIVO', size: '750ml', pricePerUnit: 7.50, costPerDosage: 0.50, dosageDescription: '50ml (liela karotīte)', quantity: 3, unit: 'gab.', notes: '' },
      { name: 'Cidoniju sīrups', category: 'Syrups', supplier: 'LIVO', size: '750ml', pricePerUnit: 7.50, costPerDosage: 0.50, dosageDescription: '50ml (liela karotīte)', quantity: 3, unit: 'gab.', notes: '' },

      // Lemonades
      { name: 'Pīlādžu limonāde', category: 'Lemonades', supplier: 'LIVO', size: '330ml', pricePerUnit: 1.65, costPerDosage: 1.65, dosageDescription: '330ml (pudele)', quantity: 20, unit: 'gab.', notes: '' },
      { name: 'Savvaļas ziedu limonāde', category: 'Lemonades', supplier: 'LIVO', size: '330ml', pricePerUnit: 1.65, costPerDosage: 1.65, dosageDescription: '330ml (pudele)', quantity: 10, unit: 'gab.', notes: '' },
      { name: 'Bezalkoholiskais alus', category: 'Lemonades', supplier: 'Kokmuiža', size: '330ml', pricePerUnit: 1.90, costPerDosage: 1.90, dosageDescription: '330ml (pudele)', quantity: 20, unit: 'gab.', notes: '' },
      { name: 'Pīlādžu karstais nektārs', category: 'Lemonades', supplier: 'LIVO', size: '1l', pricePerUnit: 6.00, costPerDosage: 1.80, dosageDescription: '300ml (krūze)', quantity: 10, unit: 'gab.', notes: '' },

      // Candied fruits
      { name: 'Cidoniju sukādes', category: 'Candied fruits', supplier: 'Granberry', size: '100g', pricePerUnit: 1.60, costPerDosage: 0.40, dosageDescription: '25g (ceturtdaļa)', quantity: 4, unit: 'gab.', notes: '' },
      { name: 'Sukādes asorti', category: 'Candied fruits', supplier: 'Granberry', size: '100g', pricePerUnit: 1.60, costPerDosage: 0.40, dosageDescription: '25g (ceturtdaļa)', quantity: 11, unit: 'gab.', notes: '' },

      // Coffee
      { name: 'Ozolziļu kafija', category: 'Coffee', supplier: 'Dvaro Kavos', size: '700g', pricePerUnit: 25.41, costPerDosage: 0.45, dosageDescription: '15g (krūze)', quantity: 2, unit: 'gab.', notes: 'incl. 21% VAT' },
      { name: 'Miežu kafija', category: 'Coffee', supplier: 'Dvaro Kavos', size: '700g', pricePerUnit: 9.68, costPerDosage: 0.17, dosageDescription: '15g (krūze)', quantity: 2, unit: 'gab.', notes: 'incl. VAT' },
      { name: 'Warm Up kafija', category: 'Coffee', supplier: 'Dvaro Kavos', size: '700g', pricePerUnit: 25.41, costPerDosage: 0.45, dosageDescription: '15g (krūze)', quantity: 2, unit: 'gab.', notes: 'incl. 21% VAT' },
      { name: 'Ozolziļu kafija (pārdošanai)', category: 'Coffee', supplier: 'Dvaro Kavos', size: '100g', pricePerUnit: 4.24, costPerDosage: 0, dosageDescription: '', quantity: 13, unit: 'gab.', notes: 'incl. VAT' },
      { name: 'Miežu kafija (pārdošanai)', category: 'Coffee', supplier: 'Dvaro Kavos', size: '100g', pricePerUnit: 2.42, costPerDosage: 0, dosageDescription: '', quantity: 9, unit: 'gab.', notes: 'incl. VAT' },
      { name: 'Warm Up kafija (pārdošanai)', category: 'Coffee', supplier: 'Dvaro Kavos', size: '100g', pricePerUnit: 4.24, costPerDosage: 0, dosageDescription: '', quantity: 6, unit: 'gab.', notes: 'incl. VAT' },

      // Milk
      { name: 'Mandeļu piens Apro', category: 'Milk', supplier: 'Apro', size: '1l', pricePerUnit: 3.00, costPerDosage: 0.90, dosageDescription: '300ml (krūze)', quantity: 2, unit: 'gab.', notes: '' },
      { name: 'Mandeļu piens (cita marka)', category: 'Milk', supplier: 'Cita marka', size: '1l', pricePerUnit: 2.00, costPerDosage: 0.60, dosageDescription: '300ml (krūze)', quantity: 1, unit: 'gab.', notes: '' },

      // Spices
      { name: 'Kardamons', category: 'Spices', supplier: '?', size: '110g', pricePerUnit: 7.00, costPerDosage: 0.013, dosageDescription: '0.2g (divi kratieni)', quantity: 1, unit: 'gab.', notes: '' },
      { name: 'Kanēlis', category: 'Spices', supplier: '?', size: '100g', pricePerUnit: 7.00, costPerDosage: 0.014, dosageDescription: '0.2g (divi kratieni)', quantity: 1, unit: 'gab.', notes: '' },
      { name: 'Kurkuma', category: 'Spices', supplier: '?', size: '110g', pricePerUnit: 7.00, costPerDosage: 0.013, dosageDescription: '0.2g (divi kratieni)', quantity: 1, unit: 'gab.', notes: '' },

      // Other
      { name: 'Lakricas nūjiņas', category: 'Other', supplier: 'Mental', size: '20 gab.', pricePerUnit: 6.00, costPerDosage: 0.30, dosageDescription: '1 nūjiņa', quantity: 2, unit: 'gab.', notes: 'aprēķins: 0.30 EUR/nūjiņa' },
    ],
  });

  // ── Events ────────────────────────────────────────────────────────────────

  await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: [
      {
        title: 'Meža ekskursija',
        type: 'excursion',
        date: new Date('2026-04-26T11:00:00'),
        guide: '',
        description: 'Pastaiga mežā, iepazīstot savvaļas augus un dabas ritmus.',
        requiresRegistration: true,
        visible: true,
      },
      {
        title: 'Meža ekskursija',
        type: 'excursion',
        date: new Date('2026-05-03T11:00:00'),
        guide: '',
        description: 'Pastaiga mežā, iepazīstot savvaļas augus un dabas ritmus.',
        requiresRegistration: true,
        visible: true,
      },
      {
        title: 'Meža ekskursija',
        type: 'excursion',
        date: new Date('2026-05-10T11:00:00'),
        guide: '',
        description: 'Pastaiga mežā, iepazīstot savvaļas augus un dabas ritmus.',
        requiresRegistration: true,
        visible: true,
      },
      {
        title: 'Kokteiļu darbnīca',
        type: 'workshop',
        date: new Date('2026-05-14T18:00:00'),
        guide: '',
        description: 'Uzzini, kā radīt botāniskos kokteiļus ar savvaļas augiem un sezonāliem sīrupiem.',
        requiresRegistration: true,
        visible: true,
      },
      {
        title: 'Meža ekskursija',
        type: 'excursion',
        date: new Date('2026-05-17T11:00:00'),
        guide: '',
        description: 'Pastaiga mežā, iepazīstot savvaļas augus un dabas ritmus.',
        requiresRegistration: true,
        visible: true,
      },
      {
        title: 'Meža ekskursija',
        type: 'excursion',
        date: new Date('2026-05-24T11:00:00'),
        guide: '',
        description: 'Pastaiga mežā, iepazīstot savvaļas augus un dabas ritmus.',
        requiresRegistration: true,
        visible: true,
      },
      {
        title: 'Augu darbnīca',
        type: 'workshop',
        date: new Date('2026-05-31T11:00:00'),
        guide: '',
        description: 'Iepazīsti ārstnieciskos un ēdamos savvaļas augus un to izmantošanu ikdienā.',
        requiresRegistration: true,
        visible: true,
      },
    ],
  });

  console.log('Seeded menu items, inventory items, and events.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
