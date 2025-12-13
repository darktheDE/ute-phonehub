/**
 * AdminDashboard component - Dashboard for admin users
 * Uses real API for endpoints that exist: /admin/dashboard/overview and /admin/dashboard/recent-orders
 */

'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from './StatsCard';
import { OrdersTable } from './OrdersTable';
import { useDashboard, useOrders } from '@/hooks';

export function AdminDashboard() {
  // Using real API - these endpoints exist:
  // GET /api/v1/admin/dashboard/overview
  // GET /api/v1/admin/dashboard/recent-orders
  const { stats, loading: statsLoading } = useDashboard();
  const { orders, loading: ordersLoading } = useOrders(true);

  if (statsLoading || ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse h-24" />
          ))}
        </div>
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Đơn hàng gần đây</h3>
          <Button variant="ghost" size="sm" className="gap-1">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <OrdersTable orders={orders.slice(0, 5)} isAdmin={true} />
      </div>
    </div>
  );
}
