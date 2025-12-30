'use client';

import React, { useState, useEffect } from 'react';
import { useProductView } from '@/hooks/useProductView';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard, ProductCardSkeleton } from '@/components/features/products/ProductCard';
import { ProductFilterSidebar } from '@/components/features/products/ProductFilterSidebar';
import { ComparisonBar } from '@/components/features/products/ComparisonBar';
import { QuickViewModal } from '@/components/features/products/QuickViewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, SlidersHorizontal, Grid3x3, LayoutGrid, GitCompare } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'created_date:desc', label: 'Mới nhất', sortBy: 'created_date', sortDirection: 'desc' as const },
  { value: 'created_date:asc', label: 'Cũ nhất', sortBy: 'created_date', sortDirection: 'asc' as const },
  { value: 'price:asc', label: 'Giá: Thấp đến cao', sortBy: 'price', sortDirection: 'asc' as const },
  { value: 'price:desc', label: 'Giá: Cao đến thấp', sortBy: 'price', sortDirection: 'desc' as const },
  { value: 'rating:desc', label: 'Đánh giá cao nhất', sortBy: 'rating', sortDirection: 'desc' as const },
  { value: 'name:asc', label: 'Tên: A-Z', sortBy: 'name', sortDirection: 'asc' as const },
  { value: 'name:desc', label: 'Tên: Z-A', sortBy: 'name', sortDirection: 'desc' as const },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial filters from URL
  const initialKeyword = searchParams.get('keyword') || '';
  const initialCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  
  // Comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<number>>(new Set());
  
  // Quick view state
  const [quickViewProductId, setQuickViewProductId] = useState<number | null>(null);
  
  // Wishlist state (placeholder)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  
  // Fetch brands and categories
  const { brands, loading: brandsLoading } = useBrands();
  const { categories, loading: categoriesLoading } = useCategories({ parentId: null });
  
  // Product view hook
  const {
    products,
    loading,
    error,
    totalPages,
    totalElements,
    currentPage,
    filters,
    searchProducts,
    setPage,
    setSortBy,
    setKeyword,
    setCategoryId,
    setBrandIds,
    setPriceRange,
    setRating,
    setInStockOnly,
    setOnSaleOnly,
    setRamOptions,
    setStorageOptions,
    setOsOptions,
    clearFilters,
  } = useProductView({
    initialFilters: {
      keyword: initialKeyword,
      categoryId: initialCategoryId,
      page: 0,
      size: 20,
      sortBy: 'created_date',
      sortDirection: 'desc',
    },
    autoLoad: true,
  });

  // Handle search input
  const handleSearch = () => {
    setKeyword(searchKeyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find(opt => opt.value === value);
    if (option) {
      setSortBy(option.sortBy, option.sortDirection);
    }
  };

  // Handle add to cart (placeholder)
  const handleAddToCart = (productId: number) => {
    console.log('Add to cart:', productId);
    // TODO: Implement add to cart functionality
  };

  // Handle quick view
  const handleQuickView = (productId: number) => {
    setQuickViewProductId(productId);
  };

  // Handle comparison
  const handleSelectForCompare = (productId: number, selected: boolean) => {
    if (selected) {
      // Check if we already have products selected
      if (selectedForCompare.size > 0) {
        // Get category of first selected product
        const firstSelectedProduct = products.find(p => selectedForCompare.has(p.id));
        const currentProduct = products.find(p => p.id === productId);
        
        if (firstSelectedProduct && currentProduct) {
          if (firstSelectedProduct.categoryId !== currentProduct.categoryId) {
            alert(
              `Chỉ có thể so sánh sản phẩm cùng danh mục!\n` +
              `Bạn đang chọn: ${firstSelectedProduct.categoryName}\n` +
              `Sản phẩm này thuộc: ${currentProduct.categoryName}`
            );
            return;
          }
        }
      }
      
      // Check max limit
      if (selectedForCompare.size >= 4) {
        alert('Chỉ có thể so sánh tối đa 4 sản phẩm!');
        return;
      }
    }
    
    setSelectedForCompare(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const handleRemoveFromCompare = (productId: number) => {
    setSelectedForCompare(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleClearCompare = () => {
    setSelectedForCompare(new Set());
    setCompareMode(false);
  };

  // Handle wishlist
  const handleToggleWishlist = (productId: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Prepare comparison products for ComparisonBar
  const comparisonProducts = products
    .filter(p => selectedForCompare.has(p.id))
    .map(p => ({
      id: p.id,
      name: p.name,
      image: p.thumbnailUrl || '/placeholder-product.png',
      price: p.minPrice || 0,
      categoryName: p.categoryName,
    }));

  // Prepare filter options
  const categoryOptions = categories.map(cat => ({
    id: cat.id,
    label: cat.name,
    count: cat.productCount,
  }));

  const brandOptions = brands.map(brand => ({
    id: brand.id,
    label: brand.name,
    count: brand.productCount,
  }));

  // Generate pagination range
  const getPaginationRange = () => {
    const range: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < 3; i++) range.push(i);
        range.push('ellipsis');
        range.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        range.push(0);
        range.push('ellipsis');
        for (let i = totalPages - 3; i < totalPages; i++) range.push(i);
      } else {
        range.push(0);
        range.push('ellipsis');
        range.push(currentPage - 1);
        range.push(currentPage);
        range.push(currentPage + 1);
        range.push('ellipsis');
        range.push(totalPages - 1);
      }
    }
    
    return range;
  };

  const currentSortValue = `${filters.sortBy}:${filters.sortDirection}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Danh sách sản phẩm</h1>
        <p className="text-muted-foreground">
          Tìm thấy {totalElements.toLocaleString('vi-VN')} sản phẩm
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        {/* Sort & Tools */}
        <div className="flex gap-2">
          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Compare Mode Toggle */}
          <Button
            variant={compareMode ? 'default' : 'outline'}
            onClick={() => setCompareMode(!compareMode)}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            So sánh
            {selectedForCompare.size > 0 && (
              <span className="ml-1">({selectedForCompare.size})</span>
            )}
          </Button>

          {/* Grid Layout Toggle */}
          <div className="hidden md:flex gap-1 border rounded-md p-1">
            <Button
              variant={gridCols === 3 ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setGridCols(3)}
              className="h-8 w-8"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={gridCols === 4 ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setGridCols(4)}
              className="h-8 w-8"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <ProductFilterSidebar
                categories={categoryOptions}
                brands={brandOptions}
                selectedCategoryId={filters.categoryId}
                selectedBrandIds={filters.brandIds || []}
                selectedRamOptions={filters.ramOptions || []}
                selectedStorageOptions={filters.storageOptions || []}
                selectedOsOptions={filters.osOptions || []}
                priceRange={[filters.minPrice || 0, filters.maxPrice || 50000000]}
                minRating={filters.minRating}
                inStockOnly={filters.inStockOnly}
                onSaleOnly={filters.onSaleOnly}
                onCategoryChange={setCategoryId}
                onBrandChange={setBrandIds}
                onRamChange={setRamOptions}
                onStorageChange={setStorageOptions}
                onOsChange={setOsOptions}
                onPriceRangeChange={(range) => setPriceRange(range[0], range[1])}
                onRatingChange={setRating}
                onInStockOnlyChange={setInStockOnly}
                onOnSaleOnlyChange={setOnSaleOnly}
                onClearFilters={clearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <ProductFilterSidebar
            categories={categoryOptions}
            brands={brandOptions}
            selectedCategoryId={filters.categoryId}
            selectedBrandIds={filters.brandIds || []}
            selectedRamOptions={filters.ramOptions || []}
            selectedStorageOptions={filters.storageOptions || []}
            selectedOsOptions={filters.osOptions || []}
            priceRange={[filters.minPrice || 0, filters.maxPrice || 50000000]}
            minRating={filters.minRating}
            inStockOnly={filters.inStockOnly}
            onSaleOnly={filters.onSaleOnly}
            onCategoryChange={setCategoryId}
            onBrandChange={setBrandIds}
            onRamChange={setRamOptions}
            onStorageChange={setStorageOptions}
            onOsChange={setOsOptions}
            onPriceRangeChange={(range) => setPriceRange(range[0], range[1])}
            onRatingChange={setRating}
            onInStockOnlyChange={setInStockOnly}
            onOnSaleOnlyChange={setOnSaleOnly}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                Không tìm thấy sản phẩm nào
              </p>
              <Button onClick={clearFilters}>Xóa bộ lọc</Button>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    compareMode={compareMode}
                    isSelected={selectedForCompare.has(product.id)}
                    onSelectForCompare={handleSelectForCompare}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlist.has(product.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 0 && setPage(currentPage - 1)}
                          className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {getPaginationRange().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => setPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page + 1}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages - 1 && setPage(currentPage + 1)}
                          className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Trang {currentPage + 1} / {totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedProducts={comparisonProducts}
        onRemove={handleRemoveFromCompare}
        onClear={handleClearCompare}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        productId={quickViewProductId}
        open={quickViewProductId !== null}
        onClose={() => setQuickViewProductId(null)}
      />
    </div>
  );
}
