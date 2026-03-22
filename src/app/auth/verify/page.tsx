'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setErrorMsg('No token provided.');
      setStatus('error');
      return;
    }

    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? 'Verification failed');
        }
        const from = searchParams.get('from');
        router.push(from && from.startsWith('/') ? from : '/admin');
        router.refresh();
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setStatus('error');
      });
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="text-[#4B5A2A] text-lg mb-2">Verifying…</div>
        <p className="text-[#4B5A2A]/60 text-sm">Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-red-600 font-medium mb-2">Verification failed</div>
      <p className="text-gray-600 text-sm mb-4">{errorMsg}</p>
      <a
        href="/login"
        className="text-[#4B5A2A] underline text-sm hover:text-[#3a4520]"
      >
        Back to login
      </a>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-[#4B5A2A]/20 p-8 shadow-sm w-full max-w-sm">
        <Suspense fallback={<div className="text-[#4B5A2A]">Loading…</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
