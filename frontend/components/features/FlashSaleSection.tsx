'use client';

import Link from 'next/link';
import { Clock, ChevronRight, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MOCK_FLASH_SALE_PRODUCTS } from '@/lib/mockData';

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
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative">
                <div className="h-36 md:h-48 bg-gradient-to-br from-[#fdf7e3] to-[#f9f5d7] flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <span className="absolute top-2 left-2 rounded-md bg-destructive text-[11px] font-semibold text-white px-2 py-1 shadow-sm">
                  -{product.discount}%
                </span>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm md:text-base">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-bold text-primary">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
