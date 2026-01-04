# ⚡ Quick Start - Chatbot Tư Vấn Sản Phẩm

## 🎯 5 Phút Để Chạy

### Step 1: Lấy Gemini API Key
```
1. Vào https://ai.google.dev/
2. Click "Get API Key" → "Create API Key"
3. Copy key
```

### Step 2: Cấu Hình Backend

**File:** `backend/src/main/resources/application.yaml`

Thêm vào:
```yaml
gemini:
  api:
    key: your_api_key_here
    url: https://generativelanguage.googleapis.com/v1beta/models
  model: gemini-2.0-flash
  embedding:
    model: text-embedding-004

api:
  product:
    base-url: http://localhost:8081/api/v1/products
```

Hoặc tạo `.env` file:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
API_PRODUCT_BASE_URL=http://localhost:8081/api/v1/products
```

### Step 3: Chạy Backend

```bash
cd backend
docker-compose down
docker-compose up -d --build

# Chờ logs: "Started UtePhonehubBackendApplication"
# Kiểm tra: http://localhost:8081/swagger-ui/index.html
```

### Step 4: Chạy Frontend

```bash
cd frontend
npm run dev

# Truy cập: http://localhost:3000/chatbot-assistant-demo
```

### Step 5: Test

**Option A: Demo Page**
- Vào http://localhost:3000/chatbot-assistant-demo
- Nhập: "sản phẩm nổi bật"
- Chờ phản hồi

**Option B: Swagger UI**
- Vào http://localhost:8081/swagger-ui/index.html
- Tìm "Chatbot Tư Vấn Sản Phẩm"
- Click "POST /api/v1/chatbot-assistant/chat"
- Test request:
```json
{
  "message": "Tôi muốn điện thoại máy ảnh tốt",
  "minPrice": 5000000,
  "maxPrice": 20000000
}
```

---

## 📝 Test Examples

### Nổi Bật
```
Hỏi: "sản phẩm nổi bật"
Kết quả: Gọi /products/featured
Embedding: Không dùng (API direct)
Chi phí: Chỉ 1 Gemini call
```

### Tìm Kiếm
```
Hỏi: "tôi muốn điện thoại máy ảnh tốt, pin trâu"
Kết quả: Tìm kiếm + embedding filter
Embedding: Dùng để lọc 5 sản phẩm phù hợp nhất
Chi phí: 1 API call + 5 embedding + 1 Gemini call
```

### So Sánh
```
Hỏi: "so sánh điện thoại"
Kết quả: Gọi /products/best-selling
Lấy 2 top để hiển thị
```

### Bán Chạy
```
Hỏi: "sản phẩm bán chạy là gì"
Kết quả: Gọi /products/best-selling
Cache 1 giờ (request tiếp theo: 0 API call)
```

---

## 🔍 Debugging

### Kiểm tra Gemini API Key

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello"}]
    }]
  }'
```

### Kiểm tra Backend Logs

```bash
# Docker logs
docker logs utephonehub-backend -f --tail=100

# Tìm errors
docker logs utephonehub-backend 2>&1 | grep ERROR
```

### Kiểm tra API Product

```bash
curl http://localhost:8081/api/v1/products/featured
curl http://localhost:8081/api/v1/products/best-selling
curl http://localhost:8081/api/v1/products/new-arrivals
```

---

## 💡 Tips

✅ **Tối ưu Performance:**
- Keyword matching không tốn token
- Cache 1 giờ tiết kiệm 80% API calls
- Embedding reuse từ cache

✅ **Tối ưu Chi Phí:**
- 1000 chat/ngày: từ $56 → $4.40 (92% tiết kiệm)
- Chỉ dùng embedding khi SEARCH intent
- Prompt ngắn gọn

❌ **Tránh:**
- Gọi API mà không cache
- Tạo embedding mỗi lần
- Prompt dài >1000 tokens

---

## 🎓 File Mapping

| Chức Năng | Backend | Frontend |
|-----------|---------|----------|
| Intent Detection | `ChatbotAssistantUserService.detectIntent()` | Gọi API |
| Fetch Products | `ProductRecommendationService` | `chatbotAssistantService` |
| Embedding | `GeminiEmbeddingService` | - |
| Gemini Response | `ChatbotAssistantUserService.generateAiResponse()` | Hiển thị |
| UI | - | `ChatbotAssistant.tsx` |
| Hook | - | `useChatbotAssistant.ts` |

---

## 📞 Support

Nếu gặp lỗi, kiểm tra:
1. `.env` hoặc `application.yaml` có GEMINI_API_KEY?
2. Backend chạy: `docker ps | grep utephonehub`
3. Frontend chạy: `http://localhost:3000`
4. API endpoint: `/api/v1/products/featured` return data?
5. Logs: `docker logs utephonehub-backend | grep ERROR`

---

**Happy Chatting! 🚀**
