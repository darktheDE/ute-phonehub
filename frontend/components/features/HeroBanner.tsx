'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface HeroBannerProps {
  productId?: number;
  productName?: string;
  productImage?: string;
  description?: string;
  salePrice?: number;
  originalPrice?: number;
  badge?: string;
}

export function HeroBanner({
  productId = 1,
  productName = 'iPhone 15 Pro Max',
  productImage = '📱',
  description = 'Titan. Siêu nhẹ. Siêu bền. Giảm đến 2 triệu khi thu cũ đổi mới.',
  salePrice = 32990000,
  originalPrice = 34990000,
  badge = '🔥 HOT DEAL',
}: HeroBannerProps = {}) {
  const router = useRouter();
  const { addItem } = useCartStore();

  return (
    <section className="bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium mb-4 shadow-sm">
              {badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {productName}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              {description}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(salePrice)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                className="gap-2 shadow-md hover:bg-primary-hover"
                onClick={() => {
                  addItem({
                    productId,
                    productName,
                    productImage,
                    price: salePrice,
                    quantity: 1,
                  });
                  toast.success('Đã thêm vào giỏ hàng!', {
                    description: `${productName} - ${formatPrice(salePrice)}`,
                  });
                  router.push('/checkout');
                }}
              >
                Mua ngay
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white hover:text-[#0f172a]"
                asChild
              >
                <Link href={`/products/${productId}`}>
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary/25 to-primary/10 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
              {productImage.startsWith('/') || productImage.startsWith('http') ? (
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                // Fallback for emoji or invalid images
                <span className="text-[120px] md:text-[150px]">{productImage}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
