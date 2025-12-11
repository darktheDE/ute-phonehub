'use client';

import { Truck, Shield, Headphones, ShoppingCart } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    { icon: Truck, text: 'Giao hàng miễn phí', sub: 'Đơn từ 500K' },
    { icon: Shield, text: 'Bảo hành chính hãng', sub: '12 tháng' },
    { icon: Headphones, text: 'Hỗ trợ 24/7', sub: 'Hotline 1800.1234' },
    { icon: ShoppingCart, text: 'Đổi trả dễ dàng', sub: 'Trong 30 ngày' },
  ];

  return (
    <section className="bg-secondary py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3">
              <feature.icon className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">
                  {feature.text}
                </p>
                <p className="text-xs text-muted-foreground">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
