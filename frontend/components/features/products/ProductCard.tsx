'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Eye, TrendingUp, GitCompare, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductViewResponse } from '@/types/product-view';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductViewResponse;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  compareMode?: boolean;
  isSelected?: boolean;
  onSelectForCompare?: (productId: number, selected: boolean) => void;
  onToggleWishlist?: (productId: number) => void;
  isInWishlist?: boolean;
}

/**
 * Product Card Component
 * Displays product information in a card format for listing pages
 */
export function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickView,
  compareMode = false,
  isSelected = false,
  onSelectForCompare,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || product.thumbnailUrl || '/placeholder-product.png';
  
  const minPrice = product.minPrice || 0;
  const maxPrice = product.maxPrice || 0;
  const hasVariants = product.variantsCount && product.variantsCount > 1;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col relative",
      isSelected && "ring-2 ring-primary shadow-lg"
    )}>
      {/* Compare Checkbox */}
      {compareMode && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-white rounded-md p-1 shadow-md">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectForCompare?.(product.id, !!checked)}
            />
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.id}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </Link>
        
        {/* Badges */}
        <div className={cn(
          "absolute top-2 flex flex-col gap-1",
          compareMode ? "left-12" : "left-2"
        )}>
          {product.promotionBadge && (
            <Badge variant="destructive" className="text-xs font-semibold">
              {product.promotionBadge}
            </Badge>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs font-bold">
              -{product.discountPercentage}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="text-xs">
              Hết hàng
            </Badge>
          )}
          {product.soldCount && product.soldCount > 100 && (
            <Badge variant="default" className="text-xs flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Bán chạy
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Quick View */}
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full h-9 w-9 shadow-md"
            onClick={() => onQuickView?.(product.id)}
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {/* Wishlist */}
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "rounded-full h-9 w-9 shadow-md",
              isInWishlist && "bg-red-500 text-white hover:bg-red-600"
            )}
            onClick={() => onToggleWishlist?.(product.id)}
            title={isInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart className={cn("w-4 h-4", isInWishlist && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-medium text-primary hover:underline cursor-pointer">{product.brandName}</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">{product.categoryName}</span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        {(product.ram || product.storage || product.screen) && (
          <div className="flex flex-wrap gap-1 mb-3 text-xs text-muted-foreground">
            {product.ram && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.ram}</span>}
            {product.storage && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.storage}</span>}
            {product.screen && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.screen}</span>}
          </div>
        )}

        {/* Rating & Reviews */}
        {product.averageRating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{formatRating(product.averageRating)}</span>
            </div>
            {product.totalReviews > 0 && (
              <span className="text-xs text-muted-foreground">
                ({product.totalReviews} đánh giá)
              </span>
            )}
          </div>
        )}

        {/* Sold Count */}
        {product.soldCount > 0 && (
          <p className="text-xs text-muted-foreground mb-3">
            Đã bán: {product.soldCount.toLocaleString('vi-VN')}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto">
          {hasVariants && minPrice !== maxPrice ? (
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-primary">
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.variantsCount} phiên bản
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-primary">
              {formatPrice(minPrice)}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        {product.inStock && (
          <Button
            className="w-full mt-3"
            onClick={() => onAddToCart?.(product.id)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Thêm vào giỏ
          </Button>
        )}
        
        {!product.inStock && (
          <Button
            className="w-full mt-3"
            variant="outline"
            disabled
          >
            Hết hàng
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Product Card Skeleton for loading state
 */
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-200 animate-pulse" />
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4" />
        <div className="flex gap-1 mb-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded animate-pulse mt-auto mb-3 w-2/3" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
