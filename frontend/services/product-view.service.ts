/**
 * Product View Service
 * Handles all public product viewing API calls
 * Based on ProductViewController endpoints (/api/v1/products)
 */

import type {
  ProductViewResponse,
  ProductDetailViewResponse,
  ProductSearchFilterRequest,
  CategoryProductsResponse,
  ProductComparisonResponse,
  PageResponse,
} from '@/types/product-view';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Build query params from filter request
 */
function buildQueryParams(request: ProductSearchFilterRequest): URLSearchParams {
  const params = new URLSearchParams();
  
  if (request.keyword) params.append('keyword', request.keyword);
  if (request.categoryId) params.append('categoryId', request.categoryId.toString());
  if (request.brandIds?.length) {
    request.brandIds.forEach(id => params.append('brandIds', id.toString()));
  }
  if (request.minPrice !== undefined) params.append('minPrice', request.minPrice.toString());
  if (request.maxPrice !== undefined) params.append('maxPrice', request.maxPrice.toString());
  if (request.minRating !== undefined) params.append('minRating', request.minRating.toString());
  if (request.inStockOnly !== undefined) params.append('inStockOnly', request.inStockOnly.toString());
  if (request.onSaleOnly !== undefined) params.append('onSaleOnly', request.onSaleOnly.toString());
  
  // Specification filters
  if (request.ramOptions?.length) {
    request.ramOptions.forEach(ram => params.append('ramOptions', ram));
  }
  if (request.storageOptions?.length) {
    request.storageOptions.forEach(storage => params.append('storageOptions', storage));
  }
  if (request.osOptions?.length) {
    request.osOptions.forEach(os => params.append('osOptions', os));
  }
  
  if (request.sortBy) params.append('sortBy', request.sortBy);
  if (request.sortDirection) params.append('sortDirection', request.sortDirection);
  if (request.page !== undefined) params.append('page', request.page.toString());
  if (request.size !== undefined) params.append('size', request.size.toString());
  
  return params;
}

class ProductViewService {
  /**
   * Search and filter products
   * GET /api/v1/products/search
   */
  async searchProducts(request: ProductSearchFilterRequest = {}): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = buildQueryParams(request);
      const url = `${API_BASE_URL}/products/search?${params}`;
      
