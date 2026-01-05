'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbotAssistant } from '@/hooks/useChatbotAssistant';
import { ChatbotAssistantUserRequest } from '@/types/chatbot-assistant.d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';
import { Slider } from '@/components/ui/slider';

interface ChatbotAssistantProps {
  className?: string;
}

/**
 * Component Chatbot Tư Vấn Sản Phẩm
 * Gợi ý sản phẩm phù hợp dựa trên câu hỏi của khách hàng
 */
export const ChatbotAssistant: React.FC<ChatbotAssistantProps> = ({
  className,
}) => {
  const { messages, loading, error, sendMessage, clearChat } =
    useChatbotAssistant();
  const [input, setInput] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { categories } = useCategories({ parentId: null });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChatRequest = async (message: string) => {
    if (!message.trim() || loading) return;

    const request: ChatbotAssistantUserRequest = {
      message: message.trim(),
      categoryId,
      minPrice,
      maxPrice,
    };

    try {
      await sendMessage(request);
      setInput('');
    } catch (err) {
      console.error('❌ Lỗi gửi message:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendChatRequest(input);
  };

  const handleQuickPrompt = async (prompt: string) => {
    await sendChatRequest(prompt);
  };

  return (
    <div
      className={cn('flex flex-col h-full bg-card rounded-lg border', className)}
    >
      {/* Header */}
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base md:text-lg">
            Cửa sổ trò chuyện
          </CardTitle>

          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="hidden sm:inline-flex"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa lịch sử
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/40">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <p className="text-sm font-medium mb-2">
                Chào bạn 👋 – hãy mô tả nhu cầu của bạn để bắt đầu.
              </p>
              <p className="text-xs">
                Ví dụ: “Điện thoại chụp hình đẹp tầm 10 triệu”, “Máy mỏng nhẹ pin trâu”...
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleQuickPrompt('Cho tôi xem sản phẩm nổi bật')}
                  disabled={loading}
                >
                  “Cho tôi xem sản phẩm nổi bật”
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() =>
                    handleQuickPrompt('Cho tôi xem các sản phẩm bán chạy tầm 8-12 triệu')
                  }
                  disabled={loading}
                >
                  “Sản phẩm bán chạy tầm 8-12 triệu”
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleQuickPrompt('Điện thoại mới ra mắt gần đây')}
                  disabled={loading}
                >
                  “Điện thoại mới ra mắt gần đây”
                </Button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  🤖
                </div>
              )}

              <div
                className={cn(
                  'max-w-md p-3 rounded-lg text-sm',
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-background border rounded-bl-none'
                )}
              >
                <p className="mb-2 whitespace-pre-line">{message.content}</p>

                {/* Hiển thị sản phẩm gợi ý */}
                {message.response?.recommendedProducts &&
                  message.response.recommendedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-border pt-2">
                      <p className="text-xs font-semibold text-muted-foreground">
                        📦 Sản phẩm gợi ý ({message.response.recommendedProducts.length}):
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {message.response.recommendedProducts.map((product, index) => (
                          <a
                            key={product.id ? `${product.id}-${index}` : `product-${index}`}
                            href={product.productUrl || `/products/${product.id}`}
                            className="block p-3 rounded-md bg-muted/40 border hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
                          >
                            <div className="flex gap-3">
                              {/* Product Image */}
                              {product.imageUrl && (
                                <div className="flex-shrink-0 w-16 h-16 rounded bg-background border flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={60}
                                    height={60}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                {/* Product Name with Discount Badge */}
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                                    {product.name}
                                  </div>
                                  {product.hasDiscount && product.discountPercent && (
                                    <span className="flex-shrink-0 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                                      -{product.discountPercent}%
                                    </span>
                                  )}
                                </div>
                                
                                {/* Technical Specs */}
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {product.ram && (
                                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                      RAM {product.ram}
                                    </span>
                                  )}
                                  {product.storage && (
                                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                      {product.storage}
                                    </span>
                                  )}
                                  {product.batteryCapacity && (
                                    <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                      🔋 {product.batteryCapacity}mAh
                                    </span>
                                  )}
                                  {product.operatingSystem && (
                                    <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                      {product.operatingSystem}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Price and Rating */}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="font-semibold text-primary">
                                    {(product.price / 1000000).toFixed(1)}M₫
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      {(product.originalPrice / 1000000).toFixed(1)}M₫
                                    </span>
                                  )}
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                    ⭐ {product.rating?.toFixed(1) || 'N/A'} ({product.reviewCount || 0})
                                  </span>
                                </div>
                                
                                {/* Match Score */}
                                {product.matchScore && (
                                  <div className="mt-1.5">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span className="text-muted-foreground">Độ phù hợp:</span>
                                      <span className="font-semibold text-emerald-600">
                                        {(product.matchScore * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-1.5">
                                      <div
                                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${product.matchScore * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Action Button */}
                              <div className="flex-shrink-0 flex items-center justify-center">
                                <div className="text-blue-600 group-hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                  →
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Hiển thị metadata */}
                {message.response && (
                  <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>🎯 {message.response.detectedIntent}</span>
                    <span>⏱️ {message.response.processingTimeMs}ms</span>
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs">
                  👤
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/30 text-destructive text-xs">
          ❌ {error}
        </div>
      )}

      {/* Input & filter */}
      <div className="border-t bg-background rounded-b-lg">
        <CardContent className="space-y-3 pt-3 pb-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">Khoảng giá (VND)</span>
                <span className="text-[11px] text-muted-foreground">
                  {minPrice?.toLocaleString('vi-VN') || 0} -{' '}
                  {maxPrice?.toLocaleString('vi-VN') || 50_000_000}
                </span>
              </div>
              <Slider
                min={0}
                max={50_000_000}
                step={500_000}
                value={[minPrice ?? 0, maxPrice ?? 50_000_000]}
                onValueChange={([min, max]) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-muted-foreground">
                Danh mục (tùy chọn)
              </label>
              <select
                className="h-8 w-full rounded-md border bg-background px-2 text-xs"
                value={categoryId ?? ''}
                onChange={(e) =>
                  setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)
                }
                disabled={loading}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Mô tả nhu cầu của bạn... (ví dụ: điện thoại chụp hình đẹp tầm 10 triệu)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 text-sm"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground text-center">
            💡 Chatbot ưu tiên gợi ý từ dữ liệu sản phẩm thật trong hệ thống, sau đó dùng AI
            để giải thích và so sánh.
          </p>
        </CardContent>
      </div>
    </div>
  );
};
