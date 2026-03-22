import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
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
        <p className="text-white/70 text-sm tracking-widest uppercase mb-10">
          Matīsa iela 8, Rīga
        </p>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <Link href="/menu" className="text-white/80 hover:text-white text-sm tracking-widest uppercase transition-colors">
            Ēdienkarte
          </Link>
          <Link href="/events" className="text-white/80 hover:text-white text-sm tracking-widest uppercase transition-colors">
            Pasākumi
          </Link>
          <Link href="/about" className="text-white/80 hover:text-white text-sm tracking-widest uppercase transition-colors">
            Par mums
          </Link>
        </div>
      </div>
    </div>
  );
}
