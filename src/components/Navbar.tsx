'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AcornIcon from './AcornIcon';

interface NavbarProps {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

export default function Navbar({ isAdmin = false, isLoggedIn = false }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-sm border-b border-[#4B5A2A]/10">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/matenatre_side.png"
          alt="Maate Naatre"
          height={40}
          width={160}
          style={{ height: '40px', width: 'auto' }}
          priority
        />
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link
          href="/menu"
          className="text-[#4B5A2A] hover:text-[#3a4520] font-medium transition-colors text-sm tracking-wide uppercase"
        >
          Menu
        </Link>
        <Link
          href="/events"
          className="text-[#4B5A2A] hover:text-[#3a4520] font-medium transition-colors text-sm tracking-wide uppercase"
        >
          Events
        </Link>
        <Link
          href="/about"
          className="text-[#4B5A2A] hover:text-[#3a4520] font-medium transition-colors text-sm tracking-wide uppercase"
        >
          About
        </Link>

        {isLoggedIn ? (
          <>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-[#4B5A2A] hover:text-[#3a4520] font-medium transition-colors text-sm tracking-wide uppercase"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-[#4B5A2A] hover:text-[#3a4520] font-medium transition-colors text-sm tracking-wide uppercase"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="flex items-center gap-1 group" aria-label="Login">
            <AcornIcon size={28} />
          </Link>
        )}
      </div>
    </nav>
  );
}
