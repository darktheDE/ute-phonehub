/**
 * Central export for all TypeScript types
 * Import types like: import { User, LoginRequest } from '@/types'
 */

// API types
export type { ApiResponse, ApiError } from "./api";

// User types
export type {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UsersPageResponse,
  CreateUserRequest,
  UserFilters,
} from "./user";

// Auth types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  RefreshTokenRequest,
} from "./auth";

// Cart types
export type { CartItem, CartState } from "./cart";

// Wishlist types
export type { WishlistItem, WishlistState } from "./wishlist";

// Product types
export type { Product, ProductResponse, TopProductResponse } from "./product";

// Order types
export type {
  Order,
  OrderResponse,
  OrderStatus,
  OrderItem,
  OrderItemRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentMethod,
  RecentOrderResponse,
} from "./order";

// Dashboard types
export type {
  DashboardOverview,
  DashboardOverviewResponse,
  DashboardStats,
} from "./dashboard";

// Promotion types
export type {
  PromotionResponse,
  PromotionTarget,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  AvailablePromotionParams,
  CalculateDiscountParams,
} from "./promotion";
export type {
  PromotionTemplateResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "./template";
