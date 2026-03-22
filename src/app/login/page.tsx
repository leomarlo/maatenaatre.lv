'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [magicEmail, setMagicEmail] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Something went wrong');
      }

      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicError('');
    setMagicLoading(true);

    try {
      const res = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: magicEmail, from }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Something went wrong');
      }

      setMagicSent(true);
    } catch (err: unknown) {
      setMagicError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setMagicLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-[#4B5A2A]/20 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#4B5A2A] mb-1">Sign in</h1>
          <p className="text-[#4B5A2A]/60 text-sm mb-6">Admin access</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}
            <label className="block text-sm font-medium text-[#4B5A2A] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="sveiki@maatenaatre.lv"
              className="w-full border border-[#4B5A2A]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4B5A2A] mb-4"
            />
            <label className="block text-sm font-medium text-[#4B5A2A] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#4B5A2A]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4B5A2A] mb-6"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4B5A2A] text-white rounded py-2 text-sm font-medium hover:bg-[#3a4520] transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#4B5A2A]/15" />
            <span className="text-xs text-[#4B5A2A]/40 uppercase tracking-wide">vai</span>
            <div className="flex-1 h-px bg-[#4B5A2A]/15" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#4B5A2A] mb-1">Reģistrācijai pasākumiem</h2>
            <p className="text-[#4B5A2A]/50 text-xs mb-4">Ievadiet e-pastu un saņemsiet saiti pieteikšanās.</p>

            {magicSent ? (
              <div className="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-center">
                Pārbaudiet savu e-pastu!
              </div>
            ) : (
              <form onSubmit={handleMagicLink}>
                {magicError && (
                  <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {magicError}
                  </p>
                )}
                <label className="block text-sm font-medium text-[#4B5A2A] mb-1">
                  E-pasts
                </label>
                <input
                  type="email"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  required
                  placeholder="jusu@epasts.lv"
                  className="w-full border border-[#4B5A2A]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4B5A2A] mb-4"
                />
                <button
                  type="submit"
                  disabled={magicLoading}
                  className="w-full bg-[#4B5A2A]/10 text-[#4B5A2A] border border-[#4B5A2A]/30 rounded py-2 text-sm font-medium hover:bg-[#4B5A2A]/20 transition-colors disabled:opacity-60"
                >
                  {magicLoading ? 'Sūta…' : 'Saņemt saiti'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 bg-[#f5f4ef] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-[#4B5A2A]/20 p-8 shadow-sm w-full max-w-sm">
          <div className="text-[#4B5A2A]">Ielādē…</div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
