'use client';

import { useState } from 'react';
import { ProductTable, ProductEditForm } from '@/components/features/admin';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => router.push('/manage/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductTable onEdit={handleEdit} />

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
