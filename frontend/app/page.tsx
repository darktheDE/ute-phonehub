'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Headphones,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Search,
  User,
  Heart,
  Menu
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

// Mock data for products
const featuredPhones = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    image: '📱',
    originalPrice: 34990000,
    salePrice: 32990000,
    rating: 4.9,
    reviews: 256,
    discount: 6,
    isNew: true,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    image: '📱',
    originalPrice: 33990000,
    salePrice: 29990000,
    rating: 4.8,
    reviews: 189,
    discount: 12,
    isNew: true,
  },
  {
    id: 3,
    name: 'OPPO Find X7 Ultra',
    image: '📱',
    originalPrice: 24990000,
    salePrice: 22990000,
    rating: 4.7,
    reviews: 124,
    discount: 8,
    isNew: false,
  },
  {
    id: 4,
    name: 'Xiaomi 14 Pro',
    image: '📱',
    originalPrice: 19990000,
    salePrice: 17990000,
    rating: 4.6,
    reviews: 98,
    discount: 10,
    isNew: false,
  },
];

const hotDeals = [
  {
    id: 5,
    name: 'iPhone 14',
    image: '📱',
    originalPrice: 22990000,
    salePrice: 17990000,
    rating: 4.8,
    reviews: 512,
    discount: 22,
  },
  {
    id: 6,
    name: 'Samsung Galaxy A54',
    image: '📱',
    originalPrice: 10990000,
    salePrice: 8490000,
    rating: 4.5,
    reviews: 324,
    discount: 23,
  },
  {
    id: 7,
    name: 'Realme GT Neo 5',
    image: '📱',
    originalPrice: 12990000,
    salePrice: 9990000,
    rating: 4.4,
    reviews: 156,
    discount: 23,
  },
  {
    id: 8,
    name: 'vivo V29e',
    image: '📱',
    originalPrice: 9990000,
    salePrice: 7990000,
    rating: 4.3,
    reviews: 87,
    discount: 20,
  },
];

const categories = [
  { name: 'iPhone', icon: '🍎', count: 24 },
  { name: 'Samsung', icon: '📱', count: 36 },
  { name: 'OPPO', icon: '📲', count: 18 },
  { name: 'Xiaomi', icon: '🔲', count: 22 },
  { name: 'vivo', icon: '📳', count: 15 },
  { name: 'Realme', icon: '⚡', count: 12 },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
};