      console.log('🔍 Searching products:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  /**
   * Get all products with pagination
   * GET /api/v1/products/all
   */
  async getAllProducts(request: ProductSearchFilterRequest = {}): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      if (request.sortBy) params.append('sortBy', request.sortBy);
      if (request.sortDirection) params.append('sortDirection', request.sortDirection);
      
      const url = `${API_BASE_URL}/products/all?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get products: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  }

  /**
   * Get product detail by ID
   * GET /api/v1/products/{id}
   */
  async getProductById(id: number): Promise<ProductDetailViewResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get product: ${response.statusText}`);
      }
      
      const result: ApiResponse<any> = await response.json();
      const apiData = result.data;
      
      console.log('📦 Raw API response from /products/{id}:', apiData);
      
      // Map API response to ProductDetailViewResponse
      const mapped: ProductDetailViewResponse = {
        id: apiData.id,
        name: apiData.name,
        description: apiData.description,
        thumbnailUrl: apiData.thumbnailUrl,
        
        // Category & Brand
        categoryId: apiData.category?.id || 0,
        categoryName: apiData.category?.name || '',
        brandId: apiData.brand?.id || 0,
        brandName: apiData.brand?.name || '',
        
        // Map variants to templates
        templates: (apiData.variants || []).map((v: any) => ({
          id: v.id,
          sku: v.sku,
          color: v.color,
          storage: v.storage,
          ram: v.ram,
          price: v.price || 0,
          stockQuantity: v.stockQuantity || 0,
          status: v.status !== false, // default to true if undefined
        })),
        
        // Rating & Reviews
        averageRating: apiData.averageRating || 0,
        totalReviews: apiData.totalReviews || 0,
        
        // Stock
        totalStock: (apiData.variants || []).reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0),
        soldCount: apiData.soldCount || 0,
        
        // Images
        images: (apiData.images || []).map((img: any) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          altText: img.altText || '',
          isPrimary: img.isPrimary || false,
          imageOrder: img.imageOrder || 0,
        })),
        
        // Map technicalSpecs to specifications
        specifications: apiData.technicalSpecs || {},
        
        // Dates (not provided by API, use current)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('✅ Mapped product data:', {
        id: mapped.id,
        name: mapped.name,
        price: mapped.templates[0]?.price,
        templatesCount: mapped.templates.length,
        hasSpecs: Object.keys(mapped.specifications).length > 0,
        specifications: mapped.specifications,
      });
      
      return mapped;
    } catch (error) {
      console.error('❌ Get product error:', error);
      throw error;
    }
  }

  /**
   * Get product detail with sold count
   * GET /api/v1/products/{id}/detail-with-sold
   */
  async getProductDetailWithSoldCount(id: number): Promise<ProductDetailViewResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/detail-with-sold`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get product with sold count: ${response.statusText}`);
      }
      
      const result: ApiResponse<any> = await response.json();
      const apiData = result.data;
      
      console.log('📦 Raw API response from /products/{id}/detail-with-sold:', apiData);
      
      // Same mapping as getProductById
      const mapped: ProductDetailViewResponse = {
        id: apiData.id,
        name: apiData.name,
        description: apiData.description,
        thumbnailUrl: apiData.thumbnailUrl,
        
        categoryId: apiData.category?.id || 0,
        categoryName: apiData.category?.name || '',
        brandId: apiData.brand?.id || 0,
        brandName: apiData.brand?.name || '',
        
        templates: (apiData.variants || []).map((v: any) => ({
          id: v.id,
          sku: v.sku,
          color: v.color,
          storage: v.storage,
          ram: v.ram,
          price: v.price || 0,
          stockQuantity: v.stockQuantity || 0,
          status: v.status !== false,
        })),
        
        averageRating: apiData.averageRating || 0,
        totalReviews: apiData.totalReviews || 0,
        totalStock: (apiData.variants || []).reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0),
        soldCount: apiData.soldCount || 0,
        
        images: (apiData.images || []).map((img: any) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          altText: img.altText || '',
          isPrimary: img.isPrimary || false,
          imageOrder: img.imageOrder || 0,
        })),
        
        specifications: apiData.technicalSpecs || {},
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('✅ Mapped product data with sold count');
      
      return mapped;
    } catch (error) {
      console.error('❌ Get product with sold count error:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   * GET /api/v1/products/category/{categoryId}
   */
  async getProductsByCategory(
    categoryId: number,
    request: ProductSearchFilterRequest = {}
  ): Promise<CategoryProductsResponse> {
    try {
      const params = new URLSearchParams();
      if (request.minPrice !== undefined) params.append('minPrice', request.minPrice.toString());
      if (request.maxPrice !== undefined) params.append('maxPrice', request.maxPrice.toString());
      if (request.sortBy) params.append('sortBy', request.sortBy);
      if (request.sortDirection) params.append('sortDirection', request.sortDirection);
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/category/${categoryId}?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get category products: ${response.statusText}`);
      }
      
      const result: ApiResponse<CategoryProductsResponse> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get category products error:', error);
      throw error;
    }
  }

  /**
   * Get related products
   * GET /api/v1/products/{id}/related
   */
  async getRelatedProducts(id: number, limit?: number): Promise<ProductViewResponse[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      
      const url = `${API_BASE_URL}/products/${id}/related?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get related products: ${response.statusText}`);
      }
      
      const result: ApiResponse<ProductViewResponse[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get related products error:', error);
      throw error;
    }
  }

  /**
   * Get best selling products
   * GET /api/v1/products/best-selling
   */
  async getBestSellingProducts(limit?: number): Promise<ProductViewResponse[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      
      const url = `${API_BASE_URL}/products/best-selling?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get best selling products: ${response.statusText}`);
      }
      
      const result: ApiResponse<ProductViewResponse[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get best selling products error:', error);
      throw error;
    }
  }

  /**
   * Get new arrival products
   * GET /api/v1/products/new-arrivals
   */
  async getNewArrivals(limit?: number): Promise<ProductViewResponse[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      
      const url = `${API_BASE_URL}/products/new-arrivals?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get new arrivals: ${response.statusText}`);
      }
      
      const result: ApiResponse<ProductViewResponse[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get new arrivals error:', error);
      throw error;
    }
  }

  /**
   * Get featured products
   * GET /api/v1/products/featured
   */
  async getFeaturedProducts(limit: number = 10): Promise<ProductViewResponse[]> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      
      const url = `${API_BASE_URL}/products/featured?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get featured products: ${response.statusText}`);
      }
      
      const result: ApiResponse<ProductViewResponse[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  }

  /**
   * Compare products
   * POST /api/v1/products/compare
   */
  async compareProducts(productIds: number[]): Promise<ProductComparisonResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productIds),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to compare products: ${response.statusText}`);
      }
      
      const result: ApiResponse<ProductComparisonResponse> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Compare products error:', error);
      throw error;
    }
  }

  /**
   * Filter by RAM
   * GET /api/v1/products/filter/ram
   */
  async filterByRam(
    ramOptions: string[],
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      ramOptions.forEach(ram => params.append('ramOptions', ram));
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/filter/ram?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by RAM: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by RAM error:', error);
      throw error;
    }
  }

  /**
   * Filter by storage
   * GET /api/v1/products/filter/storage
   */
  async filterByStorage(
    storageOptions: string[],
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      storageOptions.forEach(storage => params.append('storageOptions', storage));
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/filter/storage?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by storage: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by storage error:', error);
      throw error;
    }
  }

  /**
   * Filter by battery
   * GET /api/v1/products/filter/battery
   */
  async filterByBattery(
    minBattery: number | undefined,
    maxBattery: number | undefined,
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      if (minBattery !== undefined) params.append('minBattery', minBattery.toString());
      if (maxBattery !== undefined) params.append('maxBattery', maxBattery.toString());
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/filter/battery?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by battery: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by battery error:', error);
      throw error;
    }
  }

  /**
   * Filter by screen size
   * GET /api/v1/products/filter/screen
   */
  async filterByScreenSize(
    screenSizeOptions: string[],
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      screenSizeOptions.forEach(size => params.append('screenSizeOptions', size));
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/filter/screen?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by screen size: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by screen size error:', error);
      throw error;
    }
  }

  /**
   * Filter by OS
   * GET /api/v1/products/filter/os
   */
  async filterByOS(
    osOptions: string[],
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      osOptions.forEach(os => params.append('osOptions', os));
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/filter/os?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by OS: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by OS error:', error);
      throw error;
    }
  }

  /**
   * Filter by rating
   * GET /api/v1/products/filter/rating
   */
  async filterByRating(
    minRating: number | undefined,
    maxRating: number | undefined,
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      if (minRating !== undefined) params.append('minRating', minRating.toString());
      if (maxRating !== undefined) params.append('maxRating', maxRating.toString());
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      
      const url = `${API_BASE_URL}/products/filter/rating?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by rating: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by rating error:', error);
      throw error;
    }
  }

  /**
   * Filter by sold count
   * GET /api/v1/products/filter/sold-count
   */
  async filterBySoldCount(
    minSoldCount: number,
    request: ProductSearchFilterRequest = {}
  ): Promise<PageResponse<ProductViewResponse>> {
    try {
      const params = new URLSearchParams();
      params.append('minSoldCount', minSoldCount.toString());
      if (request.page !== undefined) params.append('page', request.page.toString());
      if (request.size !== undefined) params.append('size', request.size.toString());
      if (request.sortBy) params.append('sortBy', request.sortBy);
      if (request.sortDirection) params.append('sortDirection', request.sortDirection);
      
      const url = `${API_BASE_URL}/products/filter/sold-count?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to filter by sold count: ${response.statusText}`);
      }
      
      const result: ApiResponse<PageResponse<ProductViewResponse>> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Filter by sold count error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productViewService = new ProductViewService();
