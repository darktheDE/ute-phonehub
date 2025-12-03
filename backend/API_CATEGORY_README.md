# API Category - Hướng dẫn Test

## 📋 Tổng quan

API GET `/api/v1/categories` đã được implement đầy đủ theo quy chuẩn CONVENTIONS.md:

### ✅ Đã hoàn thành:

1. **Entity Layer** (có sẵn):
   - `Category.java` - Entity với quan hệ parent-child

2. **Repository Layer** (có sẵn):
   - `CategoryRepository.java` - JpaRepository với custom queries

3. **DTO Layer** (MỚI):
   - `CategoryResponse.java` - Response DTO với 2 methods:
     - `fromEntity()` - Convert có children
     - `fromEntitySimple()` - Convert không có children

4. **Service Layer** (MỚI):
   - `ICategoryService.java` - Interface với 4 methods
   - `CategoryServiceImpl.java` - Implementation với:
     - `getAllCategories()` - Lấy tất cả danh mục
     - `getRootCategories()` - Lấy danh mục gốc + children
     - `getCategoryById()` - Lấy chi tiết 1 danh mục
     - `getCategoriesByParentId()` - Lấy danh mục con

5. **Controller Layer** (MỚI):
   - `CategoryController.java` - REST API với 4 endpoints
   - Đầy đủ Swagger annotations
   - Logging với @Slf4j

6. **Security Config** (CẬP NHẬT):
   - Thêm `/api/v1/categories/**` vào permitAll (không cần authentication)

7. **Seed Data** (MỚI):
   - `data.sql` - 17 categories mẫu (5 root + 12 child)
   - `application.yaml` - Cấu hình chạy data.sql tự động

---

## 🚀 Cách chạy Backend

### Option 1: Chạy bằng Docker (Khuyến nghị cho lần đầu)

```bash
cd D:\CNPM\ute-phonehub\backend
docker-compose up -d --build
```

**Đợi khoảng 30-60 giây** để backend khởi động hoàn tất.

### Option 2: Chạy trong IntelliJ (Dev nhanh hơn)

1. **Chỉ chạy Database & Redis bằng Docker:**
   ```bash
   cd D:\CNPM\ute-phonehub\backend
   docker-compose up -d postgres redis
   ```

2. **Chạy Backend trong IntelliJ:**
   - Mở file `UtePhonehubBackendApplication.java`
   - Click nút Run ▶️ hoặc `Shift + F10`
   - Hoặc: Right-click file → Run

3. **Xem log console** để đảm bảo:
   - ✅ "Started UtePhonehubBackendApplication in XX seconds"
   - ✅ Không có lỗi SQL
   - ✅ Thấy insert statements từ data.sql

---

## 📡 Test API trên Swagger UI

### 1. Mở Swagger UI

Truy cập: **http://localhost:8081/swagger-ui/index.html**

### 2. Tìm "Category" section

- Scroll xuống tìm mục **"Category"** với mô tả _"API quản lý danh mục sản phẩm"_

### 3. Test các API endpoints:

#### **API 1: GET /api/v1/categories**
📌 **Mục đích:** Lấy TẤT CẢ danh mục (flat list, không phân cấp)

**Bước test:**
1. Click endpoint `GET /api/v1/categories`
2. Click nút **"Try it out"**
3. Click **"Execute"**

**Kết quả mong đợi:**
```json
{
  "code": 200,
  "message": "Lấy danh sách danh mục thành công",
  "data": [
    {
      "id": 1,
      "name": "Điện thoại",
      "description": "Điện thoại di động các loại",
      "parentId": null,
      "parentName": null,
      "children": null,
      "createdAt": "2025-12-03T...",
      "updatedAt": "2025-12-03T..."
    },
    {
      "id": 6,
      "name": "iPhone",
      "description": "Điện thoại iPhone của Apple",
      "parentId": 1,
      "parentName": null,
      "children": null,
      "createdAt": "2025-12-03T...",
      "updatedAt": "2025-12-03T..."
    }
    // ... tổng 17 items
  ],
  "timestamp": "2025-12-03T..."
}
```

---

