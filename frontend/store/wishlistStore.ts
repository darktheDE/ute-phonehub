import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem, WishlistState } from '@/types';

/**
 * Wishlist Store using Zustand
 * Persists wishlist data to localStorage
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      /**
       * Add item to wishlist
       */
      addItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((i) => i.productId === item.productId);

        if (!exists) {
          const newId = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.id)) + 1 : 1;
          const newItems = [...currentItems, { ...item, id: newId }];
          
          set({
            items: newItems,
            totalItems: newItems.length,
          });
        }
      },

      /**
       * Remove item from wishlist by id
       */
      removeItem: (id) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({
          items: newItems,
          totalItems: newItems.length,
        });
      },

      /**
       * Clear all items from wishlist
       */
      clearWishlist: () => {
        set({
          items: [],
          totalItems: 0,
        });
      },

      /**
       * Check if product is in wishlist
       */
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      /**
       * Toggle item in wishlist (add if not exists, remove if exists)
       */
      toggleItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.productId === item.productId);

        if (existingItem) {
          // Remove if exists
          get().removeItem(existingItem.id);
        } else {
          // Add if not exists
          get().addItem(item);
        }
      },
    }),
    {
      name: 'wishlist-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
