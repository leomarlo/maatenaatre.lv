import { Metadata } from 'next';
import MenuClient from './MenuClient';

export const metadata: Metadata = {
  title: 'Ēdienkarte',
  description:
    'Māte Nātre ēdienkarte — savvaļas augu kokteiļi, botāniskās limonādes, meža tējas un uzkodas. Rīga, Matīsa iela 8.',
  alternates: { canonical: '/menu' },
  openGraph: {
    title: 'Ēdienkarte | Māte Nātre',
    description:
      'Savvaļas augu kokteiļi, botāniskās limonādes, meža tējas un uzkodas.',
    url: 'https://maatenaatre.lv/menu',
  },
};

export default function MenuPage() {
  return <MenuClient />;
}
