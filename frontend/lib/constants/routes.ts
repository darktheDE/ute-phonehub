/**
 * Application route constants
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // User routes
  MANAGE: '/manage',
  PROFILE: '/manage?tab=profile',
  ORDERS: '/manage?tab=orders',
  ADDRESSES: '/manage?tab=addresses',
  WISHLIST: '/manage?tab=wishlist',
  CART: '/cart',
  
  // Admin routes
  ADMIN_DASHBOARD: '/manage?tab=dashboard',
  ADMIN_PRODUCTS: '/manage?tab=products',
  ADMIN_ORDERS: '/manage?tab=orders',
  ADMIN_USERS: '/manage?tab=users',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
