'use client';

import { useCallback, useEffect, useState } from 'react';

const MENU_CATEGORIES = ['Cocktail', 'Teas', 'Coffees', 'Lemonades', 'Snacks', 'Ice-creams', 'Non-material Things'];
const CATEGORY_LABELS: Record<string, string> = {
  Cocktail: 'Kokteiļi', Teas: 'Tējas', Coffees: 'Kafijas', Lemonades: 'Limonādes',
  Snacks: 'Uzkodas', 'Ice-creams': 'Saldējumi', 'Non-material Things': 'Nemateriālās lietas',
};

interface MenuItem {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
  buyingPrice: number;
  inStock: boolean;
  visibleInMenu: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  supplier: string;
  size: string;
  pricePerUnit: number;
  costPerDosage: number;
  dosageDescription: string;
  quantity: number;
  unit: string;
  notes: string;
}

const INPUT = 'w-full border border-[#4B5A2A]/30 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#4B5A2A] bg-white';
const LABEL = 'block text-xs font-medium text-[#4B5A2A] mb-1';
const TOGGLE = (on: boolean) =>
  `w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${on ? 'bg-[#4B5A2A]' : 'bg-gray-300'}`;

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={TOGGLE(on)} aria-label="toggle">
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

// ── Menu tab ──────────────────────────────────────────────────────────────────

