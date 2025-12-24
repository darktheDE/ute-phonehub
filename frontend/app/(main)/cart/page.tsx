'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import { useAuth } from '@/lib/auth-context';
import { cartAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CartItem, CartSummary, EmptyCart } from '@/components/features/cart';
import { ArrowLeft, Trash2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { scheduleDelete, undoMultiple } from '@/lib/undo';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, setItems, removeItems } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Fetch cart from backend when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartFromBackend();
    }
  }, [isAuthenticated, user]);

  // Refresh cart when an order is placed in another tab/window
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lastOrderPlacedAt') {
        if (isAuthenticated && user) fetchCartFromBackend();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [isAuthenticated, user]);

  const fetchCartFromBackend = async () => {
    setIsLoading(true);
    try {
      const response = await cartAPI.getCurrentCart();
      if (response.success && response.data) {
        // Map backend cart items and set to local store preserving backend ids
        const backendItems = Array.isArray(response.data.items) ? response.data.items : [];
        const mappedItems = backendItems.map((item: any) => ({
          id: Number(item.id),
          productId: item.productId,
          productName: item.productName || item.product?.name || 'Unknown Product',
          productImage: item.productImage || item.productThumbnailUrl || item.product?.thumbnailUrl || '',
          price: item.price || item.unitPrice || item.product?.salePrice || 0,
          quantity: item.quantity,
          color: item.color,
          storage: item.storage,
        }));

        // Replace local cart with backend data
        clearCart();
        if (mappedItems.length > 0) setItems(mappedItems as any);
      }
    } catch (error) {
      console.error('Failed to fetch cart from backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = useState(false);

  const handleClearCart = async () => {
    // Server-side clearCart (single request) with undo that re-adds previous items if requested
    const prevItems = [...items];
    if (prevItems.length === 0) {
      setShowClearConfirm(false);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await cartAPI.clearCart();
      if (resp && resp.success) {
        // Clear local store
        clearCart();

        // Show undo toast which will attempt to re-add previous items if clicked
        // Prevent duplicate undo clicks by using a captured flag
        toast.success(
          (() => {
            let undone = false;
            return (
              <div className="flex items-center gap-3">
                <span>Đã xóa tất cả sản phẩm</span>
                <button
                  className="underline ml-2 text-sm"
                  onClick={async () => {
                    if (undone) return; // ignore subsequent clicks
                    undone = true;
                    try {
                      // Re-add items sequentially (could be parallel but sequential reduces race)
                      for (const it of prevItems) {
                        await cartAPI.addToCart({
                          productId: it.productId,
                          quantity: it.quantity,
                          color: it.color,
                          storage: it.storage,
                        });
                      }

                      // Refresh cart from backend
                      const r = await cartAPI.getCurrentCart();
                      if (r && r.success && r.data) {
                        const backendItems = Array.isArray(r.data.items) ? r.data.items : [];
                        const mappedItems = backendItems.map((item: any) => ({
                          id: Number(item.id),
                          productId: item.productId,
                          productName: item.productName || item.product?.name || 'Unknown Product',
                          productImage: item.productImage || item.productThumbnailUrl || item.product?.thumbnailUrl || '',
                          price: item.price || item.unitPrice || item.product?.salePrice || 0,
                          quantity: item.quantity,
                          color: item.color,
                          storage: item.storage,
                        }));
                        clearCart();
                        if (mappedItems.length > 0) setItems(mappedItems as any);
                      }
                      toast.success('Hoàn tác thành công — đã phục hồi giỏ hàng');
                    } catch (e) {
                      console.error('Failed to undo clearCart:', e);
                      toast.error('Không thể hoàn tác xóa giỏ hàng');
                    }
                  }}
                >
                  Hoàn tác
                </button>
              </div>
            );
          })()
        );
      } else {
        throw new Error(resp?.message || 'Không thể xóa giỏ hàng');
      }
    } catch (e: any) {
      console.error('Failed to clear cart on server:', e);
      // Restore local items if server clear failed
      if (prevItems.length > 0) setItems(prevItems as any);
      toast.error(e?.message || 'Lỗi khi xóa toàn bộ giỏ hàng');
    } finally {
      setIsLoading(false);
      setShowClearConfirm(false);
    }
  };

  const toggleSelect = (id: number, selected: boolean) => {
    setSelectedIds((prev) => {
      if (selected) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    // Optimistic bulk delete with undo
    const itemsToDelete = items.filter((it) => selectedIds.includes(it.id));
    if (itemsToDelete.length === 0) return;

    // Remove locally
    removeItems(selectedIds);

    // Schedule each delete and allow undo for all
    itemsToDelete.forEach((it) => {
      scheduleDelete(
        it.id,
        async () => {
          try {
            await cartAPI.removeCartItem(it.id);
          } catch (e) {
            // on failure, restore only this item
            const current = useCartStore.getState().items;
            useCartStore.getState().setItems([it, ...current]);
            throw e;
          }
        },
        () => {
          try {
            const current = useCartStore.getState().items;
            useCartStore.getState().setItems([it, ...current]);
          } catch (e) {
            console.error('Failed to restore deleted item after undo:', e);
          }
        }
      );
    });

    // Show undo toast
    toast.success(
      (<div className="flex items-center gap-3">
        <span>Đã xóa {itemsToDelete.length} sản phẩm</span>
        <button className="underline ml-2 text-sm" onClick={() => undoMultiple(itemsToDelete.map((i) => i.id))}>Hoàn tác</button>
      </div>)
    );

    setSelectedIds([]);
    setShowDeleteSelectedConfirm(false);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    // Navigate to checkout page
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải giỏ hàng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
              <p className="text-gray-600 mt-1">
                {totalItems} sản phẩm • Tổng: {totalPrice.toLocaleString('vi-VN')}₫
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                  onClick={() => setShowDeleteSelectedConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={selectedIds.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa đã chọn
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Sản phẩm trong giỏ</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    selected={selectedIds.includes(item.id)}
                    onSelectChange={toggleSelect}
                  />
                ))}
              </div>

              <div className="p-6 bg-gray-50">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/products" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <CartSummary
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    onCheckout={handleCheckout}
                    compact
                    selectedIds={selectedIds}
                    onBuySelected={() => {
                      if (selectedIds.length === 0) return;
                      // Navigate to checkout with selected item ids in query
                      router.push(`/checkout?selected=${selectedIds.join(',')}`);
                    }}
                  />
            </div>
          </div>
        </div>

        {/* Mobile floating CTA */}
        {totalItems > 0 && (
          <div className="sm:hidden fixed bottom-4 left-0 right-0 px-4">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleCheckout}
                aria-label={`Đặt hàng`}
                className="w-full h-12 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-semibold shadow-lg"
              >
                {`Đặt hàng`}
              </button>
            </div>
          </div>
        )}
        {/* Confirm dialogs */}
        <ConfirmDialog
          open={showClearConfirm}
          title="Xóa tất cả sản phẩm"
          description="Hành động này sẽ xóa toàn bộ sản phẩm trong giỏ hàng của bạn. Bạn có muốn tiếp tục?"
          confirmLabel="Xóa tất cả"
          cancelLabel="Hủy"
          intent="danger"
          onConfirm={handleClearCart}
          onClose={() => setShowClearConfirm(false)}
        />

        <ConfirmDialog
          open={showDeleteSelectedConfirm}
          title="Xóa sản phẩm đã chọn"
          description={`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`}
          confirmLabel="Xóa"
          cancelLabel="Hủy"
          intent="danger"
          onConfirm={handleDeleteSelected}
          onClose={() => setShowDeleteSelectedConfirm(false)}
        />
      </div>
    </div>
  );
}