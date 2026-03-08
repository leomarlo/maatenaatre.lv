'use client';

import { useEffect, useState } from 'react';
import MenuItemCard from '@/components/MenuItemCard';

interface MenuItem {
  id: string;
  name: string;
  ingredients: string[];
  description: string;
  price: number;
  purchasableOnline: boolean;
  inStock: boolean;
  imageUrl?: string | null;
}

interface CartEntry {
  item: MenuItem;
  qty: number;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartEntry[]>([]);

  useEffect(() => {
    fetch('/api/menu-items')
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing) {
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  }

  const cartTotal = cart.reduce((sum, e) => sum + e.item.price * e.qty, 0);
  const cartCount = cart.reduce((sum, e) => sum + e.qty, 0);

  return (
    <div className="min-h-screen pt-20 bg-[#f5f4ef]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4B5A2A] mb-1">Menu</h1>
          <p className="text-[#4B5A2A]/60 text-sm italic">
            Wild herbs, berries, and botanicals gathered with care.
          </p>
        </div>

        {/* Cart summary */}
        {cartCount > 0 && (
          <div className="mb-6 p-4 bg-[#4B5A2A] text-white rounded-lg flex items-center justify-between">
            <span>
              {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
            </span>
            <span className="font-bold text-lg">€{cartTotal.toFixed(2)}</span>
          </div>
        )}

        {loading ? (
          <div className="text-[#4B5A2A]/60 text-center py-20">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-[#4B5A2A]/60 text-center py-20">
            No items on the menu yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
