"use client";

import {
  HeroBanner,
  FeaturesSection,
  FlashSaleSection,
  FeaturedProducts,
  PromotionsSection,
} from "@/components/features";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesSection />
      <PromotionsSection />
      <FlashSaleSection />
      <FeaturedProducts />
    </>
  );
}
