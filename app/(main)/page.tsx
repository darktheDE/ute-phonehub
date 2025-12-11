'use client';

import {
  HeroBanner,
  FeaturesSection,
  FlashSaleSection,
  FeaturedProducts,
} from '@/components/features';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesSection />
      <FlashSaleSection />
      <FeaturedProducts />
    </>
  );
}
