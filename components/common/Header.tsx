/**
 * Refactored Header component - Now uses modular sub-components
 */

'use client';

import { useAuth } from '@/hooks';
import { TopBar, MainHeader } from '@/components/features/layout';

// Re-export TopBar for use in index.ts
export { TopBar };

export function Header() {
  const { user, logout } = useAuth();

  return (
    <>
      <TopBar />
      <MainHeader user={user} onLogout={logout} />
    </>
  );
}
