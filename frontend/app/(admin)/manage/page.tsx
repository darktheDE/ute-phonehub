/**
 * ManagePage - Dashboard page for admin and customer users
 * Refactored to use modular dashboard components
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  Menu,
  User,
  Heart,
  MapPin,
  Bell,
  FolderTree,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  AdminDashboard,
  CustomerProfile,
  CustomerAddresses,
  CustomerWishlist,
  OrdersTable,
  ProductsTable,
  UsersTable,
  CategoryManagement,
  BrandManagement,
} from '@/components/features/dashboard';
import { Sidebar } from '@/components/features/layout/Sidebar';
import { useOrders, useUsers } from '@/hooks';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '@/lib/mockData';

type TabType = 'dashboard' | 'orders' | 'products' | 'categories' | 'brands' | 'users' | 'profile' | 'addresses' | 'wishlist';

export default function ManagePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  
  // Using real API for endpoints that exist:
  // - GET /api/v1/admin/dashboard/recent-orders (for admin)
  // - GET /api/v1/admin/users
  // Using mock data for endpoints that don't exist:
  // - GET /api/v1/admin/products (doesn't exist)
  // - GET /api/v1/orders (for customer list - doesn't exist)
  const { orders, loading: ordersLoading } = useOrders(isAdmin);
  // Only fetch users if user is admin to avoid unnecessary API calls
  const { users, loading: usersLoading } = useUsers(
    isAdmin ? { page: 0, size: 100 } : null
  );

  // Admin menu items
  const adminMenuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'orders' as TabType, label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'products' as TabType, label: 'Sản phẩm', icon: Package },
    { id: 'categories' as TabType, label: 'Danh mục', icon: FolderTree },
    { id: 'brands' as TabType, label: 'Thương hiệu', icon: Tag },
    { id: 'users' as TabType, label: 'Người dùng', icon: Users },
  ];

  // Customer menu items
  const customerMenuItems = [
    { id: 'profile' as TabType, label: 'Thông tin cá nhân', icon: User },
    { id: 'orders' as TabType, label: 'Đơn hàng của tôi', icon: ShoppingCart },
    { id: 'addresses' as TabType, label: 'Địa chỉ', icon: MapPin },
    { id: 'wishlist' as TabType, label: 'Yêu thích', icon: Heart },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login');
    }
    // Set default tab based on role
    if (user) {
      setActiveTab(isAdmin ? 'dashboard' : 'profile');
    }
  }, [user, isLoading, router, isAdmin]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        user={user}
        isAdmin={isAdmin}
        menuItems={menuItems}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-secondary rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-foreground">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'products' && 'Quản lý sản phẩm'}
              {activeTab === 'orders' && (isAdmin ? 'Quản lý đơn hàng' : 'Đơn hàng của tôi')}
              {activeTab === 'users' && 'Quản lý người dùng'}
              {activeTab === 'profile' && 'Thông tin cá nhân'}
              {activeTab === 'addresses' && 'Địa chỉ của tôi'}
              {activeTab === 'wishlist' && 'Sản phẩm yêu thích'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-secondary rounded-lg relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Xin chào,</span>
              <span className="font-medium text-foreground">{user.fullName}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Admin Dashboard */}
          {activeTab === 'dashboard' && isAdmin && <AdminDashboard />}

          {/* Products Management (Admin Only) */}
          {/* Using mock data - GET /api/v1/admin/products doesn't exist */}
          {activeTab === 'products' && isAdmin && (
            <ProductsTable products={MOCK_PRODUCTS} />
          )}

          {/* Categories Management (Admin Only) */}
          {activeTab === 'categories' && isAdmin && <CategoryManagement />}

          {/* Brands Management (Admin Only) */}
          {activeTab === 'brands' && isAdmin && <BrandManagement />}

          {/* Orders */}
          {activeTab === 'orders' && (
            isAdmin ? (
              // Admin: Use real API - GET /api/v1/admin/dashboard/recent-orders exists
              ordersLoading ? (
                <div className="bg-card rounded-xl border border-border p-6 animate-pulse h-64" />
              ) : (
                <OrdersTable 
                  orders={orders} 
                  isAdmin={isAdmin} 
                />
              )
            ) : (
              // Customer: Use mock data - GET /api/v1/orders (list) doesn't exist
              // Need to transform MOCK_ORDERS to Order type from @/types
              <OrdersTable 
                orders={MOCK_ORDERS.map(mockOrder => {
                  // Map mock status to OrderStatus from @/types
                  const statusMap: Record<string, 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'> = {
                    'pending': 'PENDING',
                    'processing': 'CONFIRMED',
                    'shipped': 'SHIPPING',
                    'delivered': 'DELIVERED',
                    'cancelled': 'CANCELLED',
                  };
                  
                  return {
                    id: mockOrder.id,
                    orderCode: `ORD-${mockOrder.id}`,
                    email: '',
                    recipientName: mockOrder.customer,
                    phoneNumber: '',
                    shippingAddress: '',
                    status: statusMap[mockOrder.status] || 'PENDING',
                    paymentMethod: '',
                    totalAmount: mockOrder.total,
                    createdAt: new Date(mockOrder.date).toISOString(),
                    updatedAt: new Date(mockOrder.date).toISOString(),
                  };
                })} 
                isAdmin={isAdmin} 
              />
            )
          )}

          {/* Users Management (Admin Only) */}
          {/* Using real API - GET /api/v1/admin/users exists */}
          {activeTab === 'users' && isAdmin && (
            usersLoading ? (
              <div className="bg-card rounded-xl border border-border p-6 animate-pulse h-64" />
            ) : (
              <UsersTable 
                users={users.map(u => ({
                  id: u.id,
                  name: u.name,
                  email: u.email,
                  role: u.role,
                  status: (u.status === 'LOCKED' ? 'BANNED' : u.status) as 'ACTIVE' | 'INACTIVE' | 'BANNED',
                  joinDate: u.joinDate,
                }))} 
              />
            )
          )}

          {/* Customer Profile */}
          {activeTab === 'profile' && !isAdmin && <CustomerProfile user={user} />}

          {/* Customer Addresses */}
          {activeTab === 'addresses' && !isAdmin && <CustomerAddresses />}

          {/* Customer Wishlist */}
          {activeTab === 'wishlist' && !isAdmin && <CustomerWishlist />}
        </div>
      </div>
    </div>
  );
}
