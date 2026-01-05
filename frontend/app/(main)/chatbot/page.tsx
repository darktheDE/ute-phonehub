"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatbotAssistant } from "@/components/common/ChatbotAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  Package,
} from "lucide-react";

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

/**
 * Trang chatbot tư vấn sản phẩm
 * Route: /chatbot
 * Sử dụng MainLayout (Header + Footer) qua route group (main)
 */
export default function ChatbotPage() {
  const router = useRouter();
  const { categories } = useCategories({ parentId: null });
  const [activeTab, setActiveTab] = useState<string>("all");

  // Đảm bảo khi vào /chatbot luôn scroll lên đầu trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

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

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        {/* Tiêu đề trang */}
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Chatbot tư vấn sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Tìm nhanh điện thoại phù hợp với nhu cầu và ngân sách của bạn, chatbot sẽ gợi ý
            một vài lựa chọn nổi bật trong hệ thống.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
          {/* Khu chat chính */}
          <ChatbotAssistant className="h-[560px]" />

          {/* Sidebar: hướng dẫn ngắn cho người dùng */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gợi ý câu hỏi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Bạn có thể thử một số câu như:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>“Cho tôi xem sản phẩm nổi bật”</li>
                  <li>“Điện thoại bán chạy trong tầm 10 triệu”</li>
                  <li>“Máy có camera tốt để chụp đêm”</li>
                  <li>“Điện thoại mới ra mắt gần đây”</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}


