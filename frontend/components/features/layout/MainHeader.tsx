/**
 * MainHeader component - Main navigation header with logo, search, and user actions
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  ShoppingCart,
  Search,
  User,
  Bot,
  Menu,
  Heart,
  X,
} from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { ROUTES } from "@/lib/constants";
import { useCartStore, useWishlistStore } from "@/store";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  user: any | null;
  onLogout: () => void;
}

export function MainHeader({ user, onLogout }: MainHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { totalItems: cartItems } = useCartStore();
  const { totalItems: wishlistItems } = useWishlistStore();
  const router = useRouter();

  const handleSearchSubmit = () => {
    const keyword = searchKeyword.trim();
    if (!keyword) return;

    const params = new URLSearchParams();
    params.set("keyword", keyword);
    router.push(`/products?${params.toString()}`);
    setMobileSearchOpen(false);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            <span className="text-lg sm:text-xl font-bold text-primary-foreground hidden sm:block">
              UTE Phone Hub
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm điện thoại, phụ kiện..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2.5 pl-10 pr-20 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Tìm
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Chatbot - Desktop */}
            <Link
              href="/chatbot"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <Bot className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-medium">AI Chatbot</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-semibold">
                  {wishlistItems > 99 ? '99+' : wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-semibold">
                  {cartItems > 99 ? '99+' : cartItems}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={ROUTES.MANAGE}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium truncate max-w-[100px]">
                    {user.fullName}
                  </span>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onLogout}
                  className="rounded-full"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="secondary" size="sm" className="rounded-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden pt-3 pb-1 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoFocus
                className="w-full px-4 py-2.5 pl-10 pr-16 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                Tìm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        user={user} 
        onLogout={onLogout}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
