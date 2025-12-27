'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCartStore } from '@/store';
import { cartAPI } from '@/lib/api';
import { mapBackendCartItems } from '@/lib/utils/cartMapper';
import { toast } from 'sonner';

export function useCartSync() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { items, clearCart, setItems } = useCartStore();
  
  // Use sessionStorage to persist merge status across page reloads
  const getMergeStatus = () => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('cart-merged-session') === 'true';
  };
  
  const setMergeStatus = (status: boolean) => {
    if (typeof window === 'undefined') return;
    if (status) {
      sessionStorage.setItem('cart-merged-session', 'true');
    } else {
      sessionStorage.removeItem('cart-merged-session');
    }
  };

  const [hasCheckedMerge, setHasCheckedMerge] = useState(getMergeStatus);

  useEffect(() => {
    const alreadyMerged = getMergeStatus();
    
    if (isAuthenticated && user && !alreadyMerged) {
      // Only check merge once per session
      setHasCheckedMerge(true);
      setMergeStatus(true);
      checkAndMergeCart();
    } else if (!isAuthenticated) {
      // Clear merge status when user logs out
      setHasCheckedMerge(false);
      setMergeStatus(false);
      clearCart();
    }
  }, [isAuthenticated, user]);

  const checkAndMergeCart = async () => {
    try {
      // Read guest cart from localStorage (Zustand may not be hydrated yet)
      let guestItems: any[] = Array.isArray(items) && items.length > 0 ? items : [];
      
      if (guestItems.length === 0 && typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('cart-storage');
          if (raw) {
            const parsed = JSON.parse(raw);
            const foundItems = findItemsArray(parsed);
            if (Array.isArray(foundItems) && foundItems.length > 0) {
              guestItems = foundItems;
            }
          }
        } catch (e) {
          console.warn('useCartSync: failed to read persisted cart', e);
        }
      }

      // Fetch backend cart
      const backendResp = await cartAPI.getCurrentCart();
      const backendItems = (backendResp?.success && Array.isArray(backendResp.data?.items)) 
        ? backendResp.data.items 
        : [];

      const hasGuestItems = guestItems.length > 0;
      const hasBackendItems = backendItems.length > 0;

      if (!hasGuestItems) {
        // No guest cart, just sync with backend
        if (hasBackendItems) {
          const mapped = mapBackendCartItems(backendItems);
          // Clear any stale guest cart data
          clearCart();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart-storage');
          }
          setItems(mapped);
        }
        return;
      }

      if (!hasBackendItems) {
        // No backend cart, just merge guest cart silently
        await mergeGuestCartToBackend(guestItems, false);
        return;
      }

      // Both have items - show notification and merge
      showMergeNotification(guestItems, backendItems);
      await mergeGuestCartToBackend(guestItems, true);

    } catch (error) {
      console.error('Failed to check and merge cart:', error);
      // On error, still fetch backend cart as fallback
      try {
        const resp = await cartAPI.getCurrentCart();
        if (resp?.success && resp.data?.items) {
          const mapped = mapBackendCartItems(resp.data.items);
          setItems(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch cart on merge error:', e);
      }
    }
  };

  const showMergeNotification = (guestItems: any[], backendItems: any[]) => {
    toast.info(
      `Đã gộp ${guestItems.length} sản phẩm chưa đăng nhập vào giỏ hàng (${backendItems.length} sản phẩm trước đó)`,
      {
        duration: 5000,
        closeButton: true,
      }
    );
  };

  const mergeGuestCartToBackend = async (guestItems: any[], showSuccessToast: boolean) => {
    try {
      const guestCartItems = guestItems.map((it: any) => {
        const qty = Math.max(1, Math.min(10, Number(it.quantity ?? 1)));
        return { 
          productId: Number(it.productId ?? 0), 
          quantity: qty,
        };
      }).filter(it => it.productId > 0);

      if (guestCartItems.length === 0) {
        // Fetch backend cart as fallback
        const resp = await cartAPI.getCurrentCart();
        if (resp?.success && resp.data?.items) {
          const mapped = mapBackendCartItems(resp.data.items);
          setItems(mapped);
        }
        return;
      }

      try {
        await cartAPI.mergeGuestCart({ guestCartItems });
        if (showSuccessToast) {
          toast.success('Đã gộp giỏ hàng thành công');
        }
      } catch (mergeErr: any) {
        const msg = String(mergeErr?.message || mergeErr || '');
        
        // If per-product limit error, try adding items one by one
        if (msg.includes('Maximum') || msg.includes('10 items')) {
          await Promise.allSettled(
            guestCartItems.map(it => 
              cartAPI.addToCart({ productId: it.productId, quantity: it.quantity })
            )
          );
          if (showSuccessToast) {
            toast.warning('Đã gộp giỏ hàng (một số sản phẩm đạt giới hạn)');
          }
        } else if (msg.includes('Row was updated') || msg.includes('stale')) {
          // Concurrency error - just refetch
          console.warn('Concurrency error during merge, refetching cart');
        } else {
          throw mergeErr;
        }
      }

      // Always fetch latest cart from backend after merge
      const finalResp = await cartAPI.getCurrentCart();
      if (finalResp?.success && finalResp.data?.items) {
        const mapped = mapBackendCartItems(finalResp.data.items);
        // Clear guest cart from both store and localStorage to prevent re-merge on reload
        clearCart();
        // Clear localStorage explicitly
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage');
        }
        setItems(mapped);
      }

    } catch (error) {
      console.error('Failed to merge guest cart:', error);
      toast.error('Không thể gộp giỏ hàng, vui lòng thử lại');
      
      // Fallback: fetch backend cart
      try {
        const resp = await cartAPI.getCurrentCart();
        if (resp?.success && resp.data?.items) {
          const mapped = mapBackendCartItems(resp.data.items);
          clearCart();
          setItems(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch cart after merge error:', e);
      }
    }
  };

  const findItemsArray = (obj: unknown, depth = 0): unknown[] | null => {
    if (!obj || depth > 4) return null;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return obj;
      const first = obj[0];
      if (isCartItemCandidate(first)) return obj;
    }
    if (typeof obj === 'object') {
      for (const k of Object.keys(obj as Record<string, unknown>)) {
        try {
          const v = (obj as Record<string, unknown>)[k];
          const found = findItemsArray(v, depth + 1);
          if (found) return found;
        } catch (_) {
          continue;
        }
      }
    }
    return null;
  };

  const isCartItemCandidate = (x: unknown): boolean => {
    if (!x || typeof x !== 'object') return false;
    const obj = x as Record<string, unknown>;
    return (typeof obj.productId === 'number' || typeof obj.id === 'number') && typeof obj.quantity === 'number';
  };

  return { syncLocalCartToBackend: checkAndMergeCart };
}

// A tiny client component that mounts the `useCartSync` hook.
export function CartSyncClient(): null {
  useCartSync();
  return null;
}
