/**
 * Product types matching backend DTOs
 */

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  thumbnailUrl?: string;
  specifications?: Record<string, any>;
  status: boolean;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  createdAt?: string;
  updatedAt?: string;
  // Frontend computed fields
  originalPrice?: number;
  salePrice?: number;
  rating?: number;
  reviews?: number;
  discount?: number;
  isNew?: boolean;
  image?: string;
  category?: string;
  stock?: number;
  sales?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  thumbnailUrl?: string;
  specifications?: Record<string, any>;
  status: boolean;
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TopProductResponse {
  productId: number;
  productName: string;
  imageUrl?: string;  // Backend uses imageUrl
  thumbnailUrl?: string;  // Fallback
  totalSold: number;
  revenue: number;
}

