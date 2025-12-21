'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCartStore } from '@/store';
import { cartAPI } from '@/lib/api';

export function useCartSync() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { items, addItem, clearCart, setItems } = useCartStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Sync local cart to backend when user logs in
      syncLocalCartToBackend();
    } else if (!isAuthenticated) {
      // Clear cart when user logs out
      clearCart();
    }
  }, [isAuthenticated, user]);

  const isCartItemCandidate = (x: unknown): x is { productId?: number; id?: number; quantity?: number } => {
    if (!x || typeof x !== 'object') return false;
    const obj = x as Record<string, unknown>;
    return (typeof obj.productId === 'number' || typeof obj.id === 'number') && typeof obj.quantity === 'number';
  };

  const findItemsArray = (obj: unknown, depth = 0): unknown[] | null => {
    if (!obj || depth > 4) return null;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return obj;
      const first = obj[0];
      if (isCartItemCandidate(first)) return obj as unknown[];
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

  const syncLocalCartToBackend = async () => {
    try {
      // First, merge guest (local) cart into backend cart in a single request when possible
      // Note: Zustand persist hydrates asynchronously; if `items` is empty here but
      // localStorage contains persisted cart, read it so we don't lose guest items.
      let guestItemsSource: unknown[] = Array.isArray(items) ? items : [];

      const findItemsArray = (obj: any, depth = 0): any[] | null => {
        if (!obj || depth > 4) return null;
        if (Array.isArray(obj)) {
          if (obj.length === 0) return obj;
          const first = obj[0];
          if (first && (first.productId !== undefined || first.id !== undefined)) return obj as any[];
        }
        if (typeof obj === 'object') {
          for (const k of Object.keys(obj)) {
            try {
              const v = obj[k];
              const found = findItemsArray(v, depth + 1);
              if (found) return found;
            } catch (_) {
              continue;
            }
          }
        }
        return null;
      };

      if ((!guestItemsSource || guestItemsSource.length === 0) && typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('cart-storage');
          if (raw) {
            let parsed: unknown = null;
            try {
              parsed = JSON.parse(raw);
            } catch (e) {
              console.warn('useCartSync: failed to JSON.parse cart-storage raw value', e, raw);
            }

            if (parsed) {
              const persistedItems = findItemsArray(parsed) ?? null;
              if (Array.isArray(persistedItems) && persistedItems.length > 0) {
                console.debug('useCartSync: using persisted cart-storage items for merge', persistedItems);
                guestItemsSource = persistedItems;
              } else {
                console.debug('useCartSync: no suitable items array found in persisted cart-storage', parsed);
              }
            }
          } else {
            console.debug('useCartSync: no cart-storage key in localStorage');
          }
        } catch (e) {
          console.warn('useCartSync: failed to read persisted cart-storage', e);
        }
      }

      console.debug('useCartSync: guestItemsSource length=', guestItemsSource?.length ?? 0);

      if (guestItemsSource && guestItemsSource.length > 0) {
        const guestCartItems = guestItemsSource.map((it: unknown) => {
          const obj = (it && typeof it === 'object') ? it as Record<string, unknown> : {};
          const qty = Number(obj.quantity ?? 0) || 0;
          // Backend enforces a per-product limit (10). Clamp to avoid predictable validation errors.
          const clampedQty = Math.max(0, Math.min(10, qty));
          return { productId: Number(obj.productId ?? 0), quantity: clampedQty };
        });
        try {
          // Check backend cart first. If backend already has items, avoid merging guest items
          // automatically to prevent surprising quantity updates on page load.
          let backendHasItems = false;
          try {
            const currentResp = await cartAPI.getCurrentCart();
            if (currentResp && currentResp.success && currentResp.data) {
              const backendItems = Array.isArray(currentResp.data.items) ? currentResp.data.items : [];
              backendHasItems = backendItems.length > 0;
            }
          } catch (fetchErr) {
            console.warn('useCartSync: failed to fetch backend cart before merge, proceeding with merge', fetchErr);
          }

          if (backendHasItems) {
            console.debug('useCartSync: backend cart not empty; skipping guest merge to avoid auto-updates');
          } else {
            const mergeResp = await cartAPI.mergeGuestCart({ guestCartItems });
            console.debug('useCartSync: mergeGuestCart response', mergeResp);
          }
        } catch (e: any) {
          const msg = (e && (e.message || String(e))) || '';
          // If merge fails due to per-product limits, inform the user and attempt best-effort adds with clamped quantities
          if (msg.includes('Maximum') || msg.includes('10 items')) {
            try {
              // Try per-item add using clamped quantities
              for (const it of guestCartItems) {
                try {
                  await cartAPI.addToCart({ productId: it.productId, quantity: it.quantity });
                } catch (errAdd: any) {
                  // If add fails due to limit, skip and continue
                  const addMsg = (errAdd && (errAdd.message || String(errAdd))) || '';
                  if (addMsg.includes('Maximum') || addMsg.includes('10 items')) {
                    // Skip silently for that item
                    console.warn('useCartSync: skipping item due to per-product limit', it.productId, it.quantity);
                    continue;
                  }
                  console.warn('useCartSync: failed to add item during fallback sync', it.productId, errAdd);
                }
              }
            } catch (outerAddErr) {
              console.warn('useCartSync: fallback per-item add failed', outerAddErr);
            }
          } else if (msg.includes('Row was updated') || msg.includes('updated or deleted') || msg.includes('stale')) {
            // Concurrency/stale entity error: re-fetch cart state from backend to sync
            try {
              const resp = await cartAPI.getCurrentCart();
              if (resp && resp.success && resp.data) {
                const backendItems = Array.isArray(resp.data.items) ? resp.data.items : [];
            const mappedItems = backendItems.map((item: unknown) => {
                  const obj = (item && typeof item === 'object') ? item as Record<string, unknown> : {};
                  const productObj = (typeof obj.product === 'object' && obj.product) ? obj.product as Record<string, unknown> : {};
                  const rawPrice = typeof obj.price === 'number' ? obj.price : (typeof obj.unitPrice === 'number' ? obj.unitPrice : (typeof productObj.salePrice === 'number' ? productObj.salePrice : (typeof productObj.price === 'number' ? productObj.price : 0)));
                  const productOriginal = typeof productObj.originalPrice === 'number' ? productObj.originalPrice : (typeof productObj.price === 'number' ? productObj.price : 0);

                  // Determine discount percent: prefer explicit fields from backend
                  let discountPercent: number | undefined = undefined;
                  if (typeof obj.discountPercent === 'number') discountPercent = obj.discountPercent as number;
                  else if (typeof obj.discount === 'number') discountPercent = obj.discount as number;
                  else if (typeof productObj.discountPercent === 'number') discountPercent = productObj.discountPercent as number;

                  // If no explicit discount percent but we have original vs raw price, infer percent
                  if (discountPercent === undefined && productOriginal > 0 && rawPrice < productOriginal) {
                    discountPercent = Math.round((1 - rawPrice / productOriginal) * 100);
                  }

                  // Compute appliedPrice: if explicit discountPercent provided, apply it to a sensible base price
                  let appliedPrice = rawPrice;
                  if (typeof discountPercent === 'number' && discountPercent > 0) {
                    const baseForDiscount = typeof productObj.price === 'number' && productObj.price > 0 ? Number(productObj.price) : rawPrice;
                    appliedPrice = Math.round(baseForDiscount * (100 - discountPercent) / 100);
                  }

                  return {
                    id: Number(obj.id ?? 0),
                    productId: Number(obj.productId ?? 0),
                    productName: typeof obj.productName === 'string' ? obj.productName : (typeof productObj.name === 'string' ? String(productObj.name) : 'Unknown Product'),
                    productImage: typeof obj.productImage === 'string' ? obj.productImage : (typeof obj.productThumbnailUrl === 'string' ? obj.productThumbnailUrl : (typeof productObj.thumbnailUrl === 'string' ? String(productObj.thumbnailUrl) : '')),
                    price: rawPrice,
                    discountPercent: discountPercent,
                    appliedPrice: appliedPrice,
                    quantity: Number(obj.quantity ?? 0),
                    color: typeof obj.color === 'string' ? obj.color : undefined,
                    storage: typeof obj.storage === 'string' ? obj.storage : undefined,
                  };
                });

                clearCart();
                if (mappedItems.length > 0) setItems(mappedItems as any);
              }
            } catch (refetchErr) {
              console.warn('useCartSync: failed to refetch cart after concurrency error', refetchErr);
            }
          } else {
            console.warn('useCartSync: mergeGuestCart failed, falling back to per-item add', e);
            for (const item of guestItemsSource) {
              try {
                const obj = (item && typeof item === 'object') ? item as Record<string, unknown> : {};
                const qty = Math.max(0, Math.min(10, Number(obj.quantity ?? 0) || 0));
                const addResp = await cartAPI.addToCart({
                  productId: Number(obj.productId ?? 0),
                  quantity: qty,
                  color: typeof obj.color === 'string' ? obj.color : undefined,
                  storage: typeof obj.storage === 'string' ? obj.storage : undefined,
                });
                console.debug('useCartSync: addToCart fallback response for', obj.productId, addResp);
              } catch (err) {
                console.warn('Failed to add guest item during fallback sync:', (item as Record<string, unknown>).productId, err);
              }
            }
          }
        }
      }

      // Always fetch current cart from backend to ensure we have latest data
      const response = await cartAPI.getCurrentCart();
      if (response.success && response.data) {
        // Map backend cart items and set to local store preserving backend ids
        const backendItems = Array.isArray(response.data.items) ? response.data.items : [];
        const mappedItems = backendItems.map((item: unknown) => {
          const obj = (item && typeof item === 'object') ? item as Record<string, unknown> : {};
          const productObj = (typeof obj.product === 'object' && obj.product) ? obj.product as Record<string, unknown> : {};
          const rawPrice = typeof obj.price === 'number' ? obj.price : (typeof obj.unitPrice === 'number' ? obj.unitPrice : (typeof productObj.salePrice === 'number' ? productObj.salePrice : (typeof productObj.price === 'number' ? productObj.price : 0)));
          const productOriginal = typeof productObj.originalPrice === 'number' ? productObj.originalPrice : (typeof productObj.price === 'number' ? productObj.price : 0);

          let discountPercent: number | undefined = undefined;
          if (typeof obj.discountPercent === 'number') discountPercent = obj.discountPercent as number;
          else if (typeof obj.discount === 'number') discountPercent = obj.discount as number;
          else if (typeof productObj.discountPercent === 'number') discountPercent = productObj.discountPercent as number;

          if (discountPercent === undefined && productOriginal > 0 && rawPrice < productOriginal) {
            discountPercent = Math.round((1 - rawPrice / productOriginal) * 100);
          }

          let appliedPrice = rawPrice;
          if (typeof discountPercent === 'number' && discountPercent > 0) {
            const baseForDiscount = typeof productObj.price === 'number' && productObj.price > 0 ? Number(productObj.price) : rawPrice;
            appliedPrice = Math.round(baseForDiscount * (100 - discountPercent) / 100);
          }

          return {
            id: Number(obj.id ?? 0),
            productId: Number(obj.productId ?? 0),
            productName: typeof obj.productName === 'string' ? obj.productName : (typeof productObj.name === 'string' ? String(productObj.name) : 'Unknown Product'),
            productImage: typeof obj.productImage === 'string' ? obj.productImage : (typeof obj.productThumbnailUrl === 'string' ? obj.productThumbnailUrl : (typeof productObj.thumbnailUrl === 'string' ? String(productObj.thumbnailUrl) : '')),
            price: rawPrice,
            discountPercent: discountPercent,
            appliedPrice: appliedPrice,
            quantity: Number(obj.quantity ?? 0),
            color: typeof obj.color === 'string' ? obj.color : undefined,
            storage: typeof obj.storage === 'string' ? obj.storage : undefined,
          };
        });

        // Replace local cart with backend data
        clearCart();
        if (mappedItems.length > 0) setItems(mappedItems as any);
      }
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
    }
  };

  return { syncLocalCartToBackend };
}

// A tiny client component that mounts the `useCartSync` hook.
// This allows other code to dynamically import and render the component
// instead of attempting to call the hook as a regular function.
export function CartSyncClient(): null {
  useCartSync();
  return null;
}