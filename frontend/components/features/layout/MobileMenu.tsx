/**
 * MobileMenu component - Mobile navigation menu
 */

'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  user: any | null;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, user, onLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-3 pb-3 border-t border-primary-foreground/20 pt-3">
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Bạn cần tìm gì?"
          className="w-full px-4 py-2 pl-10 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      </div>
      {user && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onLogout}
          className="w-full"
        >
          Đăng xuất
        </Button>
      )}
    </div>
  );
}
