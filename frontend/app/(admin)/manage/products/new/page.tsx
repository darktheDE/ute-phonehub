'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/features/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/manage?tab=products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Add New Product</h1>
          <p className="text-sm text-muted-foreground">
            Create a new product for your store
          </p>
        </div>
      </div>

      <ProductForm onSuccess={handleSuccess} />
    </div>
  );
}
