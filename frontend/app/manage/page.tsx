'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Home,
  User,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  Bell,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

// Interfaces for mock data
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  sales: number;
  image: string;
}

interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  joinDate: string;
}

type TabType = 'dashboard' | 'orders' | 'products' | 'users' | 'profile' | 'addresses' | 'wishlist';

// Mock data
const stats = [
  { label: 'Doanh thu', value: '1.234.567.890₫', change: '+20.1%', icon: DollarSign, color: 'bg-green-500' },
  { label: 'Đơn hàng', value: '1,234', change: '+15.3%', icon: ShoppingCart, color: 'bg-blue-500' },
  { label: 'Người dùng', value: '5,678', change: '+8.2%', icon: Users, color: 'bg-purple-500' },
  { label: 'Sản phẩm', value: '256', change: '+4.3%', icon: Package, color: 'bg-orange-500' },
];

const mockProducts: Product[] = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 32990000, stock: 45, category: 'Smartphone', sales: 234, image: '📱' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 29990000, stock: 32, category: 'Smartphone', sales: 189, image: '📱' },
  { id: 3, name: 'OPPO Find X7 Ultra', price: 22990000, stock: 28, category: 'Smartphone', sales: 156, image: '📱' },
  { id: 4, name: 'Xiaomi 14 Pro', price: 17990000, stock: 50, category: 'Smartphone', sales: 142, image: '📱' },
  { id: 5, name: 'Google Pixel 8 Pro', price: 24990000, stock: 15, category: 'Smartphone', sales: 87, image: '📱' },
];

const mockOrders: Order[] = [
  { id: 1001, customer: 'Nguyễn Văn A', total: 32990000, status: 'delivered', date: '2024-01-15', items: 1 },
  { id: 1002, customer: 'Trần Thị B', total: 29990000, status: 'shipped', date: '2024-01-14', items: 1 },
  { id: 1003, customer: 'Lê Văn C', total: 52980000, status: 'processing', date: '2024-01-13', items: 2 },
  { id: 1004, customer: 'Phạm Thị D', total: 17990000, status: 'pending', date: '2024-01-12', items: 1 },
  { id: 1005, customer: 'Hoàng Văn E', total: 62980000, status: 'delivered', date: '2024-01-11', items: 2 },
];

const mockUsers: UserData[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'CUSTOMER', status: 'ACTIVE', joinDate: '2024-01-01' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'CUSTOMER', status: 'ACTIVE', joinDate: '2024-01-02' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'CUSTOMER', status: 'INACTIVE', joinDate: '2024-01-03' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'CUSTOMER', status: 'ACTIVE', joinDate: '2024-01-04' },
  { id: 5, name: 'Admin User', email: 'admin@utephonehub.com', role: 'ADMIN', status: 'ACTIVE', joinDate: '2024-01-05' },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
};

