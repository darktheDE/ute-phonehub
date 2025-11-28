'use client';

import { Heart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviews: number;
  discount: number;
  isNew?: boolean;
}

export function ProductCard({
  name,
  image,
  originalPrice,
  salePrice,
  rating,
  reviews,
  discount,
  isNew = false,
}: ProductCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative">
        <div className="h-40 md:h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl md:text-7xl group-hover:scale-105 transition-transform">
          {image}
        </div>
        {isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            Mới
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem] text-sm md:text-base">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(rating)
                  ? 'fill-primary text-primary'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base md:text-lg font-bold text-primary">
            {formatPrice(salePrice)}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
