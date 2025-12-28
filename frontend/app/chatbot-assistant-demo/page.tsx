'use client';

import { ChatbotAssistant } from '@/components/common/ChatbotAssistant';

/**
 * Demo page cho Chatbot Tư Vấn Sản Phẩm
 * Route: /chatbot-assistant-demo
 */
export default function ChatbotAssistantDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          🤖 Chatbot Tư Vấn Sản Phẩm
        </h1>
        <p className="text-center text-slate-600 mb-6">
          Hỏi chatbot về sản phẩm điện thoại phù hợp với nhu cầu của bạn
        </p>

        <ChatbotAssistant className="h-[600px]" />

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-600">
            <h3 className="font-bold text-slate-900 mb-2">⭐ Sản phẩm nổi bật</h3>
            <p className="text-sm text-slate-600">
              Hỏi &quot;sản phẩm nổi bật&quot; để xem danh sách gợi ý hàng đầu
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-600">
            <h3 className="font-bold text-slate-900 mb-2">🔥 Bán chạy</h3>
            <p className="text-sm text-slate-600">
              Hỏi &quot;sản phẩm bán chạy&quot; để xem những chiếc điện thoại
              bán chạy nhất
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-600">
            <h3 className="font-bold text-slate-900 mb-2">🆕 Mới nhất</h3>
            <p className="text-sm text-slate-600">
              Hỏi &quot;sản phẩm mới&quot; để xem những mẫu máy vừa ra mắt
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-slate-900 mb-4">✨ Tính năng</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✅ Phân loại intent tự động (nổi bật, bán chạy, mới, tìm kiếm)</li>
            <li>✅ Tối ưu chi phí: API trực tiếp trước, embedding sau</li>
            <li>✅ Cache sản phẩm: giảm 80% số lần gọi API</li>
            <li>✅ Embedding similarity: hiểu ý khách hàng một cách tự nhiên</li>
            <li>✅ Phản hồi AI từ Gemini: lời tư vấn cá nhân hóa</li>
            <li>✅ Lọc theo giá, danh mục: tìm sản phẩm chính xác</li>
          </ul>
        </div>

        {/* API Info */}
        <div className="mt-8 bg-slate-900 text-white p-6 rounded-lg shadow text-sm font-mono">
          <h2 className="text-lg font-bold mb-4">📡 API Endpoint</h2>
          <div className="bg-slate-800 p-3 rounded">
            <p>POST /api/v1/chatbot-assistant/chat</p>
          </div>
          <h3 className="text-lg font-bold mt-4 mb-2">📦 Request Body</h3>
          <pre className="bg-slate-800 p-3 rounded overflow-x-auto">
{`{
  "message": "Tôi muốn điện thoại máy ảnh tốt",
  "minPrice": 5000000,
  "maxPrice": 20000000,
  "categoryId": 1
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
