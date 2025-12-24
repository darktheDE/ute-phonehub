'use client';

import { useState, useEffect } from 'react';
import { ProductTable } from './admin/ProductTable';
import { adminAPI } from '@/lib/api';

export function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching products with params:', {
        page: currentPage,
        size: 10,
        keyword: searchKeyword,
        sortBy,
        sortDirection,
        ...filters,
      });
      
      const response = await adminAPI.getAllProducts({
        page: currentPage,
        size: 10,
        keyword: searchKeyword,
        sortBy,
        sortDirection,
        ...filters,
      });
      
      console.log('📦 Products API response:', response);
      
      if (response.success && response.data) {
        setProducts(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalElements || 0);
        console.log('✅ Loaded products:', response.data.content?.length || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await adminAPI.getAllBrands();
      if (response.success && response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchKeyword, sortBy, sortDirection, filters]);

  const handleDelete = async (id: number) => {
    try {
      const response = await adminAPI.deleteProduct(id);
      if (response.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ProductTable
      products={products}
      categories={categories}
      brands={brands}
      totalPages={totalPages}
      currentPage={currentPage}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      onSearch={setSearchKeyword}
      onSort={(sortBy, direction) => {
        setSortBy(sortBy);
        setSortDirection(direction);
      }}
      onFilter={setFilters}
      onDelete={handleDelete}
    />
  );
}