export default function HomePage() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Hotline: 1800.1234
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Hệ thống 100+ cửa hàng
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3" />
              8:00 - 22:00
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-primary sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Smartphone className="w-8 h-8 text-primary-foreground" />
              <span className="text-xl font-bold text-primary-foreground hidden sm:block">
                UTE Phone Hub
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Bạn cần tìm gì?"
                  className="w-full px-4 py-2.5 pl-10 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="md:hidden p-2 text-primary-foreground">
                <Search className="w-6 h-6" />
              </button>
              
              <Link href="#" className="hidden sm:flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity">
                <Heart className="w-5 h-5" />
                <span className="hidden lg:inline text-sm">Yêu thích</span>
              </Link>

              <Link href="#" className="flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden lg:inline text-sm">Giỏ hàng</span>
                <span className="absolute -top-1 -right-1 lg:-top-1 lg:right-8 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/manage" className="flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm truncate max-w-[100px]">{user.fullName}</span>
                  </Link>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={logout}
                    className="hidden sm:inline-flex"
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="secondary" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button variant="outline" size="sm" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}

              <button 
                className="md:hidden p-2 text-primary-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-3 border-t border-primary-foreground/20 pt-3">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Bạn cần tìm gì?"
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name} 
                    href="#"
                    className="px-3 py-1.5 bg-primary-foreground/10 rounded-full text-primary-foreground text-sm hover:bg-primary-foreground/20"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Nav */}
        <div className="bg-[#1a1a1a] hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-1 py-2 overflow-x-auto">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href="#"
                  className="flex items-center gap-1.5 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap text-sm"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
              <Link
                href="#"
                className="flex items-center gap-1 px-4 py-2 text-primary hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap text-sm font-medium"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium mb-4">
                🔥 HOT DEAL
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                iPhone 15 Pro Max
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                Titan. Siêu nhẹ. Siêu bền. Giảm đến 2 triệu khi thu cũ đổi mới.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(32990000)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(34990000)}
                </span>
              </div>
              <div className="flex gap-3">
                <Button size="lg" className="gap-2">
                  Mua ngay
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1a1a1a]">
                  Xem chi tiết
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                <span className="text-[120px] md:text-[150px]">📱</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: 'Giao hàng miễn phí', sub: 'Đơn từ 500K' },
              { icon: Shield, text: 'Bảo hành chính hãng', sub: '12 tháng' },
              { icon: Headphones, text: 'Hỗ trợ 24/7', sub: 'Hotline 1800.1234' },
              { icon: ShoppingCart, text: 'Đổi trả dễ dàng', sub: 'Trong 30 ngày' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3">
                <feature.icon className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">{feature.text}</p>
                  <p className="text-xs text-muted-foreground">{feature.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl font-bold text-white">⚡ FLASH SALE</span>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-mono">02:45:30</span>
              </div>
            </div>
            <Link href="#" className="text-white hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {hotDeals.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative">
                  <div className="h-36 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform">
                    {product.image}
                  </div>
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm md:text-base">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base md:text-lg font-bold text-red-600">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              📱 Điện thoại nổi bật
            </h2>
            <Link href="#" className="text-primary hover:underline flex items-center gap-1 text-sm">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {featuredPhones.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative">
                  <div className="h-40 md:h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl md:text-7xl group-hover:scale-105 transition-transform">
                    {product.image}
                  </div>
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Mới
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                  <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-medium text-foreground mb-2 line-clamp-2 min-h-[2.5rem] text-sm md:text-base">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base md:text-xl font-bold text-primary">
                      {formatPrice(product.salePrice)}
                    </span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-xs md:text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            🏷️ Danh mục sản phẩm
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="#"
                className="bg-card rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-shadow border border-border group"
              >
                <div className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-medium text-foreground text-sm md:text-base">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Đăng ký nhận tin khuyến mãi
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Nhận ngay voucher 100.000đ cho đơn hàng đầu tiên và cập nhật những ưu đãi mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg">
              Đăng ký ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-gray-300 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Về UTE Phone Hub</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary">Giới thiệu</Link></li>
                <li><Link href="#" className="hover:text-primary">Tuyển dụng</Link></li>
                <li><Link href="#" className="hover:text-primary">Hệ thống cửa hàng</Link></li>
                <li><Link href="#" className="hover:text-primary">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Hỗ trợ khách hàng</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary">Hướng dẫn mua hàng</Link></li>
                <li><Link href="#" className="hover:text-primary">Chính sách đổi trả</Link></li>
                <li><Link href="#" className="hover:text-primary">Chính sách bảo hành</Link></li>
                <li><Link href="#" className="hover:text-primary">Giao hàng & Thanh toán</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  1800.1234 (Miễn phí)
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  support@utephonehub.com
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  01 Võ Văn Ngân, Thủ Đức, TP.HCM
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Kết nối với chúng tôi</h4>
              <div className="flex gap-3 mb-4">
                <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="text-lg">📷</span>
                </Link>
                <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="text-lg">▶️</span>
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                Tải app UTE Phone Hub
              </p>
              <div className="flex gap-2 mt-2">
                <div className="bg-white/10 px-3 py-2 rounded text-xs">App Store</div>
                <div className="bg-white/10 px-3 py-2 rounded text-xs">Google Play</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            <p>© 2024 UTE Phone Hub. All rights reserved. | GPKD: 0123456789 do Sở KH&ĐT TP.HCM cấp ngày 01/01/2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