#### **API 2: GET /api/v1/categories/root**
📌 **Mục đích:** Lấy danh mục GỐC (có children lồng nhau)

**Bước test:**
1. Click endpoint `GET /api/v1/categories/root`
2. Click **"Try it out"**
3. Click **"Execute"**

**Kết quả mong đợi:**
```json
{
  "code": 200,
  "message": "Lấy danh sách danh mục gốc thành công",
  "data": [
    {
      "id": 1,
      "name": "Điện thoại",
      "description": "Điện thoại di động các loại",
      "parentId": null,
      "parentName": null,
      "children": [
        {
          "id": 6,
          "name": "iPhone",
          "description": "Điện thoại iPhone của Apple",
          "parentId": 1,
          "createdAt": "...",
          "updatedAt": "..."
        },
        {
          "id": 7,
          "name": "Samsung",
          "description": "Điện thoại Samsung",
          "parentId": 1,
          "createdAt": "...",
          "updatedAt": "..."
        }
        // ... 4 children nữa (Xiaomi, OPPO, Vivo, Realme)
      ],
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "id": 4,
      "name": "Phụ kiện",
      "description": "Phụ kiện điện thoại và thiết bị điện tử",
      "parentId": null,
      "children": [
        {
          "id": 12,
          "name": "Tai nghe",
          "description": "Tai nghe có dây và không dây",
          "parentId": 4,
          "createdAt": "...",
          "updatedAt": "..."
        }
        // ... 4 children nữa
      ],
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ... 3 root categories nữa
  ],
  "timestamp": "..."
}
```

---

#### **API 3: GET /api/v1/categories/{id}**
📌 **Mục đích:** Lấy chi tiết 1 danh mục theo ID

**Bước test:**
1. Click endpoint `GET /api/v1/categories/{id}`
2. Click **"Try it out"**
3. Nhập `id = 1` (Điện thoại)
4. Click **"Execute"**

**Kết quả mong đợi:**
```json
{
  "code": 200,
  "message": "Lấy thông tin danh mục thành công",
  "data": {
    "id": 1,
    "name": "Điện thoại",
    "description": "Điện thoại di động các loại",
    "parentId": null,
    "parentName": null,
    "children": [
      {
        "id": 6,
        "name": "iPhone",
        "description": "Điện thoại iPhone của Apple",
        "parentId": 1,
        "createdAt": "...",
        "updatedAt": "..."
      }
      // ... 5 children
    ],
    "createdAt": "...",
    "updatedAt": "..."
  },
  "timestamp": "..."
}
```

**Test case lỗi:**
- Nhập `id = 999` → Response: `404 Not Found`
```json
{
  "code": 404,
  "message": "Danh mục không tồn tại với ID: 999",
  "data": null,
  "timestamp": "..."
}
```

---

#### **API 4: GET /api/v1/categories/parent/{parentId}**
📌 **Mục đích:** Lấy danh sách danh mục CON của 1 danh mục cha

**Bước test:**
1. Click endpoint `GET /api/v1/categories/parent/{parentId}`
2. Click **"Try it out"**
3. Nhập `parentId = 1` (Điện thoại)
4. Click **"Execute"**

**Kết quả mong đợi:**
```json
{
  "code": 200,
  "message": "Lấy danh sách danh mục con thành công",
  "data": [
    {
      "id": 6,
      "name": "iPhone",
      "description": "Điện thoại iPhone của Apple",
      "parentId": 1,
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "id": 7,
      "name": "Samsung",
      "description": "Điện thoại Samsung",
      "parentId": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ... 4 children nữa
  ],
  "timestamp": "..."
}
```

**Test với Phụ kiện:**
- Nhập `parentId = 4` → Trả về 5 children: Tai nghe, Sạc dự phòng, Ốp lưng, Cáp sạc, Miếng dán màn hình

**Test case lỗi:**
- Nhập `parentId = 999` → Response: `404 Not Found`

---

## 🗂️ Cấu trúc Seed Data

**5 Root Categories:**
1. ID=1: Điện thoại (6 children)
2. ID=2: Tablet (0 children)
3. ID=3: Laptop (0 children)
4. ID=4: Phụ kiện (5 children)
5. ID=5: Đồng hồ thông minh (0 children)

