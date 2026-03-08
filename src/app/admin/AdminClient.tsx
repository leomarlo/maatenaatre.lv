'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminMenuForm from '@/components/AdminMenuForm';

interface MenuItem {
  id: string;
  name: string;
  ingredients: string[];
  description: string;
  price: number;
  purchasableOnline: boolean;
  inStock: boolean;
  visibleInMenu: boolean;
  imageUrl?: string | null;
}

export default function AdminClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      // Admin needs to see all items, including hidden — call Prisma directly via a dedicated endpoint
      // For now we reuse the public endpoint but show all items via a query param approach.
      // We use the same route but admin can see hidden ones by fetching all.
      const res = await fetch('/api/menu-items/all');
      if (res.ok) {
        setItems(await res.json());
      } else {
        // Fallback: public endpoint
        const r2 = await fetch('/api/menu-items');
        setItems(await r2.json());
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function toggleField(id: string, field: 'inStock' | 'visibleInMenu', value: boolean) {
    await fetch(`/api/menu-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchItems();
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-[#4B5A2A] mb-8">
          Admin — Menu Items
        </h1>

        <AdminMenuForm onCreated={fetchItems} />

        {loading ? (
          <div className="text-[#4B5A2A]/60 text-center py-20">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-[#4B5A2A]/60 text-center py-12">
            No items yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#4B5A2A]/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#4B5A2A]/5 text-[#4B5A2A] text-left">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    In Stock
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Visible
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-t border-[#4B5A2A]/10 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#4B5A2A]/[0.02]'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {item.ingredients.join(', ')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      €{item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleField(item.id, 'inStock', !item.inStock)
                        }
                        className={`w-10 h-5 rounded-full transition-colors ${
                          item.inStock ? 'bg-[#4B5A2A]' : 'bg-gray-300'
                        } relative`}
                        aria-label="Toggle in stock"
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            item.inStock ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleField(
                            item.id,
                            'visibleInMenu',
                            !item.visibleInMenu
                          )
                        }
                        className={`w-10 h-5 rounded-full transition-colors ${
                          item.visibleInMenu ? 'bg-[#4B5A2A]' : 'bg-gray-300'
                        } relative`}
                        aria-label="Toggle visible in menu"
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            item.visibleInMenu ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
