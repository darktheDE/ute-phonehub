'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductCardResponse } from '@/services/new-product.service';

interface ProductCardProps {
  product: ProductCardResponse;
  onAddToCart?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  compareMode?: boolean;
  isSelected?: boolean;
  onSelectForCompare?: (productId: number, selected: boolean) => void;
  onToggleWishlist?: (productId: number) => void;
  isInWishlist?: boolean;
}

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
      {/* Clickable overlay for entire card */}
      <Link 
        href={`/products/${product.id}`} 
        className="absolute inset-0 z-0"
        aria-label={`Xem chi tiết ${product.name}`}
      />

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
        <Image
          src={product.thumbnailUrl || '/placeholder-product.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className={cn(
          "absolute top-2 flex flex-col gap-1 z-[1]",
          compareMode ? "left-12" : "left-2"
        )}>
          {product.hasDiscount && product.discountPercentage && (
            <Badge variant="destructive" className="text-xs font-bold">
              -{product.discountPercentage.toFixed(0)}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="text-xs">
              Hết hàng
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(product.id);
          }}
          className="absolute top-2 right-2 z-[1] p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart 
            className={cn(
              "w-4 h-4 transition-colors",
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            )}
          />
        </button>

        {/* Quick actions */}
        <div className="absolute inset-x-2 bottom-2 z-[1] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm" 
            variant="secondary"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView?.(product.id);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            Xem nhanh
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4 flex-1 flex flex-col relative z-[1]">
        {/* Brand */}
        <div className="text-xs text-muted-foreground mb-1">
          {product.brandName}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Key Specs */}
        <div className="text-xs text-muted-foreground mb-3 space-y-1">
          {product.ram && product.storage && (
            <div>{product.ram} • {product.storage}</div>
          )}
          {product.color && (
            <div>Màu: {product.color}</div>
          )}
        </div>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{formatRating(product.averageRating)}</span>
            <span className="text-xs text-muted-foreground">({product.totalReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
            {product.hasDiscount && product.discountedPrice ? (
              <>
                <span className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">
                  {formatPrice(product.discountedPrice)}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground line-through whitespace-nowrap">
                  {formatPrice(product.originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold whitespace-nowrap">
                {product.priceRange || formatPrice(product.minPrice)}
              </span>
            )}
          </div>

          {/* Saving amount */}
          {product.hasDiscount && product.savingAmount && (
            <div className="text-xs text-green-600 font-medium mb-2">
              Tiết kiệm {formatPrice(product.savingAmount)}
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center justify-between">
            <div className="text-xs">
              {product.inStock ? (
                <span className="text-green-600">✓ Còn hàng</span>
              ) : (
                <span className="text-red-500">✗ Hết hàng</span>
              )}
            </div>
            
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
              <span className="text-xs text-orange-600">Chỉ còn {product.stockQuantity}</span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            className="w-full mt-3 relative z-[2]"
            size="sm"
            disabled={!product.inStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(product.id);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component for loading state
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-3" />
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}