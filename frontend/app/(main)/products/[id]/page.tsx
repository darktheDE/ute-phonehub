'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productViewService } from '@/services/product-view.service';
import type { ProductDetailViewResponse, ProductViewResponse } from '@/types/product-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  TrendingUp,
  ChevronLeft,
  Check,
  X,
  Package,
  Shield,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import { ProductCard } from '@/components/features/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<ProductDetailViewResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductViewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('🔍 Fetching product detail for ID:', productId);
        
        if (!productId || isNaN(productId)) {
          console.error('❌ Invalid product ID:', productId);
          setError('ID sản phẩm không hợp lệ');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        setError(null);
        
        console.log('📡 Calling API for product:', productId);
        const [productData, relatedData] = await Promise.all([
          productViewService.getProductById(productId),
          productViewService.getRelatedProducts(productId, 8),
        ]);
        
        console.log('✅ Product data received:', productData);
        console.log('✅ Product details:', {
          id: productData.id,
          name: productData.name,
          price: productData.templates?.[0]?.price,
          templatesCount: productData.templates?.length,
          imagesCount: productData.images?.length,
          specifications: productData.specifications,
        });
        console.log('✅ Related products:', relatedData.length);
        
        setProduct(productData);
        setRelatedProducts(relatedData);
        
        // Select first available template
        if (productData.templates && productData.templates.length > 0 && productData.templates[0]) {
          setSelectedTemplate(productData.templates[0].id);
          console.log('✅ Selected template:', productData.templates[0].id);
        } else {
          console.warn('⚠️ No templates available for product');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
        setError(errorMessage);
        console.error('❌ Fetch product error:', err);
        console.error('❌ Error details:', {
          message: errorMessage,
          productId,
          error: err,
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      console.error('❌ No product ID provided');
      setError('Không tìm thấy ID sản phẩm');
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push('/products')}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const currentImage = product.images?.[selectedImage] || primaryImage;
  const imageUrl = currentImage?.imageUrl || product.thumbnailUrl || '/placeholder-product.png';
  
  const selectedTemplateData = product.templates?.find(t => t.id === selectedTemplate);
  const currentPrice = selectedTemplateData?.price || product.templates?.[0]?.price || 0;
  const currentStock = selectedTemplateData?.stockQuantity || product.totalStock || 0;
  const inStock = currentStock > 0;

  // Debug logging
  console.log('💰 Price calculation:', {
    selectedTemplate,
    selectedTemplateData,
    currentPrice,
    allTemplates: product.templates,
  });
  console.log('📋 Specifications:', product.specifications);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', { productId, templateId: selectedTemplate, quantity });
    // TODO: Implement add to cart
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId, templateId: selectedTemplate, quantity });
    // TODO: Implement buy now
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
          Trang chủ
        </Button>
        <span>/</span>
        <Button variant="ghost" size="sm" onClick={() => router.push('/products')}>
          Sản phẩm
        </Button>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.promotionBadge && (
                <Badge variant="destructive">{product.promotionBadge}</Badge>
              )}
              {product.discountPercentage && product.discountPercentage > 0 && (
                <Badge variant="destructive">-{product.discountPercentage}%</Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={img.id}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.altText || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="font-medium text-primary">{product.brandName}</span>
              <span>•</span>
              <span>{product.categoryName}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating & Sold */}
            <div className="flex items-center gap-4 flex-wrap">
              {product.averageRating && product.averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{formatRating(product.averageRating)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.totalReviews || 0} đánh giá)
                  </span>
                </div>
              )}
              
              {product.soldCount && product.soldCount > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Đã bán: {product.soldCount.toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-end gap-4">
              <p className="text-4xl font-bold text-primary">
                {formatPrice(currentPrice)}
              </p>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <p className="text-xl text-muted-foreground line-through mb-1">
                  {formatPrice(currentPrice / (1 - product.discountPercentage / 100))}
                </p>
              )}
            </div>
          </div>

          {/* Variants Selection */}
          {product.templates && product.templates.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Chọn phiên bản:</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-primary ring-2 ring-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {template.ram && <p className="font-medium">{template.ram}</p>}
                          {template.storage && <p className="text-sm text-muted-foreground">{template.storage}</p>}
                          {template.color && <p className="text-sm">{template.color}</p>}
                        </div>
                        {selectedTemplate === template.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="font-bold text-primary">{formatPrice(template.price)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.stockQuantity > 0 ? (
                          <span className="text-green-600">Còn {template.stockQuantity} sản phẩm</span>
                        ) : (
                          <span className="text-red-600">Hết hàng</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold">Số lượng:</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={quantity >= currentStock}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                ({currentStock} sản phẩm có sẵn)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Thêm vào giỏ
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              Mua ngay
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-medium">Miễn phí vận chuyển</p>
                <p className="text-muted-foreground">Đơn từ 500k</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-medium">Bảo hành chính hãng</p>
                <p className="text-muted-foreground">12 tháng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-medium">Giao hàng nhanh</p>
                <p className="text-muted-foreground">2-3 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card className="mb-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b h-auto p-0">
            <TabsTrigger value="description" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger value="specifications" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Đánh giá ({product.totalReviews})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="p-6">
            <div className="prose max-w-none">
              {product.description ? (
                <p className="whitespace-pre-wrap">{product.description}</p>
              ) : (
                <p className="text-muted-foreground">Chưa có mô tả sản phẩm</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="p-6">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Screen */}
                {product.specifications.screen && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Màn hình</span>
                    <span className="text-muted-foreground">{product.specifications.screen}</span>
                  </div>
                )}
                
                {/* OS */}
                {product.specifications.os && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Hệ điều hành</span>
                    <span className="text-muted-foreground">{product.specifications.os}</span>
                  </div>
                )}
                
                {/* CPU */}
                {product.specifications.cpu && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">CPU</span>
                    <span className="text-muted-foreground">{product.specifications.cpu}</span>
                  </div>
                )}
                
                {/* RAM */}
                {product.specifications.ram && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">RAM</span>
                    <span className="text-muted-foreground">{product.specifications.ram}</span>
                  </div>
                )}
                
                {/* Internal Memory */}
                {product.specifications.internalMemory && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Bộ nhớ trong</span>
                    <span className="text-muted-foreground">{product.specifications.internalMemory}</span>
                  </div>
                )}
                
                {/* External Memory */}
                {product.specifications.externalMemory && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Bộ nhớ ngoài</span>
                    <span className="text-muted-foreground">{product.specifications.externalMemory}</span>
                  </div>
                )}
                
                {/* Rear Camera */}
                {product.specifications.rearCamera && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Camera sau</span>
                    <span className="text-muted-foreground">{product.specifications.rearCamera}</span>
                  </div>
                )}
                
                {/* Front Camera */}
                {product.specifications.frontCamera && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Camera trước</span>
                    <span className="text-muted-foreground">{product.specifications.frontCamera}</span>
                  </div>
                )}
                
                {/* Battery */}
                {product.specifications.battery && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Pin</span>
                    <span className="text-muted-foreground">{product.specifications.battery}</span>
                  </div>
                )}
                
                {/* Charging */}
                {product.specifications.charging && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Sạc</span>
                    <span className="text-muted-foreground">{product.specifications.charging}</span>
                  </div>
                )}
                
                {/* SIM */}
                {product.specifications.sim && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">SIM</span>
                    <span className="text-muted-foreground">{product.specifications.sim}</span>
                  </div>
                )}
                
                {/* Dimensions */}
                {product.specifications.dimensions && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Kích thước</span>
                    <span className="text-muted-foreground">{product.specifications.dimensions}</span>
                  </div>
                )}
                
                {/* Weight */}
                {product.specifications.weight && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Trọng lượng</span>
                    <span className="text-muted-foreground">{product.specifications.weight}</span>
                  </div>
                )}
                
                {/* Materials */}
                {product.specifications.materials && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Chất liệu</span>
                    <span className="text-muted-foreground">{product.specifications.materials}</span>
                  </div>
                )}
                
                {/* Connectivity */}
                {product.specifications.connectivity && (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-primary">Kết nối</span>
                    <span className="text-muted-foreground">{product.specifications.connectivity}</span>
                  </div>
                )}
                
                {/* Features */}
                {product.specifications.features && (
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <span className="font-semibold text-sm text-primary">Tính năng</span>
                    <span className="text-muted-foreground">{product.specifications.features}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">Chưa có thông số kỹ thuật</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="p-6">
            <p className="text-muted-foreground">Chức năng đánh giá đang được phát triển</p>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-6 w-64 mb-6" />
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
