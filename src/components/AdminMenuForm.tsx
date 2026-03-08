'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  ingredients: string;
  description: string;
  price: string;
  imageUrl: string;
  purchasableOnline: boolean;
  inStock: boolean;
  visibleInMenu: boolean;
}

const DEFAULT_FORM: FormData = {
  name: '',
  ingredients: '',
  description: '',
  price: '',
  imageUrl: '',
  purchasableOnline: false,
  inStock: true,
  visibleInMenu: true,
};

interface AdminMenuFormProps {
  onCreated: () => void;
}

export default function AdminMenuForm({ onCreated }: AdminMenuFormProps) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm((f) => ({ ...f, [target.name]: target.checked }));
    } else {
      setForm((f) => ({ ...f, [target.name]: target.value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          ingredients: form.ingredients
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create item');
      }

      setForm(DEFAULT_FORM);
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full border border-[#4B5A2A]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#4B5A2A] bg-white';
  const labelClass = 'block text-sm font-medium text-[#4B5A2A] mb-1';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-[#4B5A2A]/20 p-6 mb-8"
    >
      <h2 className="text-[#4B5A2A] font-semibold text-lg mb-4">
        Add New Item
      </h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Māte Nātre"
          />
        </div>

        <div>
          <label className={labelClass}>Price (€) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="2.50"
          />
        </div>

        <div>
          <label className={labelClass}>Ingredients (comma-separated)</label>
          <input
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className={inputClass}
            placeholder="nettle, pine syrup, lemon"
          />
        </div>

        <div>
          <label className={labelClass}>Image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className={inputClass}
            placeholder="A brief description..."
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-6">
          {(
            [
              ['purchasableOnline', 'Purchasable Online'],
              ['inStock', 'In Stock'],
              ['visibleInMenu', 'Visible in Menu'],
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={field}
                checked={form[field]}
                onChange={handleChange}
                className="w-4 h-4 accent-[#4B5A2A]"
              />
              <span className="text-sm text-[#4B5A2A]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-2 bg-[#4B5A2A] text-white rounded hover:bg-[#3a4520] transition-colors text-sm font-medium disabled:opacity-60"
      >
        {loading ? 'Adding…' : 'Add Item'}
      </button>
    </form>
  );
}
