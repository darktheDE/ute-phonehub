"use client";

import {
  HeroBanner,
  FlashSaleSection,
  FeaturedProducts,
  BestSellingSection,
  NewArrivalsSection,
  ViewAllProductsSection,
  QuickLinksBar,
} from "@/components/features";

export default function HomePage() {
  return (
    <>
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Quick Navigation Bar - Sticky */}
      <section className="border-b bg-background/95 sticky top-16 z-40 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <QuickLinksBar />
        </div>
      </section>
      
      {/* Flash Sale - Ưu tiên cao vì urgency */}
      <FlashSaleSection />
      
      {/* Sản phẩm nổi bật */}
      <FeaturedProducts />
      
      {/* Sản phẩm bán chạy */}
      <BestSellingSection />
      
      {/* Sản phẩm mới nhất */}
      <NewArrivalsSection />
      
      {/* Nút xem tất cả sản phẩm */}
      <ViewAllProductsSection />
    </>
  );
}
