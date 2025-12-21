import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartState } from '@/types';

/**
 * Cart Store using Zustand
 * Persists cart data to localStorage
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      /**
       * Add item to cart or update quantity if exists
       */
      addItem: (item) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (i) => i.productId === item.productId && i.color === item.color && i.storage === item.storage
        );

        let newItems: CartItem[];

        if (existingItemIndex !== -1) {
          // Item exists, update quantity
          newItems = currentItems.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          // New item, add to cart
          const newId = currentItems.length > 0 ? Math.max(...currentItems.map(i => i.id)) + 1 : 1;
          // Preserve any discount/appliedPrice fields when adding
          newItems = [...currentItems, { ...item, id: newId }];
        }

        set({
          items: newItems,
          totalItems: newItems.reduce((sum, it) => sum + it.quantity, 0),
          // Use appliedPrice when available, otherwise fallback to price
          totalPrice: newItems.reduce((sum, it) => sum + (('appliedPrice' in it ? (it as any).appliedPrice : it.price) as number) * it.quantity, 0),
        });
      },

      /**
       * Remove item from cart by id
       */
      removeItem: (id) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({
          items: newItems,
          totalItems: newItems.reduce((sum, it) => sum + it.quantity, 0),
          totalPrice: newItems.reduce((sum, it) => sum + (('appliedPrice' in it ? (it as any).appliedPrice : it.price) as number) * it.quantity, 0),
        });
      },

      /**
       * Update quantity of specific item
       */
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const newItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );

        set({
          items: newItems,
          totalItems: newItems.reduce((sum, it) => sum + it.quantity, 0),
          totalPrice: newItems.reduce((sum, it) => sum + (('appliedPrice' in it ? (it as any).appliedPrice : it.price) as number) * it.quantity, 0),
        });
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      /**
       * Replace the entire items array (used to sync with backend)
       */
      setItems: (items) => {
        set({
          items,
          totalItems: items.reduce((sum, it) => sum + it.quantity, 0),
          totalPrice: items.reduce((sum, it) => sum + (('appliedPrice' in it ? (it as any).appliedPrice : it.price) as number) * it.quantity, 0),
        });
      },

      /**
       * Remove multiple items by id
       */
      removeItems: (ids) => {
        const newItems = get().items.filter((item) => !ids.includes(item.id));
        set({
          items: newItems,
          totalItems: newItems.reduce((sum, it) => sum + it.quantity, 0),
          totalPrice: newItems.reduce((sum, it) => sum + (('appliedPrice' in it ? (it as any).appliedPrice : it.price) as number) * it.quantity, 0),
        });
      },

      /**
       * Get item by id
       */
      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
