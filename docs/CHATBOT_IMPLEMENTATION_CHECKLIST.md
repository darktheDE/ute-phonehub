# ✅ Chatbot Implementation Checklist

## 🎯 Pre-Implementation (Before Adding Files)

- [ ] Gemini API key obtained from https://ai.google.dev/
- [ ] Project structure understood (backend/frontend monorepo)
- [ ] Docker Desktop installed and running
- [ ] IDE (VS Code/IntelliJ) configured for Java + TypeScript
- [ ] Node.js and npm installed
- [ ] Maven installed (or using mvnw)

---

## 🔴 Backend Implementation

### Step 1: Copy Service Files

- [ ] Copy `GeminiEmbeddingService.java` to `backend/src/main/java/com/utephonehub/backend/service/`
- [ ] Copy `ProductRecommendationService.java` to `backend/src/main/java/com/utephonehub/backend/service/`
- [ ] Copy `ChatbotAssistantUserService.java` to `backend/src/main/java/com/utephonehub/backend/service/`

**Verify:**
```bash
ls backend/src/main/java/com/utephonehub/backend/service/ | grep -E "Gemini|Product|Chatbot"
```

### Step 2: Copy Configuration & Controller

- [ ] Copy `GeminiConfig.java` to `backend/src/main/java/com/utephonehub/backend/config/`
- [ ] Copy `ChatbotAssistantUserController.java` to `backend/src/main/java/com/utephonehub/backend/controller/`

**Verify:**
```bash
ls backend/src/main/java/com/utephonehub/backend/config/ | grep Gemini
ls backend/src/main/java/com/utephonehub/backend/controller/ | grep Chatbot
```

### Step 3: Copy DTOs

- [ ] Copy `ChatbotAssistantUserRequest.java` to `backend/src/main/java/com/utephonehub/backend/dto/request/`
- [ ] Copy `ChatbotAssistantUserResponse.java` to `backend/src/main/java/com/utephonehub/backend/dto/response/`

**Verify:**
```bash
ls backend/src/main/java/com/utephonehub/backend/dto/{request,response}/ | grep Chatbot
```

### Step 4: Configure application.yaml

- [ ] Open `backend/src/main/resources/application.yaml`
- [ ] Add Gemini configuration section (see CHATBOT_CONFIG.yaml)
- [ ] Add API product base URL configuration

**Example to add:**
```yaml
gemini:
  api:
    key: ${GEMINI_API_KEY}
    url: https://generativelanguage.googleapis.com/v1beta/models
  model: gemini-2.0-flash
  embedding:
    model: text-embedding-004

api:
  product:
    base-url: ${API_PRODUCT_BASE_URL:http://localhost:8081/api/v1/products}
```

- [ ] Verify syntax (YAML indentation)

### Step 5: Setup Environment Variables

