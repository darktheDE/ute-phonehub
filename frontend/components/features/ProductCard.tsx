"use client";

import { Heart, Star, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks";
import { useCartStore } from "@/store";
import { cartAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  // Support both mock data format and backend format
  originalPrice?: number; // Mock data
  salePrice?: number; // Mock data
  price?: number; // Backend: original price
  discountPercent?: number; // Backend: discount % (0-100)
  discountedPrice?: number; // Backend: price after discount
  rating: number;
  reviews: number;
  discount?: number; // Mock data discount
  isNew?: boolean;
}

export function ProductCard({
  id,
  name,
  image,
  originalPrice,
  salePrice,
  price,
  discountPercent,
  discountedPrice,
  rating,
  reviews,
  discount,
  isNew = false,
}: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { addItem, setItems } = useCartStore();

  // Determine actual prices based on available data
  // Priority: Backend data (price/discountedPrice) > Mock data (originalPrice/salePrice)
  const actualOriginalPrice = price ?? originalPrice ?? 0;
  const actualDiscountPercent = discountPercent ?? discount ?? 0;
  const actualFinalPrice = discountedPrice ?? salePrice ?? actualOriginalPrice;
  const hasDiscount = actualDiscountPercent > 0;

  const isValidImage = (src: unknown) => {
    if (!src || typeof src !== "string") return false;
    return /^(https?:\/\/|\/|data:|blob:)/i.test(src);
  };

  const handleBuyNow = async (e?: any) => {
    e?.stopPropagation?.();
    await handleAddToCart();
    try {
      router.push("/checkout");
    } catch {
      // noop
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Add to local cart store for guest
      addItem({
        productId: id,
        productName: name,
        productImage: isValidImage(image) ? image : "",
        price: actualOriginalPrice,
        discountPercent: hasDiscount ? actualDiscountPercent : undefined,
        appliedPrice: actualFinalPrice,
        quantity: 1,
      } as any);
      toast.success("Đã thêm vào giỏ (khách) — đăng nhập để đồng bộ");
      return;
    }

    try {
      const resp = await cartAPI.addToCart({ productId: id, quantity: 1 });
      if (resp && resp.success) {
        // After adding to backend, refresh local cart from backend to get server IDs
        try {
          const cartResp = await cartAPI.getCurrentCart();
          if (cartResp && cartResp.success && cartResp.data) {
            const backendItems = Array.isArray(cartResp.data.items)
              ? cartResp.data.items
              : [];
            const mappedItems = backendItems.map((obj: any) => ({
              id: Number(obj.id ?? 0),
              productId: Number(obj.productId ?? 0),
              productName:
                typeof obj.productName === "string"
                  ? obj.productName
                  : obj.product?.name ?? "Unknown Product",
              productImage:
                typeof obj.productImage === "string"
                  ? obj.productImage
                  : obj.productThumbnailUrl ?? obj.product?.thumbnailUrl ?? "",
              price:
                typeof obj.price === "number"
                  ? obj.price
                  : obj.unitPrice ?? obj.product?.salePrice ?? 0,
              quantity: Number(obj.quantity ?? 0),
              color: obj.color,
              storage: obj.storage,
            }));

            setItems(mappedItems as any);
          }
        } catch (syncErr) {
          console.warn(
            "ProductCard: failed to refresh cart after addToCart",
            syncErr
          );
        }

        toast.success("Đã thêm vào giỏ hàng");
      } else {
        throw new Error(resp?.message || "Không thể thêm vào giỏ");
      }
    } catch (e: any) {
      console.error("Add to cart failed:", e);
      toast.error(e?.message || "Lỗi khi thêm vào giỏ");
    }
  };
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group relative">
      <div className="relative">
        <div className="h-40 md:h-52 bg-gradient-to-br from-[#fdf7e3] to-[#f8f1d6] flex items-center justify-center text-6xl md:text-7xl group-hover:scale-105 transition-transform">
          {image}
        </div>
        {isNew && (
          <span className="absolute top-2 left-2 bg-[#16a34a] text-white text-[11px] font-semibold px-2 py-1 rounded-md shadow-sm">
            Mới
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-1 rounded-md shadow-sm">
            -{Math.round(actualDiscountPercent)}%
          </span>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-white text-primary hover:bg-primary hover:text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors flex items-center gap-1"
            title="Thêm vào giỏ"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors"
          >
            Mua ngay
          </button>
        </div>

        <button
          className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-md opacity-0 transition-all group-hover:opacity-100 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring z-10"
          aria-label="Thêm vào yêu thích"
        >
          <Heart className="w-5 h-5 text-muted-foreground hover:text-primary" />
        </button>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem] text-sm md:text-base cursor-pointer hover:text-primary">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(rating)
                  ? "fill-primary text-primary"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base md:text-lg font-bold text-primary">
            {formatPrice(actualFinalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">
              {formatPrice(actualOriginalPrice)}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white hover:opacity-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
