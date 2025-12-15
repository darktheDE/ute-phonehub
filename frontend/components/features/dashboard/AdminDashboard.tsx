/**
 * AdminDashboard component - Dashboard for admin users
 * Uses real API for endpoints that exist: /admin/dashboard/overview and /admin/dashboard/recent-orders
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from './StatsCard';
import { RevenueChart } from './RevenueChart';
import { OrdersTable } from './OrdersTable';
import { useDashboard, useOrders } from '@/hooks';
import { dashboardAPI } from '@/lib/api';
import { RevenueChartData, DashboardPeriod } from '@/types';

export function AdminDashboard() {
  // Using real API - these endpoints exist:
  // GET /api/v1/admin/dashboard/overview
  // GET /api/v1/admin/dashboard/recent-orders
  // GET /api/v1/dashboard/revenue-chart
  const { stats, loading: statsLoading } = useDashboard();
  const { orders, loading: ordersLoading } = useOrders(true);
  
  // Revenue Chart State
  const [revenueData, setRevenueData] = useState<RevenueChartData | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);

  // Fetch revenue chart data
  const fetchRevenueData = async (period: DashboardPeriod = 'THIRTY_DAYS') => {
    try {
      setRevenueLoading(true);
      
      console.log('🔄 [AdminDashboard] Fetching revenue chart for period:', period);
      
      const response = await dashboardAPI.getRevenueChart(period);
      
      console.log('📦 [AdminDashboard] Full API Response:', {
        success: response.success,
        status: response.status,
        message: response.message,
        timestamp: response.timestamp,
        data: response.data
      });
      
      if (response.success && response.data) {
        console.log('✅ [AdminDashboard] Revenue data loaded successfully');
        setRevenueData(response.data);
      } else {
        throw new Error(response.message || 'Invalid response');
      }
    } catch (error) {
      console.error('❌ [AdminDashboard] Error fetching revenue chart:', error);
    } finally {
      setRevenueLoading(false);
    }
  };

  // Fetch initial revenue data
  useEffect(() => {
    fetchRevenueData();
  }, []);

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse h-24" />
          ))}
        </div>
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 animate-pulse h-96" />
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Revenue Chart */}
      {revenueLoading ? (
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 animate-pulse h-96" />
      ) : revenueData ? (
        <RevenueChart 
          data={revenueData} 
          onPeriodChange={fetchRevenueData}
        />
      ) : null}

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Đơn hàng gần đây</h3>
          <Button variant="ghost" size="sm" className="gap-1">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {ordersLoading ? (
          <div className="animate-pulse h-64" />
        ) : (
          <OrdersTable orders={orders.slice(0, 5)} isAdmin={true} />
        )}
      </div>
    </div>
  );
}
