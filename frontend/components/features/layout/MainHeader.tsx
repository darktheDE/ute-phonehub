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
    <header className="sticky top-0 z-50 border-b border-border bg-primary shadow-md">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex flex-shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
          >
            <Smartphone className="w-8 h-8 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground hidden sm:block">
              UTE Phone Hub
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden max-w-2xl flex-1 md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Bạn cần tìm gì?"
                className="w-full rounded-lg border-none bg-white px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm outline-none ring-0 focus:ring-2 focus:ring-ring"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 text-primary-foreground md:hidden"
              aria-label="Tìm kiếm"
            >
              <Search className="w-6 h-6" />
            </button>

            <Link
              href="#"
              className="hidden items-center gap-1 text-primary-foreground transition-colors hover:text-primary-foreground/80 sm:flex"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Yêu thích</span>
            </Link>

            <Link
              href="#"
              className="relative flex items-center gap-1 text-primary-foreground transition-colors hover:text-primary-foreground/80"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Giỏ hàng</span>
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white lg:-top-1 lg:right-8">
                0
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.MANAGE}
                  className="flex items-center gap-1 text-primary-foreground transition-colors hover:text-primary-foreground/80"
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
              className="p-2 text-primary-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mở menu"
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
