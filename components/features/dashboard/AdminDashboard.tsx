/**
 * AdminDashboard component - Dashboard for admin users
 */

'use client';

import { DollarSign, ShoppingCart, Users, Package, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from './StatsCard';
import { OrdersTable } from './OrdersTable';
import { MOCK_STATS, MOCK_ORDERS } from '@/lib/mockData';

export function AdminDashboard() {
  const stats = [
    { ...MOCK_STATS[0], icon: DollarSign },
    { ...MOCK_STATS[1], icon: ShoppingCart },
    { ...MOCK_STATS[2], icon: Users },
    { ...MOCK_STATS[3], icon: Package },
  ];

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
        <OrdersTable orders={MOCK_ORDERS.slice(0, 5)} isAdmin={true} />
      </div>
    </div>
  );
}
