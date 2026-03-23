import Image from 'next/image';
import { prisma } from '@/lib/db';

const DAY_SHORT: Record<number, string> = {
  1: 'Pirmd.',
  2: 'Otrd.',
  3: 'Trešd.',
  4: 'Ceturtd.',
  5: 'Piektd.',
  6: 'Sestd.',
  7: 'Svētd.',
};

type HoursRow = { dayOfWeek: number; morningOpen: string | null; morningClose: string | null; eveningOpen: string | null; eveningClose: string | null };

function formatSlot(open: string | null, close: string | null) {
  if (!open || !close) return null;
  return `${open}–${close}`;
}

function dayLabel(row: HoursRow): string {
  const morning = formatSlot(row.morningOpen, row.morningClose);
  const evening = formatSlot(row.eveningOpen, row.eveningClose);
  if (!morning && !evening) return 'Slēgts';
  return [morning, evening].filter(Boolean).join(', ');
}

function groupHours(rows: HoursRow[]) {
  const groups: { days: number[]; label: string }[] = [];
  for (const row of rows) {
    const label = dayLabel(row);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.days.push(row.dayOfWeek);
    } else {
      groups.push({ days: [row.dayOfWeek], label });
    }
  }
  return groups.map(g => {
    const first = DAY_SHORT[g.days[0]];
    const last = DAY_SHORT[g.days[g.days.length - 1]];
    const dayStr = g.days.length === 1 ? first : `${first} – ${last}`;
    return { dayStr, label: g.label };
  });
}

export default async function HomePage() {
  const hoursRows = await prisma.openingHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
  const groups = groupHours(hoursRows);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background forest image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80"
        alt="Forest"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <Image
          src="/matenatre_side.png"
          alt="Maate Naatre"
          width={340}
          height={120}
          className="mb-6 drop-shadow-lg"
          priority
          style={{ height: 'auto', maxWidth: '80vw' }}
        />
        <p className="text-white italic text-2xl md:text-3xl font-light tracking-wider mb-3 drop-shadow">
          meža bārs
        </p>
        <p className="text-white/70 text-sm tracking-widest uppercase mb-8">
          Matīsa iela 8, Rīga
        </p>

        {/* Opening hours */}
        {groups.length > 0 && (
          <div className="mt-2 text-center">
            <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Darba laiks</p>
            <div className="space-y-1.5">
              {groups.map(({ dayStr, label }) => (
                <div key={dayStr} className="flex gap-6 justify-between text-sm">
                  <span className="text-white/60">{dayStr}</span>
                  <span className={label === 'Slēgts' ? 'text-white/35' : 'text-white/90'}>{label}</span>
                </div>
              ))}
            </div>
            <p className="text-white/35 text-xs mt-4 max-w-xs leading-relaxed">
              Svētkos slēgts. Izstāžu atklāšanās un īpašos pasākumos arī strādājam —{' '}
              <a
                href="https://www.instagram.com/raa_riga"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white/60 transition-colors"
              >
                @raa_riga
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
