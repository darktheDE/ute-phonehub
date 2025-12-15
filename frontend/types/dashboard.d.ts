/**
 * Dashboard Module Types
 * Module M10.2 - View Dashboard
 * 
 * Định nghĩa các interface cho Dashboard statistics, charts và tables
 */

import type { LucideIcon } from 'lucide-react';

// ==================== OVERVIEW STATS ====================
export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

// Legacy type (keep for backward compatibility)
export interface DashboardOverviewResponse {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

// UI Helper type
export interface DashboardStats {
  label: string;
  value: string;
  change: string;
  colorClass: string;
  icon: LucideIcon;
}

// ==================== REVENUE CHART ====================
export interface RevenueChartData {
  labels: string[];
  values: number[];
  total: number;
  averagePerDay: number;
  period: string;
}

export type DashboardPeriod = 'SEVEN_DAYS' | 'THIRTY_DAYS' | 'THREE_MONTHS';


// ==================== ORDER STATUS CHART ====================
export interface OrderStatusChartData {
  labels: string[];
  values: number[];
  percentages: number[];
  totalOrders: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// ==================== USER REGISTRATION CHART ====================
export interface UserRegistrationChartData {
  labels: string[];
  values: number[];
  total: number;
  period: string;
}

// ✅ Match Backend enum: WEEKLY | MONTHLY
export type RegistrationPeriod = 'SEVEN_DAYS' | 'THIRTY_DAYS' | 'THREE_MONTHS';

// ==================== TOP PRODUCTS ====================
export interface TopProduct {
  productId: number;
  productName: string;
  imagePath: string;
  quantitySold: number;
  totalRevenue: number;
}

// ==================== RECENT ORDERS ====================
export interface RecentOrder {
  orderId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
}

// ==================== LOW STOCK PRODUCTS ====================
export interface LowStockProduct {
  productId: number;
  productName: string;
  imagePath: string;
  stockQuantity: number;
  price: number;
}
