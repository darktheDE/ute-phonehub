'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbotAssistant } from '@/hooks/useChatbotAssistant';
import { ChatbotAssistantUserRequest } from '@/types/chatbot-assistant.d';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Trash2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const request: ChatbotAssistantUserRequest = {
      message: input.trim(),
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

  return (
    <div
      className={cn(
        'flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg',
        className
      )}
    >
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <CardTitle className="text-xl">🤖 Tư Vấn Sản Phẩm AI</CardTitle>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-white hover:bg-white/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa chat
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-slate-500">
            <div>
              <p className="text-lg font-medium mb-2">
                👋 Chào mừng đến với chatbot tư vấn sản phẩm!
              </p>
              <p className="text-sm">
                Hỏi tôi về sản phẩm nổi bật, bán chạy, mới nhất hoặc tìm kiếm
                sản phẩm phù hợp
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">
                  💬 &quot;Cho tôi xem sản phẩm nổi bật&quot;
                </Badge>
                <Badge variant="outline">
                  🔥 &quot;Sản phẩm bán chạy là gì?&quot;
                </Badge>
                <Badge variant="outline">
                  🆕 &quot;Sản phẩm mới nhất&quot;
                </Badge>
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  🤖
                </div>
              )}

              <div
                className={cn(
                  'max-w-md p-3 rounded-lg',
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 rounded-bl-none'
                )}
              >
                <p className="text-sm mb-2">{message.content}</p>

                {/* Hiển thị sản phẩm gợi ý */}
                {message.response?.recommendedProducts &&
                  message.response.recommendedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-200 pt-2">
                      <p className="text-xs font-semibold text-slate-600">
                        📦 Sản phẩm gợi ý ({message.response.recommendedProducts.length}):
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {message.response.recommendedProducts.map((product, index) => (
                          <a
                            key={product.id ? `${product.id}-${index}` : `product-${index}`}
                            href={product.productUrl || `/products/${product.id}`}
                            className="block p-3 rounded-md bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="flex gap-3">
                              {/* Product Image */}
                              {product.imageUrl && (
                                <div className="flex-shrink-0 w-16 h-16 rounded bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
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
                                <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                                  {product.name}
                                </div>
                                <div className="text-xs text-slate-600 line-clamp-1 mt-1">
                                  {product.description}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="font-bold text-blue-600">
                                    {(product.price / 1000000).toFixed(1)}M₫
                                  </span>
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                    ⭐ {product.rating?.toFixed(1) || 'N/A'} ({product.reviewCount || 0})
                                  </span>
                                </div>
                                {product.matchScore && (
                                  <div className="mt-1.5">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span className="text-slate-600">Độ phù hợp:</span>
                                      <span className="font-semibold text-green-600">
                                        {(product.matchScore * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                                      <div
                                        className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all"
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
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                    <span>🎯 {message.response.detectedIntent}</span>
                    <span>⏱️ {message.response.processingTimeMs}ms</span>
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-sm">
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
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 space-y-3 bg-white rounded-b-lg">
        {/* Filters */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block mb-1 text-slate-600 font-medium">
              Giá min
            </label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice || ''}
              onChange={(e) =>
                setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={loading}
              className="h-8"
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-600 font-medium">
              Giá max
            </label>
            <Input
              type="number"
              placeholder="50000000"
              value={maxPrice || ''}
              onChange={(e) =>
                setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={loading}
              className="h-8"
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-600 font-medium">
              Danh mục ID
            </label>
            <Input
              type="number"
              placeholder="Tùy chọn"
              value={categoryId || ''}
              onChange={(e) =>
                setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={loading}
              className="h-8"
            />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Hỏi về sản phẩm... (ví dụ: điện thoại máy ảnh tốt)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          💡 Chatbot có thể hiểu: &quot;sản phẩm nổi bật&quot;, &quot;bán
          chạy&quot;, &quot;mới nhất&quot;, hoặc tìm kiếm tự do
        </p>
      </div>
    </div>
  );
};
