'use client';

import { useEffect, useState } from 'react';

const CATEGORY_ORDER = ['Cocktail', 'Teas', 'Coffees', 'Lemonades', 'Snacks', 'Ice-creams', 'Non-material Things'];

const CATEGORY_LABELS: Record<string, string> = {
  Cocktail: 'Kokteiļi',
  Teas: 'Tējas',
  Coffees: 'Kafijas',
  Lemonades: 'Limonādes',
  Snacks: 'Uzkodas',
  'Ice-creams': 'Saldējumi',
  'Non-material Things': 'Nemateriālās lietas',
};

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu-items')
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#4B5A2A] mb-2">Ēdienkarte</h1>
        <p className="text-[#4B5A2A]/50 text-sm italic mb-10">
          Meža garšaugi, ogas un botāniskie augi.
        </p>

        {loading ? (
          <div className="text-[#4B5A2A]/40 text-center py-20">Ielādē…</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-[#4B5A2A]/40 text-center py-20">Pagaidām tukšs.</div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([cat, catItems]) => (
              <section key={cat}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#4B5A2A]/50 mb-3">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <div className="border-t border-[#4B5A2A]/15">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex justify-between items-baseline py-3 border-b border-[#4B5A2A]/10 ${!item.inStock ? 'opacity-40' : ''}`}
                    >
                      <span className="text-[#4B5A2A] font-medium">
                        {item.name}
                        {!item.inStock && (
                          <span className="ml-2 text-xs font-normal text-[#4B5A2A]/50">nav pieejams</span>
                        )}
                      </span>
                      <span className="text-[#4B5A2A] font-semibold tabular-nums">
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
