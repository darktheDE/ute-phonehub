/**
 * Order types matching backend DTOs
 */

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderCode: string;
  userId?: number;
  email: string;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  shippingFee?: number;
  shippingUnit?: string;
  note?: string;
  status: OrderStatus;
  paymentMethod: string;
  totalAmount: number;
  promotionId?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  // Frontend computed fields
  customer?: string;
  total?: number;
  date?: string;
  itemCount?: number;
}

export interface OrderResponse {
  id: number;
  orderCode: string;
  userId?: number;
  email: string;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  shippingFee?: number;
  shippingUnit?: string;
  note?: string;
  status: OrderStatus;
  paymentMethod: string;
  totalAmount: number;
  promotionId?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface RecentOrderResponse {
  orderId: number;
  orderCode: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

/**
 * Create Order Request & Response types
 */
export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  email: string;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  shippingFee?: number;
  shippingUnit?: string;
  note?: string;
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPAY';
  promotionId?: number;
  items: OrderItemRequest[];
}

export interface CreateOrderResponse {
  orderId: number;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPAY';
  totalAmount: number;
  createdAt: string;
  message?: string;
  paymentUrl?: string; // For VNPay payment
}
