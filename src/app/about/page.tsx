export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#4B5A2A] mb-2">About</h1>
        <div className="w-10 h-0.5 bg-[#4B5A2A] mb-8" />
        <p className="text-gray-700 leading-relaxed text-lg">
          Maate Naatre is a forest bar nestled within the RAA cultural space in
          Riga&apos;s creative district. Drawing inspiration from the Latvian
          forest, we craft drinks from wild herbs, berries, and botanicals
          gathered with care. Our space is small, unhurried, and alive with the
          quiet of trees. We believe in the alchemy of simple ingredients — a
          sprig of nettle, a sliver of quince, the warmth of pine resin —
          transformed into something that tastes like a walk you remember. Find
          us at Matīsa iela 8, inside Radošā rūpnīca Veldze.
        </p>
        <div className="mt-12 pt-8 border-t border-[#4B5A2A]/20">
          <p className="text-[#4B5A2A] font-medium">Maate Naatre</p>
          <p className="text-[#4B5A2A]/60 text-sm">meža bārs</p>
          <p className="text-[#4B5A2A]/60 text-sm mt-1">
            Matīsa iela 8, Rīga
          </p>
          <p className="text-[#4B5A2A]/60 text-sm">
            Radošā rūpnīca Veldze
          </p>
        </div>
      </div>
    </div>
  );
}