const DEFAULT_MENU_FORM = { name: '', category: 'Cocktail', ingredients: '', description: '', price: '', buyingPrice: '', inStock: true, visibleInMenu: true };

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_MENU_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/menu-items/all');
      if (r.ok) setItems(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggle(id: string, field: 'inStock' | 'visibleInMenu', value: boolean) {
    await fetch(`/api/menu-items/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: value }) });
    load();
  }

  async function del(id: string) {
    if (!confirm('Dzēst šo ierakstu?')) return;
    await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    load();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const t = e.target;
    setForm(f => ({ ...f, [t.name]: t instanceof HTMLInputElement && t.type === 'checkbox' ? t.checked : t.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const r = await fetch('/api/menu-items', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), buyingPrice: parseFloat(form.buyingPrice || '0'), ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean) }),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.error); }
      setForm(DEFAULT_MENU_FORM);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kļūda');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-[#4B5A2A]/60">{items.length} ieraksti</span>
        <button onClick={() => setShowForm(s => !s)} className="px-4 py-1.5 bg-[#4B5A2A] text-white rounded text-sm hover:bg-[#3a4520] transition-colors">
          {showForm ? 'Aizvērt' : '+ Pievienot'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-lg border border-[#4B5A2A]/20 p-5 mb-6">
          {error && <p className="text-red-600 text-xs mb-3 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><label className={LABEL}>Nosaukums *</label><input name="name" value={form.name} onChange={handleChange} required className={INPUT} /></div>
            <div>
              <label className={LABEL}>Kategorija *</label>
              <select name="category" value={form.category} onChange={handleChange} className={INPUT}>
                {MENU_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div><label className={LABEL}>Cena (€) *</label><input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className={INPUT} /></div>
            <div><label className={LABEL}>Iepirkuma cena (€)</label><input name="buyingPrice" type="number" step="0.001" min="0" value={form.buyingPrice} onChange={handleChange} className={INPUT} /></div>
            <div className="md:col-span-2"><label className={LABEL}>Sastāvdaļas (ar komatu)</label><input name="ingredients" value={form.ingredients} onChange={handleChange} className={INPUT} /></div>
            <div className="col-span-2 md:col-span-3"><label className={LABEL}>Apraksts</label><textarea name="description" value={form.description} onChange={handleChange} rows={2} className={INPUT} /></div>
            <div className="col-span-2 md:col-span-3 flex gap-6">
              {(['inStock', 'visibleInMenu'] as const).map(f => (
                <label key={f} className="flex items-center gap-2 text-sm text-[#4B5A2A] cursor-pointer">
                  <input type="checkbox" name={f} checked={form[f] as boolean} onChange={handleChange} className="accent-[#4B5A2A]" />
                  {f === 'inStock' ? 'Pieejams' : 'Redzams ēdienkartē'}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-3 px-5 py-2 bg-[#4B5A2A] text-white rounded text-sm hover:bg-[#3a4520] disabled:opacity-60">
            {saving ? 'Saglabā…' : 'Pievienot'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-[#4B5A2A]/40">Ielādē…</div>
      ) : (
        <div className="bg-white rounded-lg border border-[#4B5A2A]/20 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#4B5A2A]/5 text-[#4B5A2A] text-left text-xs uppercase tracking-wide">
                <th className="px-3 py-3">Nosaukums</th>
                <th className="px-3 py-3">Kat.</th>
                <th className="px-3 py-3 text-right">Cena</th>
                <th className="px-3 py-3 text-right">Iepirk.</th>
                <th className="px-3 py-3 text-right">Peļņa €</th>
                <th className="px-3 py-3 text-right">Peļņa %</th>
                <th className="px-3 py-3 text-center">Pieej.</th>
                <th className="px-3 py-3 text-center">Redzams</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const gain = item.price - item.buyingPrice;
                const gainPct = item.buyingPrice > 0 ? (gain / item.buyingPrice) * 100 : 0;
                return (
                  <tr key={item.id} className={`border-t border-[#4B5A2A]/10 ${i % 2 === 0 ? '' : 'bg-[#4B5A2A]/[0.02]'}`}>
                    <td className="px-3 py-2.5 font-medium text-gray-800">{item.name}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{CATEGORY_LABELS[item.category] ?? item.category}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">€{item.price.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-500">€{item.buyingPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-green-700">€{gain.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-green-700">{gainPct.toFixed(0)}%</td>
                    <td className="px-3 py-2.5 text-center"><Toggle on={item.inStock} onClick={() => toggle(item.id, 'inStock', !item.inStock)} /></td>
                    <td className="px-3 py-2.5 text-center"><Toggle on={item.visibleInMenu} onClick={() => toggle(item.id, 'visibleInMenu', !item.visibleInMenu)} /></td>
                    <td className="px-3 py-2.5 text-right"><button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 text-xs">dzēst</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Inventory tab ─────────────────────────────────────────────────────────────

const DEFAULT_INV_FORM = { name: '', category: '', supplier: '', size: '', pricePerUnit: '', costPerDosage: '', dosageDescription: '', quantity: '', unit: 'gab.', notes: '' };

function InventoryTab() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_INV_FORM);
  const [saving, setSaving] = useState(false);
  const [editQty, setEditQty] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/inventory');
      if (r.ok) setItems(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveQty(id: string) {
    const val = editQty[id];
    if (val === undefined) return;
    await fetch(`/api/inventory/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: parseFloat(val) }) });
    setEditQty(e => { const n = { ...e }; delete n[id]; return n; });
    load();
  }

  async function del(id: string) {
    if (!confirm('Dzēst šo ierakstu?')) return;
    await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
    load();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch('/api/inventory', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pricePerUnit: parseFloat(form.pricePerUnit || '0'), costPerDosage: parseFloat(form.costPerDosage || '0'), quantity: parseFloat(form.quantity || '0') }),
      });
      if (r.ok) { setForm(DEFAULT_INV_FORM); setShowForm(false); load(); }
    } finally {
      setSaving(false);
    }
  }

  // Group by category
  const categories = [...new Set(items.map(i => i.category))].sort();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-[#4B5A2A]/60">{items.length} ieraksti</span>
        <button onClick={() => setShowForm(s => !s)} className="px-4 py-1.5 bg-[#4B5A2A] text-white rounded text-sm hover:bg-[#3a4520] transition-colors">
          {showForm ? 'Aizvērt' : '+ Pievienot'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-lg border border-[#4B5A2A]/20 p-5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><label className={LABEL}>Nosaukums *</label><input name="name" value={form.name} onChange={handleChange} required className={INPUT} /></div>
            <div><label className={LABEL}>Kategorija</label><input name="category" value={form.category} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Piegādātājs</label><input name="supplier" value={form.supplier} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Izmērs</label><input name="size" value={form.size} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Cena/vienība (€)</label><input name="pricePerUnit" type="number" step="0.01" value={form.pricePerUnit} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Izmaksas/deva (€)</label><input name="costPerDosage" type="number" step="0.001" value={form.costPerDosage} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Devas apraksts</label><input name="dosageDescription" value={form.dosageDescription} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Daudzums</label><input name="quantity" type="number" step="0.1" value={form.quantity} onChange={handleChange} className={INPUT} /></div>
            <div><label className={LABEL}>Mērvienība</label><input name="unit" value={form.unit} onChange={handleChange} className={INPUT} /></div>
            <div className="col-span-2 md:col-span-3"><label className={LABEL}>Piezīmes</label><input name="notes" value={form.notes} onChange={handleChange} className={INPUT} /></div>
          </div>
          <button type="submit" disabled={saving} className="mt-3 px-5 py-2 bg-[#4B5A2A] text-white rounded text-sm hover:bg-[#3a4520] disabled:opacity-60">
            {saving ? 'Saglabā…' : 'Pievienot'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-[#4B5A2A]/40">Ielādē…</div>
      ) : (
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#4B5A2A]/50 mb-2">{cat || 'Citi'}</h3>
              <div className="bg-white rounded-lg border border-[#4B5A2A]/20 overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-[#4B5A2A]/5 text-[#4B5A2A] text-left text-xs">
                      <th className="px-3 py-2">Nosaukums</th>
                      <th className="px-3 py-2">Piegādātājs</th>
                      <th className="px-3 py-2">Izmērs</th>
                      <th className="px-3 py-2 text-right">Cena/vien.</th>
                      <th className="px-3 py-2 text-right">Izm./deva</th>
                      <th className="px-3 py-2">Deva</th>
                      <th className="px-3 py-2 text-right">Daudzums</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(i => i.category === cat).map((item, idx) => (
                      <tr key={item.id} className={`border-t border-[#4B5A2A]/10 ${idx % 2 === 0 ? '' : 'bg-[#4B5A2A]/[0.02]'}`}>
                        <td className="px-3 py-2 font-medium text-gray-800">{item.name}{item.notes && <span className="text-gray-400 text-xs ml-1">({item.notes})</span>}</td>
                        <td className="px-3 py-2 text-gray-500">{item.supplier}</td>
                        <td className="px-3 py-2 text-gray-500">{item.size}</td>
                        <td className="px-3 py-2 text-right tabular-nums">€{item.pricePerUnit.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">€{item.costPerDosage.toFixed(3)}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{item.dosageDescription}</td>
                        <td className="px-3 py-2 text-right">
                          {editQty[item.id] !== undefined ? (
                            <span className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                step="0.1"
                                value={editQty[item.id]}
                                onChange={e => setEditQty(eq => ({ ...eq, [item.id]: e.target.value }))}
                                className="w-16 border border-[#4B5A2A]/40 rounded px-1.5 py-0.5 text-right text-xs"
                                autoFocus
                              />
                              <button onClick={() => saveQty(item.id)} className="text-green-600 text-xs hover:text-green-800">✓</button>
                              <button onClick={() => setEditQty(eq => { const n = { ...eq }; delete n[item.id]; return n; })} className="text-gray-400 text-xs hover:text-gray-600">✕</button>
                            </span>
                          ) : (
                            <button onClick={() => setEditQty(eq => ({ ...eq, [item.id]: String(item.quantity) }))} className="tabular-nums hover:text-[#4B5A2A] hover:underline">
                              {item.quantity} {item.unit}
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right"><button onClick={() => del(item.id)} className="text-red-400 hover:text-red-600 text-xs">dzēst</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main AdminClient ──────────────────────────────────────────────────────────

export default function AdminClient() {
  const [tab, setTab] = useState<'menu' | 'inventory'>('menu');

  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#4B5A2A]">Admin</h1>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-sm text-[#4B5A2A]/50 hover:text-[#4B5A2A]">Iziet</button>
          </form>
        </div>

        <div className="flex gap-1 mb-6 border-b border-[#4B5A2A]/15">
          {(['menu', 'inventory'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'border-[#4B5A2A] text-[#4B5A2A]' : 'border-transparent text-[#4B5A2A]/50 hover:text-[#4B5A2A]'}`}
            >
              {t === 'menu' ? 'Ēdienkarte' : 'Krājumi'}
            </button>
          ))}
        </div>

        {tab === 'menu' ? <MenuTab /> : <InventoryTab />}
      </div>
    </div>
  );
}
