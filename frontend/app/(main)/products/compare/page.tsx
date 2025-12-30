'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productViewService } from '@/services/product-view.service';
import type { ProductDetailViewResponse } from '@/types/product-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  X, 
  Check, 
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIds = searchParams.get('ids')?.split(',').map(Number).filter(Boolean) || [];
  
  const [products, setProducts] = useState<ProductDetailViewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (productIds.length === 0) {
        setError('Không có sản phẩm nào để so sánh');
        setLoading(false);
        return;
      }

      if (productIds.length < 2) {
        setError('Cần ít nhất 2 sản phẩm để so sánh');
        setLoading(false);
        return;
      }

      if (productIds.length > 4) {
        setError('Chỉ có thể so sánh tối đa 4 sản phẩm');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const fetchedProducts = await Promise.all(
          productIds.map(id => productViewService.getProductById(id))
        );
        
        // Check if all products are in the same category
        if (fetchedProducts.length > 1) {
          const firstCategoryId = fetchedProducts[0].categoryId;
          const allSameCategory = fetchedProducts.every(
            product => product.categoryId === firstCategoryId
          );
          
          if (!allSameCategory) {
            setError(
              `Chỉ có thể so sánh sản phẩm cùng danh mục. ` +
              `Hiện tại bạn đang chọn sản phẩm từ các danh mục khác nhau: ` +
              `${[...new Set(fetchedProducts.map(p => p.categoryName))].join(', ')}`
            );
            setLoading(false);
            return;
          }
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
        console.error('Compare error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const removeProduct = (productId: number) => {
    const newIds = productIds.filter(id => id !== productId);
    if (newIds.length < 2) {
      router.push('/products');
    } else {
      router.push(`/products/compare?ids=${newIds.join(',')}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return <ComparisonSkeleton count={productIds.length} />;
  }

  if (error || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không thể so sánh sản phẩm</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Get all specification keys - use comprehensive list
  const allSpecKeys = new Set<string>();
  products.forEach(product => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach(key => allSpecKeys.add(key));
    }
  });

  const specLabels: Record<string, string> = {
    screen: 'Màn hình',
    os: 'Hệ điều hành',
    cpu: 'Chip xử lý',
    ram: 'RAM',
    storage: 'Bộ nhớ trong',
    internalMemory: 'Bộ nhớ trong',
    externalMemory: 'Thẻ nhớ',
    rearCamera: 'Camera sau',
    frontCamera: 'Camera trước',
    battery: 'Pin',
    charging: 'Sạc',
    sim: 'SIM',
    dimensions: 'Kích thước',
    weight: 'Trọng lượng',
    materials: 'Chất liệu',
    connectivity: 'Kết nối',
    features: 'Tính năng đặc biệt',
  };
  
  // Sort spec keys by importance
  const specOrder = [
    'screen',
    'os', 
    'cpu',
    'ram',
    'storage',
    'internalMemory',
    'battery',
    'charging',
    'rearCamera',
    'frontCamera',
    'sim',
    'connectivity',
    'dimensions',
    'weight',
    'materials',
    'externalMemory',
    'features',
  ];
  
  const sortedSpecKeys = Array.from(allSpecKeys).sort((a, b) => {
    const aIndex = specOrder.indexOf(a);
    const bIndex = specOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">So sánh sản phẩm</h1>
          <p className="text-muted-foreground mt-2">
            Đang so sánh {products.length} sản phẩm
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))` }}>
            
            {/* Header Row - Product Cards */}
            <div className="sticky left-0 bg-background z-10"></div>
            {products.map(product => (
              <Card key={product.id} className="p-4">
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeProduct(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                      <Image
                        src={product.thumbnailUrl || '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>
                  
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{product.averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.totalReviews} đánh giá)
                    </span>
                  </div>
                  
                  <p className="text-lg font-bold text-primary mb-3">
                    {product.templates && product.templates[0] 
                      ? formatPrice(product.templates[0].price) 
                      : 'Liên hệ'}
                  </p>
                  
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                </div>
              </Card>
            ))}

            {/* Thông tin chung */}
            <div className="sticky left-0 bg-background z-10 font-semibold py-3 border-b">
              Thông tin chung
            </div>
            {products.map(product => (
              <div key={`${product.id}-general`} className="py-3 border-b"></div>
            ))}

            {/* Brand */}
            <div className="sticky left-0 bg-background z-10 py-3 text-sm text-muted-foreground">
              Thương hiệu
            </div>
            {products.map(product => (
              <div key={`${product.id}-brand`} className="py-3 text-sm">
                <Badge variant="outline">{product.brandName}</Badge>
              </div>
            ))}

            {/* Category */}
            <div className="sticky left-0 bg-background z-10 py-3 text-sm text-muted-foreground">
              Danh mục
            </div>
            {products.map(product => (
              <div key={`${product.id}-category`} className="py-3 text-sm">
                {product.categoryName}
              </div>
            ))}

            {/* In Stock */}
            <div className="sticky left-0 bg-background z-10 py-3 text-sm text-muted-foreground">
              Tình trạng
            </div>
            {products.map(product => (
              <div key={`${product.id}-stock`} className="py-3">
                {product.totalStock > 0 ? (
                  <Badge variant="default" className="bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Còn hàng ({product.totalStock})
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <X className="w-3 h-3 mr-1" />
                    Hết hàng
                  </Badge>
                )}
              </div>
            ))}

            {/* Specifications */}
            <div className="sticky left-0 bg-background z-10 font-semibold py-3 border-b border-t mt-4">
              Thông số kỹ thuật
            </div>
            {products.map(product => (
              <div key={`${product.id}-specs-header`} className="py-3 border-b border-t mt-4"></div>
            ))}

            {/* Each specification */}
            {sortedSpecKeys.map(specKey => (
              <React.Fragment key={specKey}>
                <div className="sticky left-0 bg-background z-10 py-3 text-sm text-muted-foreground">
                  {specLabels[specKey] || specKey}
                </div>
                {products.map(product => {
                  const value = product.specifications?.[specKey];
                  const allValues = products.map(p => p.specifications?.[specKey]).filter(Boolean);
                  const isDifferent = allValues.length > 1 && !allValues.every(v => v === allValues[0]);
                  
                  return (
                    <div 
                      key={`${product.id}-${specKey}`} 
                      className={`py-3 text-sm ${isDifferent && value ? 'font-semibold text-primary' : ''}`}
                    >
                      {value || '-'}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Variants */}
            <div className="sticky left-0 bg-background z-10 font-semibold py-3 border-b border-t mt-4">
              Phiên bản
            </div>
            {products.map(product => (
              <div key={`${product.id}-variants-header`} className="py-3 border-b border-t mt-4"></div>
            ))}

            <div className="sticky left-0 bg-background z-10 py-3 text-sm text-muted-foreground">
              Số phiên bản
            </div>
            {products.map(product => (
              <div key={`${product.id}-variants-count`} className="py-3 text-sm">
                {product.templates?.length || 0} phiên bản
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonSkeleton({ count }: { count: number }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${count}, minmax(250px, 1fr))` }}>
        {Array.from({ length: count + 1 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="aspect-square mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-10 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
