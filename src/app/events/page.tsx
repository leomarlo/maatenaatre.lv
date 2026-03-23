import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import EventsClient from '@/components/EventsClient';

export const metadata: Metadata = {
  title: 'Pasākumi',
  description:
    'Meža ekskursijas, kokteiļu darbnīcas un augu darbnīcas Māte Nātre. Reģistrējies tiešsaistē.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'Pasākumi | Māte Nātre',
    description: 'Meža ekskursijas, kokteiļu darbnīcas un augu darbnīcas. Reģistrējies tiešsaistē.',
    url: 'https://maatenaatre.lv/events',
  },
};

export default async function EventsPage() {
  const [events, session] = await Promise.all([
    prisma.event.findMany({
      where: { visible: true },
      orderBy: { date: 'asc' },
      include: { _count: { select: { registrations: true } } },
    }),
    getSession(),
  ]);

  // If user is logged in, also fetch their registrations
  let userRegistrations: string[] = [];
  if (session) {
    const regs = await prisma.eventRegistration.findMany({
      where: { userId: session.userId },
      select: { eventId: true },
    });
    userRegistrations = regs.map(r => r.eventId);
  }

  return (
    <EventsClient
      events={events.map(e => ({
        ...e,
        date: e.date.toISOString(),
        registrationCount: e._count.registrations,
      }))}
      isLoggedIn={!!session}
      userEmail={session?.email ?? null}
      userRegistrations={userRegistrations}
    />
  );
}
