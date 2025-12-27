import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, CreditCard } from 'lucide-react';
import { VoucherSelector } from './VoucherSelector';
import { useState } from 'react';
import type { Promotion } from '@/types/api-cart';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout: () => void;
  compact?: boolean;
  selectedIds?: number[];
  onBuySelected?: () => void;
  selectedVoucher?: Promotion | null;
  voucherDiscount?: number;
  onVoucherChange?: (voucher: Promotion | null, discount: number) => void;
}

export function CartSummary({ 
  totalItems, 
  totalPrice, 
  onCheckout, 
  compact, 
  selectedIds = [], 
  onBuySelected,
  selectedVoucher: externalVoucher,
  voucherDiscount: externalDiscount = 0,
  onVoucherChange
}: CartSummaryProps) {
  const [internalVoucher, setInternalVoucher] = useState<Promotion | null>(null);
  const [internalDiscount, setInternalDiscount] = useState(0);

  // Use external voucher if controlled, otherwise use internal state
  const selectedVoucher = externalVoucher !== undefined ? externalVoucher : internalVoucher;
  const voucherDiscount = externalDiscount !== undefined ? externalDiscount : internalDiscount;

  const handleVoucherChange = (voucher: Promotion | null, discount: number) => {
    if (onVoucherChange) {
      onVoucherChange(voucher, discount);
    } else {
      setInternalVoucher(voucher);
      setInternalDiscount(discount);
    }
  };

  const subtotal = totalPrice;
  const finalTotal = Math.max(0, subtotal - voucherDiscount);
  const mainButtonLabel = (selectedIds && selectedIds.length > 0 && onBuySelected)
    ? `Mua ngay (${selectedIds.length})`
    : 'Mua ngay';
  const mainButtonOnClick = (selectedIds && selectedIds.length > 0 && onBuySelected)
    ? onBuySelected
    : onCheckout;
  const mainButtonDisabled = (selectedIds && selectedIds.length > 0)
    ? !onBuySelected
    : totalItems === 0;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Tóm tắt đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng sản phẩm ({totalItems})</span>
            <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
          </div>

          {/* Voucher Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mã giảm giá</label>
            <VoucherSelector
              orderTotal={subtotal}
              onApplyVoucher={handleVoucherChange}
              currentVoucher={selectedVoucher}
              disabled={totalItems === 0}
            />
          </div>

          {voucherDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-sm">Giảm giá</span>
              <span className="font-semibold">-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Tổng cộng</span>
            <span className="text-xl font-bold text-primary">{finalTotal.toLocaleString('vi-VN')}₫</span>
          </div>

          <Button
            onClick={mainButtonOnClick}
            disabled={mainButtonDisabled}
            className="w-full"
            size="lg"
          >
            {mainButtonLabel}
          </Button>

          {totalItems > 0 && (
            <p className="text-xs text-center text-muted-foreground">
            </p>
          )}
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Bảo hành chính hãng</div>
                <div className="text-xs text-gray-600">Bảo hành 12 tháng tại các trung tâm bảo hành ủy quyền</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm">Hàng chính hãng 100%</div>
                <div className="text-xs text-gray-600">Cam kết sản phẩm chính hãng, hoàn tiền nếu phát hiện hàng giả</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm">Đổi trả linh hoạt</div>
                <div className="text-xs text-gray-600">Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm">Giao hàng nhanh chóng</div>
                <div className="text-xs text-gray-600">Giao hàng nội thành trong 2h, miễn phí với đơn hàng từ 500K</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm">Thanh toán an toàn</div>
                <div className="text-xs text-gray-600">Hỗ trợ nhiều phương thức thanh toán, bảo mật thông tin</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}