"use client";

import { Heart, Star, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks";
import { useCartStore } from "@/store";
import { cartAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <Link href={`/products/${id}`} className="block h-full group">
      <div className={cn(
        "bg-card rounded-xl border border-border/50 overflow-hidden h-full flex flex-col",
        "shadow-sm hover:shadow-xl transition-all duration-300 ease-out",
        "hover:-translate-y-2 hover:border-primary/30 cursor-pointer"
      )}>
        <div className="relative">
          <div className="h-40 md:h-52 bg-gradient-to-br from-[#fdf7e3] via-[#faf4e0] to-[#f8f1d6] flex items-center justify-center text-6xl md:text-7xl group-hover:scale-105 transition-transform duration-500">
            {image}
          </div>
          {isNew && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md">
              Mới
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md">
              -{Math.round(actualDiscountPercent)}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute bottom-2 right-2 rounded-full bg-white/95 p-2 shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:shadow-lg hover:scale-110 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring z-10"
            aria-label="Thêm vào yêu thích"
          >
            <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem] text-sm md:text-base group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
            {reviews > 0 && (
              <span className="text-xs text-muted-foreground ml-1">
                ({reviews})
              </span>
            )}
          </div>
          
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex flex-col mb-2">
              <span className="text-base md:text-lg font-bold text-primary">
                {formatPrice(actualFinalPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(actualOriginalPrice)}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-white font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              Thêm giỏ
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