const getStatusConfig = (status: Order['status']) => {
  const configs = {
    delivered: { label: 'Đã giao', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    shipped: { label: 'Đang giao', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    processing: { label: 'Đang xử lý', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    pending: { label: 'Chờ xác nhận', class: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  };
  return configs[status];
};

const getUserStatusConfig = (status: UserData['status']) => {
  const configs = {
    ACTIVE: { label: 'Hoạt động', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    INACTIVE: { label: 'Không hoạt động', class: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    BANNED: { label: 'Bị khóa', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  };
  return configs[status];
};

export default function ManagePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  // Admin menu items
  const adminMenuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'orders' as TabType, label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'products' as TabType, label: 'Sản phẩm', icon: Package },
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
      <div
        className={cn(
          "fixed h-screen bg-sidebar text-sidebar-foreground z-50 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "left-0" : "-left-64 lg:left-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Smartphone className="w-8 h-8 text-sidebar-primary flex-shrink-0" />
            {sidebarOpen && <span className="text-lg font-bold">UTE Phone Hub</span>}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-sidebar-accent rounded-lg hidden lg:block"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 hover:bg-sidebar-accent rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-sidebar-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                isAdmin ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
              )}>
                {isAdmin ? '👑 Admin' : '👤 Khách hàng'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border flex-shrink-0 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Trang chủ</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

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
          {activeTab === 'dashboard' && isAdmin && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-card rounded-xl border border-border p-4 md:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </h3>
                        <div className={cn(stat.color, "p-2 md:p-3 rounded-lg")}>
                          <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs md:text-sm text-green-600">{stat.change} so với tháng trước</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Đơn hàng gần đây</h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Xem tất cả <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Mã đơn</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Khách hàng</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tổng tiền</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.slice(0, 5).map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                          <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                            <td className="py-3 px-4 font-medium">#{order.id}</td>
                            <td className="py-3 px-4 hidden sm:table-cell">{order.customer}</td>
                            <td className="py-3 px-4 font-semibold">{formatPrice(order.total)}</td>
                            <td className="py-3 px-4">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", statusConfig.class)}>
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Management (Admin Only) */}
          {activeTab === 'products' && isAdmin && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">Danh sách sản phẩm</h3>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm sản phẩm
                </Button>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Sản phẩm</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Danh mục</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Giá</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Kho</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">Đã bán</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-secondary/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{product.image}</span>
                              <span className="font-medium line-clamp-1">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{product.category}</td>
                          <td className="py-3 px-4 font-semibold text-primary">{formatPrice(product.price)}</td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-semibold",
                              product.stock > 30 ? "bg-green-100 text-green-700" :
                              product.stock > 15 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">{product.sales}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <button className="p-2 hover:bg-secondary rounded-lg text-blue-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-secondary rounded-lg text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {isAdmin ? 'Tất cả đơn hàng' : 'Đơn hàng của bạn'}
              </h3>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Mã đơn</th>
                        {isAdmin && <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Khách hàng</th>}
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tổng tiền</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Ngày đặt</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                          <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                            <td className="py-3 px-4 font-medium">#{order.id}</td>
                            {isAdmin && <td className="py-3 px-4 hidden sm:table-cell">{order.customer}</td>}
                            <td className="py-3 px-4 font-semibold">{formatPrice(order.total)}</td>
                            <td className="py-3 px-4">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", statusConfig.class)}>
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{order.date}</td>
                            <td className="py-3 px-4">
                              <button className="p-2 hover:bg-secondary rounded-lg text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Management (Admin Only) */}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Quản lý người dùng</h3>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Tên</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden sm:table-cell">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Vai trò</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden md:table-cell">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground hidden lg:table-cell">Ngày tham gia</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((userData) => {
                        const statusConfig = getUserStatusConfig(userData.status);
                        return (
                          <tr key={userData.id} className="border-b border-border hover:bg-secondary/50">
                            <td className="py-3 px-4 font-medium">{userData.name}</td>
                            <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{userData.email}</td>
                            <td className="py-3 px-4">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-semibold",
                                userData.role === 'ADMIN' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                              )}>
                                {userData.role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
                              </span>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", statusConfig.class)}>
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{userData.joinDate}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <button className="p-2 hover:bg-secondary rounded-lg text-blue-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-secondary rounded-lg text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customer Profile */}
          {activeTab === 'profile' && !isAdmin && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Thông tin cá nhân</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{user.fullName}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Tên đăng nhập</label>
                        <p className="text-foreground">{user.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Số điện thoại</label>
                        <p className="text-foreground">{user.phoneNumber || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Vai trò</label>
                        <p className="text-foreground">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Trạng thái</label>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {user.status === 'ACTIVE' ? 'Hoạt động' : user.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button>
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Addresses */}
          {activeTab === 'addresses' && !isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Địa chỉ của bạn</h3>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm địa chỉ
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">Nguyễn Văn A</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-primary text-primary-foreground">Mặc định</span>
                      </div>
                      <p className="text-muted-foreground text-sm">0912345678</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        01 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, TP. Hồ Chí Minh
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Wishlist */}
          {activeTab === 'wishlist' && !isAdmin && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Sản phẩm yêu thích</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden group">
                    <div className="relative">
                      <div className="h-32 md:h-40 bg-secondary flex items-center justify-center text-4xl">
                        {product.image}
                      </div>
                      <button className="absolute top-2 right-2 p-2 bg-card rounded-full shadow-md">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-2">{product.name}</h4>
                      <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                      <Button size="sm" className="w-full mt-2">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Thêm giỏ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
