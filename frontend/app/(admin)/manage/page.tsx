/**
 * ManagePage - Dashboard page for admin and customer users.
 *
 * This file is intentionally a Server Component wrapper.
 * Client hooks like `useSearchParams()` must be used in a Client Component
 * that is rendered within a Suspense boundary.
 */

import { Suspense } from 'react';
import ManagePageClient from './ManagePageClient';

export default function ManagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-secondary flex items-center justify-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      }
    >
      <ManagePageClient />
    </Suspense>
  );
}
