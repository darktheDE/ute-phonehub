/**
 * ForgotPasswordPage - Password recovery page
 * Refactored to use ForgotPasswordForm component
 */

import Link from 'next/link';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Smartphone className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold text-white">UTE Phone Hub</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <ForgotPasswordForm />
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

