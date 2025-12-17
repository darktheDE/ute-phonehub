/**
 * MainHeader component - Main navigation header with logo, search, and user actions
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Smartphone,
  ShoppingCart,
  Search,
  User,
  Heart,
  Menu,
} from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { ROUTES } from '@/lib/constants';

interface MainHeaderProps {
  user: any | null;
  onLogout: () => void;
}

export function MainHeader({ user, onLogout }: MainHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0">
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

            <Link
              href="#"
              className="hidden sm:flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Yêu thích</span>
            </Link>

            <Link
              href="/checkout"
              className="flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Giỏ hàng</span>
              <span className="absolute -top-1 -right-1 lg:-top-1 lg:right-8 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.MANAGE}
                  className="flex items-center gap-1 text-primary-foreground hover:opacity-80 transition-opacity"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm truncate max-w-[100px]">
                    {user.fullName}
                  </span>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onLogout}
                  className="hidden sm:inline-flex"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="secondary" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER} className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
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
        <MobileMenu
          isOpen={mobileMenuOpen}
          user={user}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
