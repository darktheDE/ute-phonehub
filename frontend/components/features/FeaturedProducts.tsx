'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { MOCK_FEATURED_PRODUCTS } from '@/lib/mockData';

export function FeaturedProducts() {
  // Using mock data - endpoint /api/v1/products doesn't exist yet
  // top-products endpoint requires admin auth, not suitable for public page
  const hasProducts = MOCK_FEATURED_PRODUCTS.length > 0;

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Điện thoại nổi bật
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Lựa chọn được nhiều khách hàng quan tâm trong tuần qua
            </p>
          </div>
          <Link
            href="#"
            className="text-primary hover:underline flex items-center gap-1 text-sm font-semibold"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {MOCK_FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-secondary/60 p-6 text-center text-muted-foreground">
            Chưa có sản phẩm nổi bật.
          </div>
        )}
      </div>
    </section>
  );
}
