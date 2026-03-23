import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    default: 'Māte Nātre — meža bārs',
    template: '%s | Māte Nātre',
  },
  description:
    'Māte Nātre ir meža bārs Rīgā, Matīsa ielā 8. Savvaļas augi, ogas un botāniskie dzērieni. A forest bar in Riga serving wild herb cocktails, botanical lemonades, and forest teas.',
  keywords: [
    'meža bārs', 'Māte Nātre', 'Rīga', 'bārs', 'kokteiļi', 'botāniskie dzērieni',
    'savvaļas augi', 'forest bar', 'Riga bar', 'cocktails', 'herbal drinks',
    'Matīsa iela', 'RAA', 'pasākumi', 'ekskursijas',
  ],
  authors: [{ name: 'Māte Nātre' }],
  creator: 'Māte Nātre',
  metadataBase: new URL('https://maatenaatre.lv'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'lv_LV',
    alternateLocale: 'en_US',
    url: 'https://maatenaatre.lv',
    siteName: 'Māte Nātre',
    title: 'Māte Nātre — meža bārs Rīgā',
    description:
      'Meža bārs Rīgā ar savvaļas augu kokteiļiem, botāniskajām limonādēm un meža tējām. Matīsa iela 8.',
    images: [
      {
        url: '/matenatre_side.png',
        width: 340,
        height: 120,
        alt: 'Māte Nātre logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Māte Nātre — meža bārs Rīgā',
    description:
      'Meža bārs Rīgā ar savvaļas augu kokteiļiem, botāniskajām limonādēm un meža tējām.',
    images: ['/matenatre_side.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  category: 'food & drink',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="lv">
      <body>
        <Navbar isLoggedIn={!!session} isAdmin={session?.isAdmin ?? false} />
        <main>{children}</main>
      </body>
    </html>
  );
}
