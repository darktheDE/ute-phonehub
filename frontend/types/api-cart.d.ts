/**
 * Types for Cart API responses
 */
export interface CartItemResponse {
  id: number;
  productId: number;
  productName?: string;
  productImage?: string;
  price?: number;
  quantity: number;
  color?: string;
  storage?: string;
  [key: string]: any;
}

export interface CartResponseData {
  items: CartItemResponse[];
  totalItems?: number;
  totalPrice?: number;
  [key: string]: any;
}

/**
 * Types for Promotion API
 */
export interface Promotion {
  id?: string | number;
  code?: string;
  templateCode?: string;
  title?: string;
  name?: string;
  template?: any;
  [key: string]: any;
}
