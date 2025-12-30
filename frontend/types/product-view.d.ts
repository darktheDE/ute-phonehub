/**
 * Product View Types - For public product viewing APIs
 * Based on ProductViewController endpoints
 */

// ==================== PRODUCT VIEW RESPONSE ====================

export interface ProductImageInfo {
  id: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  imageOrder: number;
}

export interface ProductViewResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  
  // Category & Brand
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  
  // Pricing
  minPrice: number;
  maxPrice: number;
  
  // Rating & Reviews
  averageRating: number;
  totalReviews: number;
  
  // Stock
  inStock: boolean;
  totalStock: number;
  soldCount: number;
  
  // Images
  images: ProductImageInfo[];
  variantsCount: number;
  
  // Specifications
  ram?: string;
  storage?: string;
  battery?: string;
  cpu?: string;
  screen?: string;
  
  // Templates (for compatibility)
  templates?: ProductTemplateInfo[];
  os?: string;
  rearCamera?: string;
  frontCamera?: string;
  
  // Promotion
  promotionBadge?: string;
  discountPercentage?: number;
}

// ==================== PRODUCT DETAIL ====================

export interface ProductTemplateInfo {
  id: number;
  sku: string;
  color?: string;
  storage?: string;
  ram?: string;
  price: number;
  stockQuantity: number;
  status: boolean;
}

// New API Response Types
export interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
}

export interface BrandInfo {
  id: number;
  name: string;
  logoUrl: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  color?: string;
  storage?: string;
  ram?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  stockStatus: string;
  status: boolean;
}

export interface TechnicalSpecs {
  screen?: string;
  os?: string;
  frontCamera?: string;
  rearCamera?: string;
  cpu?: string;
  ram?: string;
  internalMemory?: string;
  externalMemory?: string;
  sim?: string;
  battery?: string;
  charging?: string;
  dimensions?: string;
  weight?: string;
  materials?: string;
  connectivity?: string;
  features?: string;
}

export interface ProductDetailApiResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  category: CategoryInfo;
  brand: BrandInfo;
  images: ProductImageInfo[];
  variants: ProductVariant[];
  technicalSpecs: TechnicalSpecs;
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  soldCount: number;
}

export interface ProductDetailViewResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  
  // Category & Brand
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  
  // Templates (variants)
  templates: ProductTemplateInfo[];
  
  // Rating & Reviews
  averageRating: number;
  totalReviews: number;
  
  // Stock
  totalStock: number;
  soldCount: number;
  
  // Images
  images: ProductImageInfo[];
  
  // Specifications
  specifications: Record<string, any>;
  
  // Promotion
  promotionBadge?: string;
  discountPercentage?: number;
  
  // Created/Updated dates
  createdAt: string;
  updatedAt?: string;
}

// Alias for the new API response (recommended to use)
export type ProductDetail = ProductDetailApiResponse;

// ==================== SEARCH & FILTER REQUEST ====================

export interface ProductSearchFilterRequest {
  // Search
  keyword?: string;
  
  // Filters
  categoryId?: number;
  brandIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  
  // Advanced Filters
  ramOptions?: string[];
  storageOptions?: string[];
  minBattery?: number;
  maxBattery?: number;
  screenSizeOptions?: string[];
  osOptions?: string[];
  minSoldCount?: number;
  
  // Sort
  sortBy?: 'name' | 'price' | 'rating' | 'created_date' | 'sold_count';
  sortDirection?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  size?: number;
}

// ==================== CATEGORY PRODUCTS ====================

export interface CategoryInfo {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface SubcategoryInfo {
  id: number;
  name: string;
  productCount: number;
}

export interface BrandFilterInfo {
  id: number;
  name: string;
  productCount: number;
}

export interface PriceRangeInfo {
  min: number;
  max: number;
  label: string;
  productCount: number;
}

export interface CategoryProductsResponse {
  category: CategoryInfo;
  subcategories: SubcategoryInfo[];
  products: {
    content: ProductViewResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
  availableFilters: {
    brands: BrandFilterInfo[];
    priceRanges: PriceRangeInfo[];
  };
}

// ==================== PRODUCT COMPARISON ====================

export interface ProductComparisonItem {
  id: number;
  name: string;
  brandName: string;
  thumbnailUrl?: string;
  price: number;
  rating: number;
  specifications: Record<string, any>;
}

export interface ProductComparisonResponse {
  products: ProductComparisonItem[];
  comparisonFields: string[];
}

// ==================== PAGINATION RESPONSE ====================

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// ==================== FILTER OPTIONS FOR UI ====================

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface PriceRangeFilter {
  min: number;
  max: number;
  label: string;
}

export interface RatingFilter {
  value: number;
  label: string;
}

export interface SortOption {
  label: string;
  value: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

// ==================== UI STATE ====================

export interface ProductListingState {
  products: ProductViewResponse[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  filters: ProductSearchFilterRequest;
}
