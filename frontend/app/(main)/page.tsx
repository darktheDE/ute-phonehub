"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeroBanner,
  FeaturesSection,
  FlashSaleSection,
  FeaturedProducts,
  PromotionsSection,
} from "@/components/features";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Laptop, Headphones, Watch, Tablet, Package } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "điện thoại": Smartphone,
  phone: Smartphone,
  smartphone: Smartphone,
  laptop: Laptop,
  "tai nghe": Headphones,
  headphones: Headphones,
  "đồng hồ": Watch,
  watch: Watch,
  tablet: Tablet,
  "máy tính bảng": Tablet,
};

const getCategoryIcon = (categoryName: string) => {
  const lowerName = categoryName.toLowerCase();
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (lowerName.includes(key)) {
      return Icon;
    }
  }
  return Package;
};

export default function HomePage() {
  const router = useRouter();
  const { categories } = useCategories({ parentId: null });
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveTab(categoryId);

    const params = new URLSearchParams();
    params.set("tab", categoryId);
    if (categoryId !== "all") {
      params.set("categoryId", categoryId);
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <>
      {/* Thanh tab category ngay dưới navbar */}
      <section className="border-b bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleCategoryClick("all")}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Tất cả</span>
            </Button>

            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Button
                  key={category.id}
                  variant={activeTab === String(category.id) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryClick(String(category.id))}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                  {category.productCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.productCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <HeroBanner />
      <FeaturesSection />
      <PromotionsSection />
      <FlashSaleSection />
      <FeaturedProducts />
    </>
  );
}
