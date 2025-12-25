import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Image from 'next/image';
import { cartAPI } from '@/lib/api';
import { toast } from 'sonner';
import { scheduleDelete, undoDelete } from '@/lib/undo';
import { useCartStore } from '@/store';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  selected?: boolean;
  onSelectChange?: (id: number, selected: boolean) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove, selected, onSelectChange }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isValidImageSrc = (src: unknown) => {
    if (!src || typeof src !== 'string') return false;
    const s = src.trim();
    // Only allow absolute URLs, protocol-relative, root-relative, data:, blob:
    // and ensure the string contains only ASCII URL-safe characters (reject emoji)
    const hasAllowedPrefix = /^(https?:\/\/|\/\/|\/|data:|blob:)/i.test(s);
    if (!hasAllowedPrefix) return false;
    // Reject strings containing non-ASCII characters (emoji, full-width, etc.)
    // This keeps `next/image` from attempting to parse invalid src values like emoji
    const isAscii = /^[\x00-\x7F]+$/.test(s);
    return isAscii;
  };

  const getErrorInfo = (e: unknown): { status?: number; message?: string; data?: unknown } => {
    if (!e || typeof e !== 'object') return { message: String(e) };
    const obj = e as Record<string, unknown>;
    return {
      status: typeof obj.status === 'number' ? (obj.status as number) : undefined,
      message: typeof obj.message === 'string' ? (obj.message as string) : undefined,
      data: obj.data,
    };
  };

  const mapBackendItems = (backendItems: unknown[]): CartItemType[] => {
    return backendItems.map((it) => {
      const obj = (it && typeof it === 'object') ? it as Record<string, unknown> : {};
      const id = typeof obj.id === 'number' ? obj.id : Number(obj.id ?? 0);
      const productId = typeof obj.productId === 'number' ? obj.productId : Number(obj.productId ?? 0);
      const productName = typeof obj.productName === 'string' ? obj.productName : (typeof obj.product === 'object' && obj.product ? String((obj.product as Record<string, unknown>).name ?? 'Unknown Product') : 'Unknown Product');
      const productImage = typeof obj.productImage === 'string' ? obj.productImage : (typeof obj.productThumbnailUrl === 'string' ? obj.productThumbnailUrl : (typeof obj.product === 'object' && obj.product ? String((obj.product as Record<string, unknown>).thumbnailUrl ?? '') : ''));
      const price = typeof obj.price === 'number' ? obj.price : (typeof obj.unitPrice === 'number' ? obj.unitPrice : (typeof obj.product === 'object' && obj.product ? Number((obj.product as Record<string, unknown>).salePrice ?? 0) : 0));
      const quantity = typeof obj.quantity === 'number' ? obj.quantity : Number(obj.quantity ?? 0);
      const color = typeof obj.color === 'string' ? obj.color : undefined;
      const storage = typeof obj.storage === 'string' ? obj.storage : undefined;

      return {
        id,
        productId,
        productName,
        productImage,
        price,
        quantity,
        color,
        storage,
      };
    });
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      // Call backend API to update quantity
      const response = await cartAPI.updateCartItem(item.id, newQuantity);
      if (response.success) {
        // Update local store
        onUpdateQuantity(item.id, newQuantity);
        toast.success(
          (<div className="flex items-center gap-2"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> <span>Cập nhật số lượng thành công</span></div>)
        );
      } else {
        toast.error(
          (<div className="flex items-center gap-2"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> <span>Không thể cập nhật số lượng</span></div>)
        );
      }
    } catch (error: unknown) {
      console.error('Failed to update cart item:', error);

      const info = getErrorInfo(error);

      const message = (info.message || '').toLowerCase();

      if (
        info.status === 404 ||
        message.includes('không tồn tại') ||
        message.includes('not found') ||
        message.includes('does not exist')
      ) {
        try {
          useCartStore.getState().removeItem(item.id);
        } catch (e) {
          console.error('Failed to remove missing cart item:', e);
        }

        toast.error('Sản phẩm không còn tồn tại — đã xóa khỏi giỏ hàng');
        setIsUpdating(false);
        return;
      }
      // If server returns availableStock (insufficient stock), update UI accordingly
      const availableStock = (info.data && typeof (info.data as Record<string, unknown>).availableStock === 'number') ? (info.data as Record<string, unknown>).availableStock as number : (typeof (info as Record<string, unknown>).availableStock === 'number' ? (info as Record<string, unknown>).availableStock as number : undefined);
      if (typeof availableStock === 'number') {
        try {
          const qty = Math.max(0, Number(availableStock));
          if (qty === 0) {
            try {
              useCartStore.getState().removeItem(item.id);
            } catch (e) {
              console.error('Failed to remove item after availableStock=0:', e);
            }
            toast.error(`Chỉ còn 0 sản phẩm trong kho — sản phẩm đã được loại khỏi giỏ.`);
            setIsUpdating(false);
            return;
          }


        // If item no longer exists on server (deleted/ordered), remove locally
        const msg = (info.message || '').toString().toLowerCase();
        if (info.status === 404 || msg.includes('không tồn tại') || msg.includes('not found') || msg.includes('does not exist')) {
          try {
            useCartStore.getState().removeItem(item.id);
          } catch (e) {
            console.error('Failed to remove missing cart item locally:', e);
          }
          toast.error('Sản phẩm không tồn tại trong giỏ (có thể đã đặt/hết hàng) — đã loại khỏi giỏ hàng.');
          setIsUpdating(false);
          return;
        }
          try {
            onUpdateQuantity(item.id, qty);
          } catch (e) {
            try {
              useCartStore.getState().setItems(
                useCartStore.getState().items.map((it) => (it.id === item.id ? { ...it, quantity: qty } : it))
              );
            } catch (err) {
              console.error('Failed to set availableStock on item:', err);
            }
          }

          toast.error(`Chỉ còn ${qty} sản phẩm trong kho`);
          setIsUpdating(false);
          return;
        } catch (e) {
          console.error('Error handling availableStock:', e);
        }
      }

      // If conflict (optimistic locking), refetch current cart and sync local store
      if (info.status === 409) {
        try {
          const resp = await cartAPI.getCurrentCart();
          if (resp && resp.success && resp.data) {
            const backendItems = Array.isArray(resp.data.items) ? resp.data.items : [];
            const mappedItems = mapBackendItems(backendItems);

            try {
              useCartStore.getState().setItems(mappedItems as CartItemType[]);
            } catch (e) {
              console.error('Failed to set items after conflict:', e);
            }

            toast.error('Giỏ hàng đã thay đổi do cập nhật đồng thời — đã tải lại trạng thái giỏ.');
            setIsUpdating(false);
            return;
          }
        } catch (e) {
          console.error('Failed to refetch cart after conflict:', e);
        }
      }

      toast.error(
        (<div className="flex items-center gap-2"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> <span>{info.message || 'Lỗi khi cập nhật số lượng'}</span></div>)
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    // Optimistic remove + undo
    // Remove locally immediately
    onRemove(item.id);

    // schedule finalize: call backend after timeout
    scheduleDelete(
      item.id,
      async () => {
        try {
          setIsUpdating(true);
          const response = await cartAPI.removeCartItem(item.id);
          setIsUpdating(false);
          if (!response || !response.success) {
            const err = new Error(response?.message || 'Không thể xóa sản phẩm');
            throw err;
          }
        } catch (e: unknown) {
          setIsUpdating(false);
          const info = getErrorInfo(e);

          // If conflict, refetch and sync store
          if (info.status === 409) {
            try {
              const resp = await cartAPI.getCurrentCart();
              if (resp && resp.success && resp.data) {
                const backendItems = Array.isArray(resp.data.items) ? resp.data.items : [];
                const mappedItems = mapBackendItems(backendItems);
                useCartStore.getState().setItems(mappedItems as CartItemType[]);
                toast.error('Giỏ hàng đã thay đổi — đã tải lại trạng thái giỏ.');
              }
            } catch (re) {
              console.error('Failed to refetch cart after conflict:', re);
            }
          }

          throw e;
        }
      },
      // restore function
      () => {
        try {
          const current = useCartStore.getState().items;
          useCartStore.getState().setItems([item, ...current]);
        } catch (e) {
          console.error('Failed to restore item after undo:', e);
        }
      }
    );

    // show undo toast
    toast.success(
      (<div className="flex items-center gap-3">
        <span>Đã xóa sản phẩm</span>
        <button className="underline ml-2 text-sm" onClick={() => undoDelete(item.id)}>Hoàn tác</button>
      </div>)
    );
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          <div>
            <input
              type="checkbox"
              checked={!!(typeof selected !== 'undefined' ? selected : false)}
              onChange={(e) => onSelectChange && onSelectChange(item.id, e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded"
              aria-label={`Chọn sản phẩm ${item.productName}`}
            />
          </div>
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
            {isValidImageSrc(item.productImage) && !imageError ? (
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
              {item.productName}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {item.color && (
                <Badge variant="secondary" className="text-xs">
                  {item.color}
                </Badge>
              )}
              {item.storage && (
                <Badge variant="secondary" className="text-xs">
                  {item.storage}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isUpdating) return;
                      if (item.quantity <= 1) {
                        // show confirm to remove item instead of decrementing to 0
                        setShowRemoveConfirm(true);
                        return;
                      }
                      handleQuantityChange(item.quantity - 1);
                    }}
                    disabled={isUpdating}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isUpdating}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

                <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {(((item as any).appliedPrice ?? item.price) * item.quantity).toLocaleString('vi-VN')}₫
                </div>
                {((item as any).appliedPrice && (item as any).appliedPrice !== item.price) ? (
                  <div className="text-sm text-gray-500">
                    <div className="line-through text-xs">{item.price.toLocaleString('vi-VN')}₫</div>
                    <div className="text-xs">{( (item as any).appliedPrice).toLocaleString('vi-VN')}₫ × {item.quantity}</div>
                  </div>
                ) : item.quantity > 1 ? (
                  <div className="text-sm text-gray-500">
                    {item.price.toLocaleString('vi-VN')}₫ × {item.quantity}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
        {/* Confirm dialog for removing when decrementing from 1 */}
        <ConfirmDialog
          open={showRemoveConfirm}
          title="Xóa sản phẩm"
          description="Bạn chắc chắn muốn xóa sản phẩm này?"
          confirmLabel="Xóa"
          cancelLabel="Hủy"
          intent="danger"
          onConfirm={() => {
            setShowRemoveConfirm(false);
            handleRemove();
          }}
          onClose={() => setShowRemoveConfirm(false)}
        />
    </Card>
  );
}