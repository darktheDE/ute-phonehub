/**
 * CustomerWishlist component - Wishlist management for customers
 */

'use client';

import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export function CustomerWishlist() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Sản phẩm yêu thích</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_PRODUCTS.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative">
              <div className="flex h-32 items-center justify-center bg-secondary text-4xl md:h-40">
                {product.image}
              </div>
              <button
                className="absolute top-2 right-2 rounded-full bg-card p-2 shadow-md transition-all hover:bg-secondary"
                aria-label="Bỏ khỏi yêu thích"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </button>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-2">{product.name}</h4>
              <p className="text-primary font-bold">{formatPrice(product.salePrice)}</p>
              <Button size="sm" className="w-full mt-2">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Thêm giỏ
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
