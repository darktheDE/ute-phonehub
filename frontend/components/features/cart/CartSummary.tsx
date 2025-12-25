import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Truck, Shield, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { promotionAPI } from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Promotion } from '@/types/api-cart';
import initPromotions from '@/lib/initPromotions';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout: () => void;
  compact?: boolean;
  selectedIds?: number[];
  onBuySelected?: () => void;
}

export function CartSummary({ totalItems, totalPrice, onCheckout, compact, selectedIds = [], onBuySelected }: CartSummaryProps) {
  const shippingFee = totalPrice >= 500000 ? 0 : 30000; // Free shipping over 500k VND
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<null | { id: string; code: string; title?: string }>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    try {
      return String(err);
    } catch {
      return 'Lỗi không xác định';
    }
  };

  const subtotal = totalPrice;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingFee;
  const mainButtonLabel = (selectedIds && selectedIds.length > 0 && onBuySelected)
    ? `Mua ngay (${selectedIds.length})`
    : 'Mua ngay';
  const mainButtonOnClick = (selectedIds && selectedIds.length > 0 && onBuySelected)
    ? onBuySelected
    : onCheckout;
  const mainButtonDisabled = (selectedIds && selectedIds.length > 0)
    ? !onBuySelected
    : totalItems === 0;

  const handleApply = async (fromVoucher = false, overrideCode?: string) => {
    if (applied) return;

    const trimmed = (overrideCode ?? code ?? '').trim();

    if (!trimmed) {
      if (!fromVoucher) toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setIsApplying(true);
    try {
      const resp = await promotionAPI.getAvailablePromotions(subtotal);
      if (!resp || !resp.success) throw new Error('Không lấy được khuyến mãi');
      const promos: Promotion[] = resp.data || [];

      // Log promos shape to help debug mismatched field names from backend
      console.debug('Available promotions response shape:', promos);

      const key = trimmed.toLowerCase();
      const found = promos.find((p) => {
        const candidates: unknown[] = [p.templateCode, p.code, p.id, p.title, p.name, p.template];
        return candidates.some((c: unknown) => (typeof c === 'string' || typeof c === 'number') && String(c).toLowerCase() === key);
      });

      if (!found) {
        toast.error('Mã không hợp lệ hoặc không áp dụng cho đơn hàng này');
        return;
      }

      // Try calculateDiscount with `id` first (preferred), fallback to `code` if server accepts codes as identifiers
      const promotionIdCandidate = found.id ? String(found.id) : (found.code || found.templateCode || '');
      let calcResp = null as (Awaited<ReturnType<typeof promotionAPI.calculateDiscount>> | null);
      try {
        calcResp = await promotionAPI.calculateDiscount(promotionIdCandidate, subtotal);
      } catch (err) {
        // If initial attempt failed and we have a `code` field different from id, try it as a fallback
        if (found.code && String(found.code) !== promotionIdCandidate) {
          try {
            calcResp = await promotionAPI.calculateDiscount(String(found.code), subtotal);
          } catch (err2) {
            throw err2;
          }
        } else {
          throw err;
        }
      }

      if (!calcResp || !calcResp.success) throw new Error('Không thể tính tiền giảm');
      const amount = Number(calcResp.data || 0);
      setDiscountAmount(amount);
      setApplied({ id: String(found.id ?? found.code ?? found.templateCode ?? ''), code: trimmed, title: found.title });
      toast.success(`Áp dụng mã ${trimmed} - Giảm ${amount.toLocaleString('vi-VN')}₫`);
    } catch (e: unknown) {
      console.error('Apply promotion error:', e);
      const msg = getErrorMessage(e);
      toast.error(msg || 'Lỗi khi áp dụng mã giảm giá');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCode = () => {
    setApplied(null);
    setDiscountAmount(0);
    setCode('');
    toast.success('Đã hủy mã giảm giá');
  };

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

          {/* Discount code input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Có {initPromotions.filter((p: any) => p.status === 'ACTIVE').length} voucher</div>
              <Button variant="ghost" size="sm" onClick={() => setShowPromoModal(true)}>Xem voucher</Button>
            </div>
            
            {applied ? (
              <div className="flex items-center justify-between gap-3 p-3 bg-yellow-50 rounded-md">
                <div>
                  <div className="text-sm font-medium">Mã đã áp dụng</div>
                  <div className="text-sm text-gray-700">{applied.code} {applied.title ? `— ${applied.title}` : ''}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-red-600 font-semibold">-{discountAmount.toLocaleString('vi-VN')}₫</div>
                  <button className="text-xs underline mt-1" onClick={handleRemoveCode}>Gỡ</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => handleApply(false)} disabled={isApplying}>
                  {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
                </Button>
              </div>
            )}
          </div>

          {/* Promotions modal (simple) */}
          {showPromoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowPromoModal(false)} />
              <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Voucher có sẵn</h3>
                  <button className="text-sm text-gray-600" onClick={() => setShowPromoModal(false)}>Đóng</button>
                </div>
                <div className="space-y-2 max-h-72 overflow-auto">
                  {initPromotions.filter((p: any) => p.status === 'ACTIVE').map((p: any) => (
                    <div key={String(p.id)} className="p-3 rounded-md bg-gray-50 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-sm text-gray-600">{p.description}</div>
                        <div className="text-xs text-gray-500">Điều kiện: từ {(p.min_value_to_be_applied ?? 0).toLocaleString('vi-VN')}₫</div>
                      </div>
                      <div className="flex flex-col items-end">
                        {p.percent_discount ? (
                          <div className="font-bold text-red-600">-{p.percent_discount}%</div>
                        ) : p.fixed_amount ? (
                          <div className="font-bold text-red-600">-{p.fixed_amount.toLocaleString('vi-VN')}₫</div>
                        ) : (
                          <div className="text-sm text-gray-600">Xem</div>
                        )}
                        <div className="mt-2">
                          <Button size="sm" onClick={async () => {
                            if (applied) return;
                            const voucherCode = String(p.id ?? p.code ?? '');
                            setCode(voucherCode);
                            setShowPromoModal(false);
                            handleApply(true, voucherCode); 
                          }}>Áp dụng</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phí vận chuyển</span>
            <div className="text-right">
              {shippingFee === 0 ? (
                <div>
                  <Badge variant="secondary" className="text-xs mb-1">Miễn phí</Badge>
                  <div className="text-sm text-gray-500 line-through">30,000₫</div>
                </div>
              ) : (
                <span className="font-medium">{shippingFee.toLocaleString('vi-VN')}₫</span>
              )}
            </div>
          </div>

          {totalPrice < 500000 && (
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">
              Mua thêm {(500000 - totalPrice).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-primary">{finalTotal.toLocaleString('vi-VN')}₫</span>
          </div>

          <Button
            className="w-full h-12 text-lg font-semibold"
            size="lg"
            onClick={mainButtonOnClick}
            disabled={mainButtonDisabled}
          >
            {mainButtonLabel}
          </Button>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <Truck className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-medium text-green-800">Giao hàng tận nơi</div>
            <div className="text-sm text-green-600">Miễn phí giao hàng cho đơn ≥ 500k</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-800">Bảo hành chính hãng</div>
            <div className="text-sm text-blue-600">Bảo hành lên đến 24 tháng</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <div>
            <div className="font-medium text-purple-800">Thanh toán linh hoạt</div>
            <div className="text-sm text-purple-600">COD, chuyển khoản, thẻ tín dụng</div>
          </div>
        </div>
      </div>
    </div>
  );
}