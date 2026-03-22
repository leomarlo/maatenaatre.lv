'use client';

import { useState } from 'react';

const EVENT_TYPE_LABELS: Record<string, string> = {
  excursion: 'Ekskursija',
  workshop: 'Darbnīca',
  other: 'Pasākums',
};

interface EventData {
  id: string;
  title: string;
  type: string;
  date: string;
  guide: string;
  description: string;
  cost: number | null;
  spots: number | null;
  requiresRegistration: boolean;
  registrationCount: number;
}

interface Props {
  events: EventData[];
  isLoggedIn: boolean;
  userEmail: string | null;
  userRegistrations: string[];
}

function EventCard({ event, isLoggedIn, isRegistered, onRegistered }: {
  event: EventData;
  isLoggedIn: boolean;
  isRegistered: boolean;
  onRegistered: (eventId: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const date = new Date(event.date);
  const dayStr = date.toLocaleDateString('lv-LV', { weekday: 'long' });
  const spotsLeft = event.spots !== null ? event.spots - event.registrationCount : null;

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? 'Kļūda');
      setSuccess(true);
      setShowForm(false);
      onRegistered(event.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kļūda');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border-2 border-[#4B5A2A] px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-5">
          {/* Date block */}
          <div className="text-center min-w-[48px]">
            <div className="text-2xl font-bold text-[#4B5A2A] leading-none">{date.getDate()}</div>
            <div className="text-xs text-[#4B5A2A]/60 uppercase tracking-wide mt-1">
              {date.toLocaleDateString('lv-LV', { month: 'short' })}
            </div>
          </div>
          <div className="w-px h-12 bg-[#4B5A2A]/20 flex-shrink-0 mt-1" />
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[#4B5A2A] font-semibold text-lg leading-tight">{event.title}</span>
              <span className="text-xs bg-[#4B5A2A]/10 text-[#4B5A2A] px-2 py-0.5 rounded-full">
                {EVENT_TYPE_LABELS[event.type] ?? event.type}
              </span>
            </div>
            <div className="text-[#4B5A2A]/50 text-xs capitalize">{dayStr}</div>
            {event.guide && <div className="text-[#4B5A2A]/60 text-sm mt-1">Vadītājs: {event.guide}</div>}
            {event.description && <div className="text-[#4B5A2A]/70 text-sm mt-1">{event.description}</div>}
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {event.cost !== null && (
                <span className="text-[#4B5A2A] text-sm font-medium">€{event.cost.toFixed(2)}</span>
              )}
              {event.requiresRegistration && spotsLeft !== null && (
                <span className={`text-xs ${spotsLeft === 0 ? 'text-red-500' : 'text-[#4B5A2A]/60'}`}>
                  {spotsLeft === 0 ? 'Nav brīvu vietu' : `${spotsLeft} brīvas vietas`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Registration */}
        {event.requiresRegistration && (
          <div className="flex-shrink-0">
            {success || isRegistered ? (
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                Pieteikts ✓
              </span>
            ) : spotsLeft === 0 ? null : !isLoggedIn ? (
              <a href={`/login?from=/events`} className="text-xs bg-[#4B5A2A] text-white rounded-full px-4 py-1.5 hover:bg-[#3a4520] transition-colors">
                Pieteikties
              </a>
            ) : (
              <button
                onClick={() => setShowForm(s => !s)}
                className="text-xs bg-[#4B5A2A] text-white rounded-full px-4 py-1.5 hover:bg-[#3a4520] transition-colors"
              >
                {showForm ? 'Aizvērt' : 'Pieteikties'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Registration form */}
      {showForm && (
        <form onSubmit={register} className="mt-4 pt-4 border-t border-[#4B5A2A]/15 flex items-end gap-3">
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex-1">
            <label className="block text-xs text-[#4B5A2A]/60 mb-1">Jūsu vārds</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Vārds Uzvārds"
              className="w-full border border-[#4B5A2A]/30 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#4B5A2A]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-1.5 bg-[#4B5A2A] text-white rounded text-sm hover:bg-[#3a4520] disabled:opacity-60 transition-colors"
          >
            {loading ? '…' : 'Apstiprināt'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function EventsClient({ events, isLoggedIn, userRegistrations }: Props) {
  const [registered, setRegistered] = useState<string[]>(userRegistrations);

  function handleRegistered(eventId: string) {
    setRegistered(r => [...r, eventId]);
  }

  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#4B5A2A] mb-2">Pasākumi</h1>
        <p className="text-[#4B5A2A]/50 text-sm italic mb-10">Pavasaris 2026</p>

        {events.length === 0 ? (
          <div className="text-[#4B5A2A]/40 text-center py-20">Nav plānotu pasākumu.</div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isLoggedIn={isLoggedIn}
                isRegistered={registered.includes(event.id)}
                onRegistered={handleRegistered}
              />
            ))}
          </div>
        )}

        <p className="text-[#4B5A2A]/40 text-xs mt-10 tracking-widest uppercase text-center">
          Matīsa iela 8, Rīga
        </p>
      </div>
    </div>
  );
}
