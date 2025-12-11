'use client';

import Link from 'next/link';
import { Clock, ChevronRight, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MOCK_FLASH_SALE_PRODUCTS } from '@/lib/mockData';

export function FlashSaleSection() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-red-600 to-orange-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-bold text-white">
              ⚡ FLASH SALE
            </span>
            <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-mono">02:45:30</span>
            </div>
          </div>
          <Link
            href="#"
            className="text-white hover:underline flex items-center gap-1"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MOCK_FLASH_SALE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative">
                <div className="h-36 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
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
                  <span className="text-base md:text-lg font-bold text-red-600">
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
