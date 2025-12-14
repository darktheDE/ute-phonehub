/**
 * Dashboard types matching backend DTOs
 */

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface DashboardOverviewResponse {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

import type { LucideIcon } from 'lucide-react';

export interface DashboardStats {
  label: string;
  value: string;
  change: string;
  colorClass: string;
  icon: LucideIcon;
}

