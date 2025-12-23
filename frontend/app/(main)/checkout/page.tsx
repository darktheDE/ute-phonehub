/**
 * Checkout Page - Thanh toán đơn hàng
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { PaymentMethodSelector } from '@/components/features/payment';
import { orderAPI, userAPI } from '@/lib/api';
import type { PaymentMethod, CreateOrderRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, Package, MapPin, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Shipping info states
  const [email, setEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>('');

  const shippingFee = 30000; // 30k shipping

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await userAPI.getMe();
        const user = response.data;
        setEmail(user.email || '');
        setRecipientName(user.fullName || '');
        setPhoneNumber(user.phone || '');
      } catch (err) {
        console.error('Error loading user profile:', err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserProfile();
  }, []);

  const handlePlaceOrder = async () => {
    // Validation
    setError('');

    if (items.length === 0) {
      setError('Giỏ hàng trống');
      return;
    }

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!recipientName.trim()) {
      setError('Vui lòng nhập tên người nhận');
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderRequest: CreateOrderRequest = {
        email: email.trim(),
        recipientName: recipientName.trim(),
        phoneNumber: phoneNumber.trim(),
        shippingAddress: shippingAddress.trim(),
        shippingFee: shippingFee,
        note: note.trim() || undefined,
        paymentMethod: paymentMethod,
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      // Call API to create order
      const orderResponse = await orderAPI.createOrder(orderRequest);
      const orderData = orderResponse.data;

      // Handle different payment methods
      if (paymentMethod === 'VNPAY' && orderData.paymentUrl) {
        // VNPay: Redirect to payment URL
        clearCart();
        window.location.href = orderData.paymentUrl;
      } else {
        // COD/Bank Transfer: Redirect to order detail
        clearCart();
        router.push(`/orders/${orderData.orderId}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-6">
          Thêm sản phẩm vào giỏ hàng để tiếp tục
        </p>
        <Button onClick={() => router.push('/')}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const finalAmount = totalPrice + shippingFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Thanh toán</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Thông tin giao hàng
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Nguyễn Văn A"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ giao hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  rows={3}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="0901234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  rows={2}
                  placeholder="Ghi chú thêm cho đơn hàng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-xl border border-border p-6">
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="bg-card rounded-xl border border-border p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">
              Đơn hàng ({items.length} sản phẩm)
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SL: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatPrice(finalAmount)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Place Order Button */}
            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đặt hàng'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Bằng cách đặt hàng, bạn đồng ý với{' '}
              <a href="/terms" className="underline hover:text-primary">
                Điều khoản dịch vụ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
