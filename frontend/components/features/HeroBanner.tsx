'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium mb-4">
              🔥 HOT DEAL
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              iPhone 15 Pro Max
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Titan. Siêu nhẹ. Siêu bền. Giảm đến 2 triệu khi thu cũ đổi mới.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(32990000)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(34990000)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="gap-2">
                Mua ngay
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1a1a1a]"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
              <span className="text-[120px] md:text-[150px]">📱</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
