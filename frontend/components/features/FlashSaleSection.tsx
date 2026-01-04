'use client';

import Link from 'next/link';
import { Clock, ChevronRight, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MOCK_FLASH_SALE_PRODUCTS } from '@/lib/mockData';
import { ProductCard } from './ProductCard';

export function FlashSaleSection() {
  // Using mock data - endpoint /api/v1/products doesn't exist yet
  return (
    <section className="py-8 md:py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold tracking-wide uppercase">
              <span>⚡</span>
              <span>Flash sale</span>
            </span>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono">02:45:30</span>
            </div>
          </div>
          <Link
            href="#"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MOCK_FLASH_SALE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
