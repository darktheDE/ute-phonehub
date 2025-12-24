/**
 * Order Detail Page - Chi tiết đơn hàng
 */

'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="font-semibold">#{id}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Đang xử lý
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phương thức thanh toán</span>
              <span className="font-medium">Thanh toán khi nhận hàng</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Bước tiếp theo</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Kiểm tra email để xác nhận đơn hàng</li>
            <li>• Chúng tôi sẽ liên hệ trong vòng 24h</li>
            <li>• Theo dõi đơn hàng trong tài khoản của bạn</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={() => router.push('/')} 
            variant="outline"
            className="flex-1"
          >
            Tiếp tục mua sắm
          </Button>
          <Button 
            onClick={() => router.push('/account/payments')} 
            className="flex-1"
          >
            Xem đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