- [ ] Create `.env` file in `backend/` directory
- [ ] Copy from `.env.chatbot` template:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models
GEMINI_MODEL=gemini-2.0-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
API_PRODUCT_BASE_URL=http://localhost:8081/api/v1/products
```

- [ ] Replace `your_api_key_here` with actual Gemini API key
- [ ] Verify no spaces around `=` in .env

### Step 6: Build Backend

```bash
cd backend
mvn clean install -DskipTests
```

- [ ] Build completes without errors
- [ ] Check for compilation warnings (if any, fix them)

### Step 7: Start Backend Services

```bash
cd backend
docker-compose down
docker-compose up -d --build
```

- [ ] Wait for all services to start (~30 seconds)
- [ ] Check logs: `docker logs utephonehub-backend`
- [ ] Should see: "Started UtePhonehubBackendApplication"

### Step 8: Verify Backend

- [ ] Open http://localhost:8081/swagger-ui/index.html
- [ ] Search for "Chatbot" in Swagger
- [ ] Should see:
  - `POST /api/v1/chatbot-assistant/chat`
  - `POST /api/v1/chatbot-assistant/clear-cache`
- [ ] Test endpoint with sample request:
```json
{
  "message": "sản phẩm nổi bật"
}
```
- [ ] Response should include:
  - `aiResponse` (string)
  - `recommendedProducts` (array)
  - `detectedIntent` (FEATURED)
  - `processingTimeMs` (number)

---

## 🔵 Frontend Implementation

### Step 1: Copy Type Definitions

- [ ] Copy `chatbot-assistant.d.ts` to `frontend/types/`
- [ ] Verify: `frontend/types/chatbot-assistant.d.ts` exists

**Check:**
```bash
cat frontend/types/chatbot-assistant.d.ts | head -10
```

### Step 2: Copy Service Layer

- [ ] Copy `chatbot-assistant.service.ts` to `frontend/services/`
- [ ] Verify: `frontend/services/chatbot-assistant.service.ts` exists
- [ ] Check it imports from `@/lib/api`

**Verify:**
```bash
grep -n "import api from" frontend/services/chatbot-assistant.service.ts
```

### Step 3: Copy Custom Hook

- [ ] Copy `useChatbotAssistant.ts` to `frontend/hooks/`
- [ ] Verify: `frontend/hooks/useChatbotAssistant.ts` exists

**Check:**
```bash
grep -n "export const useChatbotAssistant" frontend/hooks/useChatbotAssistant.ts
```

### Step 4: Copy React Component

- [ ] Copy `ChatbotAssistant.tsx` to `frontend/components/common/`
- [ ] Verify: `frontend/components/common/ChatbotAssistant.tsx` exists
- [ ] Check imports:
  - `'use client'` directive present
  - shadcn/UI components (Button, Input, Card, Badge)
  - lucide-react icons
  - Tailwind CSS classes

**Verify imports:**
```bash
grep -E "from '@/components/ui|from 'lucide-react'|className" \
  frontend/components/common/ChatbotAssistant.tsx | head -5
```

### Step 5: Copy Demo Page

- [ ] Create directory: `mkdir -p frontend/app/chatbot-assistant-demo/`
- [ ] Copy `page.tsx` to `frontend/app/chatbot-assistant-demo/`
- [ ] Verify file exists: `frontend/app/chatbot-assistant-demo/page.tsx`

**Check:**
```bash
ls -la frontend/app/chatbot-assistant-demo/page.tsx
```

### Step 6: Verify Dependencies

- [ ] Check if shadcn/UI components are available:
```bash
grep -l "components/ui" frontend/package.json
```

- [ ] Check if lucide-react is installed:
```bash
grep lucide-react frontend/package.json
```

- [ ] If missing, install:
```bash
cd frontend
npm install lucide-react
npx shadcn-ui@latest add button input card badge
```

### Step 7: Build Frontend

```bash
cd frontend
npm run build
```

- [ ] Build completes without errors
- [ ] Check build output: `.next/` directory created

### Step 8: Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

- [ ] Server starts on http://localhost:3000
- [ ] Check for compilation errors in terminal

### Step 9: Verify Frontend

- [ ] Open http://localhost:3000/chatbot-assistant-demo
- [ ] Should see:
  - "🤖 Tư Vấn Sản Phẩm AI" header
  - Welcome message with example questions
  - Input field for queries
  - Filter inputs (min price, max price, category)
  - Info cards about features

- [ ] No console errors (F12 → Console tab)

---

## 🧪 Integration Testing

### Test 1: Featured Products
```
Input: "sản phẩm nổi bật"
Expected:
- Intent: FEATURED
- Products: >0
- Response time: <2s
- No embedding used
```

**Test:**
```bash
curl -X POST http://localhost:8081/api/v1/chatbot-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"sản phẩm nổi bật"}'
```

- [ ] Response status: 200
- [ ] Contains `detectedIntent: "FEATURED"`
- [ ] Contains `recommendedProducts`

### Test 2: Best Selling
```
Input: "sản phẩm bán chạy"
Expected:
- Intent: BEST_SELLING
- Products: >0
- Cache hit (second call)
```

**In Frontend:**
- [ ] Go to http://localhost:3000/chatbot-assistant-demo
- [ ] Type: "sản phẩm bán chạy"
- [ ] Click Send
- [ ] Verify response appears
- [ ] Check processingTimeMs

### Test 3: New Arrivals
```
Input: "sản phẩm mới"
Expected:
- Intent: NEW_ARRIVALS
- Products: >0
```

- [ ] Test in demo page
- [ ] Verify products displayed

### Test 4: Search with Filters
```
Input: "điện thoại máy ảnh tốt"
MinPrice: 5000000
MaxPrice: 20000000
Expected:
- Intent: SEARCH
- Products: filtered by price
- Embedding used
```

**Test:**
```bash
curl -X POST http://localhost:8081/api/v1/chatbot-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message":"điện thoại máy ảnh tốt",
    "minPrice":5000000,
    "maxPrice":20000000
  }'
