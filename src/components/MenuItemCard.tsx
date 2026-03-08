'use client';

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

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div className="bg-white/80 rounded-lg overflow-hidden shadow-sm border border-[#4B5A2A]/10 flex flex-col">
      {/* Image */}
      <div className="h-48 bg-[#4B5A2A]/10 overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#4B5A2A]/30 text-4xl">
            🌿
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[#4B5A2A] font-semibold text-lg leading-tight">
            {item.name}
          </h3>
          <span className="text-[#4B5A2A] font-bold whitespace-nowrap">
            €{item.price.toFixed(2)}
          </span>
        </div>

        <p className="text-[#4B5A2A]/60 text-xs mb-2 italic">
          {item.ingredients.join(', ')}
        </p>

        <p className="text-gray-600 text-sm flex-1">{item.description}</p>

        {!item.inStock && (
          <p className="text-red-500 text-xs mt-2 font-medium">Out of stock</p>
        )}

        {item.purchasableOnline && item.inStock && onAddToCart && (
          <button
            onClick={() => onAddToCart(item)}
            className="mt-3 self-end w-9 h-9 rounded-full bg-[#4B5A2A] text-white text-xl flex items-center justify-center hover:bg-[#3a4520] transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
