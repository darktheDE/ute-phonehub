/**
 * Central export for all TypeScript types
 * Import types like: import { User, LoginRequest } from '@/types'
 */

// API types
export type { ApiResponse, ApiError } from './api';

// User types
export type { User, UpdateProfileRequest, ChangePasswordRequest } from './user';

// Auth types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  RefreshTokenRequest,
} from './auth';

// Cart types
export type { CartItem, CartState } from './cart';

// Wishlist types
export type { WishlistItem, WishlistState } from './wishlist';

// Product types
export type { Product, ProductResponse, TopProductResponse } from './product';

// Order types
export type { Order, OrderResponse, OrderStatus, OrderItem, RecentOrderResponse } from './order';

// Payment types
export type {
  PaymentMethod,
  PaymentStatus,
  PaymentResponse,
  VNPayPaymentResponse,
  CreatePaymentRequest,
  PaymentHistoryResponse,
  VNPayCallbackParams,
  PaymentMethodOption,
} from './payment';

// Dashboard types
export type { 
  DashboardOverview,
  DashboardOverviewResponse,
  DashboardStats,
  RevenueChartData,
  OrderStatusChartData,
  UserRegistrationChartData,
  TopProduct,
  RecentOrder,
  LowStockProduct,
  DashboardPeriod,
  RegistrationPeriod
} from './dashboard';

// Dashboard Enums
export { OrderStatus as DashboardOrderStatus } from './dashboard';