```

- [ ] Response status: 200
- [ ] detectedIntent: "SEARCH"
- [ ] relevanceScore > 0.5
- [ ] Products within price range

### Test 5: Cache Hit
- [ ] Send same query twice (featured)
- [ ] processingTimeMs should be lower on second call
- [ ] Verify cache is working

### Test 6: Error Handling
- [ ] Send empty message: `{"message":""}`
- [ ] Expected: 400 error or validation message
- [ ] Send malformed JSON
- [ ] Expected: 400 error

### Test 7: Frontend UI
- [ ] Type in input field
- [ ] Click Send button
- [ ] Wait for response
- [ ] Verify message appears with AI response
- [ ] Verify product cards display
- [ ] Scroll down automatically
- [ ] Click "Xóa chat" button
- [ ] Messages clear

---

## 📊 Performance Testing

### Measure Response Time
```bash
# First call (no cache)
time curl -X POST http://localhost:8081/api/v1/chatbot-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"sản phẩm nổi bật"}'

# Second call (with cache)
time curl -X POST http://localhost:8081/api/v1/chatbot-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"sản phẩm nổi bật"}'
```

- [ ] First call: 800-2500ms
- [ ] Second call: 500-1500ms
- [ ] Cache hit reduces latency

### Monitor Logs
```bash
docker logs utephonehub-backend -f --tail=50 | grep -i chatbot
```

- [ ] Check for errors
- [ ] Verify caching messages
- [ ] Monitor Gemini API calls

---

## 🔐 Security Checks

- [ ] GEMINI_API_KEY not in code (only in .env)
- [ ] No hardcoded URLs
- [ ] Input validation present
- [ ] Error messages don't leak sensitive info
- [ ] API requires authentication (if needed)
- [ ] CORS configured properly

---

## 📚 Documentation Review

- [ ] `CHATBOT_ASSISTANT.md` - Complete guide
- [ ] `CHATBOT_QUICK_START.md` - Quick reference
- [ ] `CHATBOT_FILES_CREATED.md` - File listing
- [ ] Code comments present and clear
- [ ] API documentation in Swagger

---

## 🚀 Deployment Checklist

- [ ] All files in correct locations
- [ ] application.yaml configured
- [ ] .env created and populated
- [ ] Docker builds successfully
- [ ] Frontend builds successfully
- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Performance acceptable
- [ ] Documentation complete

---

## 📋 Final Verification

### Backend
```bash
curl -X POST http://localhost:8081/api/v1/chatbot-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

- [ ] Response 200 OK
- [ ] Contains required fields

### Frontend
```
http://localhost:3000/chatbot-assistant-demo
```

- [ ] Page loads
- [ ] Can type and send
- [ ] Receives response
- [ ] Products display

### Swagger UI
```
http://localhost:8081/swagger-ui/index.html
```

- [ ] Chatbot endpoints visible
- [ ] Can test directly
- [ ] Documentation shows

---

## ✅ READY FOR PRODUCTION

When all checkboxes are complete:

1. **Backend:** Production-ready, tested ✅
2. **Frontend:** Responsive, styled, functional ✅
3. **Documentation:** Complete and clear ✅
4. **Performance:** Optimized, cached ✅
5. **Security:** Validated, API key protected ✅
6. **Monitoring:** Logging in place ✅

### Next Steps:
- Monitor API usage and costs
- Collect user feedback
- Plan Phase 2 enhancements
- Setup analytics/metrics
- Configure scaling if needed

---

## 🎓 Support Resources

| Resource | URL |
|----------|-----|
| Gemini API Docs | https://ai.google.dev/docs |
| Error Checklist | docs/CHATBOT_QUICK_START.md#troubleshooting |
| Configuration | backend/CHATBOT_CONFIG.yaml |
| Implementation Details | docs/CHATBOT_IMPLEMENTATION_SUMMARY.md |

---

**Completion Date:** _______________
**Tested By:** _______________
**Approved By:** _______________

---

**Happy Testing! 🚀**
