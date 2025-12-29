'use client';

import { useState, useEffect } from 'react';
import { ProductTable, ProductEditForm } from '@/components/features/admin';
import { productService } from '@/services/product.service';
import { getRootCategories, CategoryResponse } from '@/services/category.service';
import { getAllBrands, BrandResponse } from '@/services/brand.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// Local lightweight product type for admin listing
interface LocalProduct {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  thumbnailUrl?: string;
  status: boolean;
  categoryName?: string;
  brandName?: string;
}

export default function ProductsPage() {
  console.log('🏠 ProductsPage component rendering');
  const router = useRouter();
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  console.log('🏠 editingProduct state:', editingProduct);
  
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: undefined as number | undefined,
    brandId: undefined as number | undefined,
    status: undefined as boolean | undefined,
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        page: currentPage,
        size: 20,
        ...filters,
      });
      
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and brands on component mount
  const fetchFiltersData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        getRootCategories(),
        getAllBrands(),
      ]);
      
      setCategories(categoriesData);
      setBrands(brandsData);
      console.log('Filters data loaded:', { categories: categoriesData.length, brands: brandsData.length });
    } catch (error) {
      console.error('Failed to fetch filters data:', error);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const handleSearch = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword }));
    setCurrentPage(0);
  };

  const handleSort = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setFilters((prev) => ({ ...prev, sortBy, sortDirection }));
    setCurrentPage(0);
  };

  const handleFilter = (newFilters: { categoryId?: number; brandId?: number; status?: boolean }) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(0);
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = async (product: any) => {
    console.log('🎯 PAGE.TSX handleEdit called with product:', product);
    try {
      const full = await productService.getProductById(product.id);
      setEditingProduct(full);
    } catch (err) {
      console.error('Failed to load full product for edit:', err);
      // fallback to shallow product
      setEditingProduct(product as any);
    }
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
      </div>

      <ProductTable
        onEdit={handleEdit}
        onRefresh={fetchProducts}
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductEditForm
          product={editingProduct}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
}
