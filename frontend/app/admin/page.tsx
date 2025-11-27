'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { getStoredUser, clearAuthTokens } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  sales: number;
}

interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Mock data
  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Total Orders', value: '1,234', change: '+15.3%', icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Users', value: '5,678', change: '+8.2%', icon: Users, color: 'bg-purple-500' },
    { label: 'Conversion Rate', value: '3.24%', change: '+4.3%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const products: Product[] = [
    { id: 1, name: 'iPhone 15 Pro', price: 999, stock: 45, category: 'Smartphones', sales: 234 },
    { id: 2, name: 'Samsung Galaxy S24', price: 899, stock: 32, category: 'Smartphones', sales: 189 },
    { id: 3, name: 'Google Pixel 8', price: 799, stock: 28, category: 'Smartphones', sales: 156 },
    { id: 4, name: 'OnePlus 12', price: 699, stock: 50, category: 'Smartphones', sales: 142 },
    { id: 5, name: 'iPad Pro', price: 1099, stock: 15, category: 'Tablets', sales: 87 },
  ];

  const orders: Order[] = [
    { id: 1001, customer: 'John Doe', total: 1299, status: 'delivered', date: '2024-01-15' },
    { id: 1002, customer: 'Jane Smith', total: 899, status: 'shipped', date: '2024-01-14' },
    { id: 1003, customer: 'Bob Johnson', total: 1599, status: 'processing', date: '2024-01-13' },
    { id: 1004, customer: 'Alice Brown', total: 699, status: 'pending', date: '2024-01-12' },
    { id: 1005, customer: 'Charlie Wilson', total: 2099, status: 'delivered', date: '2024-01-11' },
  ];

  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', joinDate: '2024-01-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', joinDate: '2024-01-02' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Customer', joinDate: '2024-01-03' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Customer', joinDate: '2024-01-04' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', joinDate: '2024-01-05' },
  ];

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = getStoredUser();
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
    } else {
      setCurrentUser(user);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuthTokens();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 fixed h-screen left-0 top-0 z-40 overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: ShoppingCart },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'users', label: 'Users', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Products'}
            {activeTab === 'orders' && 'Orders'}
            {activeTab === 'users' && 'Users'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {currentUser?.fullName?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {stat.label}
                        </h3>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">{stat.change} from last month</p>
                    </div>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Revenue Trend
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">Chart placeholder</p>
                  </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Sales by Category
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Smartphones', value: 65 },
                      { name: 'Tablets', value: 45 },
                      { name: 'Accessories', value: 30 },
                      { name: 'Others', value: 20 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.value}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Recent Orders
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Total
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="py-3 px-4 text-slate-900 dark:text-white">#{order.id}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">{order.customer}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                            ${order.total}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Product Inventory
                </h3>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Stock
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Sales
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">
                            {product.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {product.category}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                            ${product.price}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                product.stock > 30
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : product.stock > 15
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              }`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">
                            {product.sales}
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-red-600 dark:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                All Orders
              </h3>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Total
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">
                            #{order.id}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">
                            {order.customer}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">
                            ${order.total}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {order.date}
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                User Management
              </h3>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Join Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">
                            {user.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {user.email}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === 'Admin'
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {user.joinDate}
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-red-600 dark:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

