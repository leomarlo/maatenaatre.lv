import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Maate Naatre — meža bārs',
  description:
    'A forest bar nestled within the RAA cultural space in Riga. Wild herbs, berries, and botanicals.',
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
