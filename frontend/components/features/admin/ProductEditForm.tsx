'use client';

/**
 * ProductEditForm - Form to edit existing products
 */

import { useState, useEffect } from 'react';
import { updateProduct, getAllCategories, getAllBrands } from '@/lib/api';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductEditFormProps {
  product: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductEditForm({ product, onSuccess, onCancel }: ProductEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    categoryId: product.categoryId,
    brandId: product.brandId,
    thumbnailUrl: product.thumbnailUrl || '',
  });

  // Load categories and brands on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          getAllCategories(),
          getAllBrands()
        ]);
        if (catsRes.success && catsRes.data) setCategories(catsRes.data);
        if (brandsRes.success && brandsRes.data) setBrands(brandsRes.data);
      } catch (err) {
        console.error('Failed to load categories/brands:', err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Call update API
      const response = await updateProduct(product.id, formData);
      
      if (response.success) {
        alert('Cập nhật sản phẩm thành công!');
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Lỗi khi cập nhật sản phẩm');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi cập nhật sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Sửa sản phẩm</h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Samsung Galaxy S24 Ultra"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả sản phẩm..."
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Ảnh đại diện (Thumbnail URL) *</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/product-image.jpg"
                required
              />
              {formData.thumbnailUrl && (
                <div className="mt-2">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x200?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Danh mục *</Label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId">Thương hiệu *</Label>
                <select
                  id="brandId"
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
