'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { MOCK_FEATURED_PRODUCTS } from '@/lib/mockData';

export function FeaturedProducts() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            📱 Điện thoại nổi bật
          </h2>
          <Link
            href="#"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {MOCK_FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
