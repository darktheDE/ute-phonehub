'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Bot, Sparkles, Zap, MessageCircle } from 'lucide-react';
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
    <section className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* AI Chatbot Highlight Banner */}
        <div className="mb-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-white">Trợ lý AI thông minh</h3>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                    Online
                  </span>
                </div>
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Tư vấn điện thoại phù hợp với bạn chỉ trong vài giây!
                </p>
              </div>
            </div>
            <Link href="/chatbot">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30 gap-2 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                Chat ngay
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Quick prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-400">Thử hỏi:</span>
            {['Điện thoại chụp hình đẹp', 'iPhone giá tốt', 'Samsung pin trâu'].map((prompt, i) => (
              <Link 
                key={i}
                href="/chatbot"
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-gray-300 hover:text-white transition-colors border border-white/10"
              >
                &quot;{prompt}&quot;
              </Link>
            ))}
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold mb-4 shadow-lg shadow-orange-500/30">
              <Zap className="w-4 h-4" />
              {badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {productName}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              {description}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {formatPrice(salePrice)}
              </span>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold">
                -{Math.round((1 - salePrice/originalPrice) * 100)}%
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                className="gap-2 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
                className="border-white/40 text-white hover:bg-white hover:text-[#0f172a] transition-all"
                asChild
              >
                <Link href={`/products/${productId}`}>
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-500/40 rounded-full blur-3xl"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-sm">
                {productImage.startsWith('/') || productImage.startsWith('http') ? (
                  <img 
                    src={productImage} 
                    alt={productName}
                    className="w-full h-full object-contain p-8 drop-shadow-2xl"
                  />
                ) : (
                  <span className="text-[120px] md:text-[150px] drop-shadow-2xl">{productImage}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