**Children of Điện thoại (ID=1):**
- ID=6: iPhone
- ID=7: Samsung
- ID=8: Xiaomi
- ID=9: OPPO
- ID=10: Vivo
- ID=11: Realme

**Children of Phụ kiện (ID=4):**
- ID=12: Tai nghe
- ID=13: Sạc dự phòng
- ID=14: Ốp lưng
- ID=15: Cáp sạc
- ID=16: Miếng dán màn hình

---

## ✅ Checklist Test Hoàn tất

- [ ] Backend đã khởi động thành công (port 8081)
- [ ] Swagger UI accessible tại http://localhost:8081/swagger-ui/index.html
- [ ] Tìm thấy section "Category" trong Swagger
- [ ] Test GET `/api/v1/categories` → Trả về 17 items
- [ ] Test GET `/api/v1/categories/root` → Trả về 5 root categories có children
- [ ] Test GET `/api/v1/categories/1` → Trả về chi tiết "Điện thoại" có 6 children
- [ ] Test GET `/api/v1/categories/999` → Trả về 404 Not Found
- [ ] Test GET `/api/v1/categories/parent/1` → Trả về 6 children của "Điện thoại"
- [ ] Test GET `/api/v1/categories/parent/4` → Trả về 5 children của "Phụ kiện"

---

## 🐛 Troubleshooting

### Lỗi: Backend không khởi động được

**Giải pháp:**
```bash
# Xem logs
docker logs utephonehub-backend --tail 100

# Hoặc xem logs real-time
docker logs -f utephonehub-backend
```

### Lỗi: Không thấy data trong response

**Nguyên nhân:** File `data.sql` chưa chạy

**Giải pháp:**
1. Kiểm tra log console có thấy INSERT statements không
2. Nếu không thấy, restart backend:
   ```bash
   docker-compose restart backend
   ```
3. Hoặc rebuild lại:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Lỗi: 401 Unauthorized

**Nguyên nhân:** SecurityConfig chưa permitAll cho `/api/v1/categories/**`

**Giải pháp:** Đã fix trong `SecurityConfig.java` rồi, chỉ cần restart backend.

---

## 📚 Quy chuẩn Code đã tuân thủ

✅ **CONVENTIONS.md Section 6.2 - Backend Layer-by-Layer:**
- [x] Entity có sẵn: `Category.java`
- [x] Repository có sẵn: `CategoryRepository.java`
- [x] DTO Layer: `CategoryResponse.java` (static factory methods)
- [x] Service Interface: `ICategoryService.java`
- [x] Service Implementation: `CategoryServiceImpl.java` (@Transactional, @Slf4j)
- [x] Controller: `CategoryController.java` (Swagger annotations, logging)

✅ **Code Style:**
- [x] Lombok: @Data, @Builder, @RequiredArgsConstructor, @Slf4j
- [x] Constructor Injection: `private final ICategoryService categoryService;`
- [x] Exception Handling: `ResourceNotFoundException`
- [x] Naming: camelCase methods, PascalCase classes
- [x] Logging: `log.info("message")` ở mỗi method
- [x] Return DTO: Không return Entity

✅ **API Design:**
- [x] RESTful: GET methods cho read operations
- [x] Response wrapper: `ApiResponse<T>`
- [x] HTTP Status: 200 OK, 404 Not Found
- [x] Swagger docs: @Operation, @ApiResponses, @Tag

---

## 🎉 Kết luận

API Category đã hoàn thành 100% theo đúng quy chuẩn CONVENTIONS.md!

**Tham khảo code tương tự:**
- Entity: giống `User.java`
- Repository: giống `UserRepository.java`
- Service: giống `IAuthService.java` + `AuthServiceImpl.java`
- Controller: giống `AuthController.java`
- DTO: giống `UserResponse.java`

**Không đụng đến code của bạn:**
- ❌ Không sửa User, Auth, Address
- ❌ Không sửa GlobalExceptionHandler
- ✅ Chỉ thêm Category code mới
- ✅ Chỉ thêm permitAll cho `/api/v1/categories/**` trong SecurityConfig

