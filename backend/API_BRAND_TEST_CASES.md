# 🧪 **TEST CASES - BRAND API**

## 📋 **TEST SCENARIO CHECKLIST**

### ✅ **PUBLIC API - Không cần authentication**

#### **TC-BRAND-001: GET All Brands - Success**
- **Endpoint:** `GET /api/v1/brands`
- **Headers:** None
- **Expected Result:** 
  - Status: 200 OK
  - Response: Array of brands sorted by name
  - Message: "Lấy danh sách thương hiệu thành công"

#### **TC-BRAND-002: GET Brand by ID - Success**
- **Endpoint:** `GET /api/v1/brands/1`
- **Headers:** None
- **Expected Result:**
  - Status: 200 OK
  - Response: Brand object with id=1
  - Message: "Lấy thông tin thương hiệu thành công"

#### **TC-BRAND-003: GET Brand by ID - Not Found**
- **Endpoint:** `GET /api/v1/brands/999`
- **Headers:** None
- **Expected Result:**
  - Status: 404 Not Found
  - Message: "Thương hiệu không tồn tại với ID: 999"

---

### 🔐 **ADMIN API - Cần authentication + ADMIN role**

#### **TC-BRAND-004: POST Create Brand - Success**
- **Endpoint:** `POST /api/v1/admin/brands`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "OPPO",
    "description": "Thương hiệu điện thoại phổ biến",
    "logoUrl": "https://example.com/logos/oppo.png"
  }
  ```
- **Expected Result:**
  - Status: 201 Created
  - Response: Brand object với id mới
  - Message: "Tạo thương hiệu thành công"

#### **TC-BRAND-005: POST Create Brand - Duplicate Name**
- **Endpoint:** `POST /api/v1/admin/brands`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "Apple",
    "description": "Test duplicate"
  }
  ```
- **Expected Result:**
  - Status: 400 Bad Request
  - Message: "Tên thương hiệu 'Apple' đã tồn tại"

#### **TC-BRAND-006: POST Create Brand - Invalid Name (Too Short)**
- **Endpoint:** `POST /api/v1/admin/brands`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "A"
  }
  ```
- **Expected Result:**
  - Status: 400 Bad Request
  - Message: "Tên thương hiệu phải từ 2-100 ký tự"

#### **TC-BRAND-007: POST Create Brand - Empty Name**
- **Endpoint:** `POST /api/v1/admin/brands`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": ""
  }
  ```
- **Expected Result:**
  - Status: 400 Bad Request
  - Message: "Tên thương hiệu không được để trống"

#### **TC-BRAND-008: POST Create Brand - No Authentication**
- **Endpoint:** `POST /api/v1/admin/brands`
- **Headers:** None
- **Body:**
  ```json
  {
    "name": "Test Brand"
  }
  ```
- **Expected Result:**
  - Status: 401 Unauthorized

#### **TC-BRAND-009: POST Create Brand - Customer Role (Not Admin)**
- **Endpoint:** `POST /api/v1/admin/brands`
- **Headers:** `Authorization: Bearer <customer_token>`
- **Body:**
  ```json
  {
    "name": "Test Brand"
  }
  ```
- **Expected Result:**
  - Status: 403 Forbidden

#### **TC-BRAND-010: PUT Update Brand - Success**
- **Endpoint:** `PUT /api/v1/admin/brands/3`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "OPPO Vietnam",
    "description": "Chi nhánh Việt Nam của OPPO",
    "logoUrl": "https://example.com/logos/oppo-vn.png"
  }
  ```
- **Expected Result:**
  - Status: 200 OK
  - Response: Updated brand object
  - Message: "Cập nhật thương hiệu thành công"

#### **TC-BRAND-011: PUT Update Brand - Duplicate Name**
- **Endpoint:** `PUT /api/v1/admin/brands/3`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "Samsung"
  }
  ```
- **Expected Result:**
  - Status: 400 Bad Request
  - Message: "Tên thương hiệu 'Samsung' đã tồn tại"

#### **TC-BRAND-012: PUT Update Brand - Same Name (Own Name)**
- **Endpoint:** `PUT /api/v1/admin/brands/1`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "Apple",
    "description": "Updated description only"
  }
  ```
- **Expected Result:**
  - Status: 200 OK
  - Message: "Cập nhật thương hiệu thành công"

#### **TC-BRAND-013: PUT Update Brand - Not Found**
- **Endpoint:** `PUT /api/v1/admin/brands/999`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "name": "Test"
  }
  ```
- **Expected Result:**
  - Status: 404 Not Found
  - Message: "Thương hiệu không tồn tại với ID: 999"

#### **TC-BRAND-014: DELETE Brand - Success (No Products)**
- **Endpoint:** `DELETE /api/v1/admin/brands/10`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Pre-condition:** Brand ID 10 không có sản phẩm nào
- **Expected Result:**
  - Status: 200 OK
  - Message: "Xóa thương hiệu thành công"

#### **TC-BRAND-015: DELETE Brand - Has Products**
- **Endpoint:** `DELETE /api/v1/admin/brands/1`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Pre-condition:** Brand ID 1 (Apple) có sản phẩm iPhone
- **Expected Result:**
  - Status: 400 Bad Request
  - Message: "Không thể xóa thương hiệu. Thương hiệu đang chứa sản phẩm"

#### **TC-BRAND-016: DELETE Brand - Not Found**
- **Endpoint:** `DELETE /api/v1/admin/brands/999`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Expected Result:**
  - Status: 404 Not Found
  - Message: "Thương hiệu không tồn tại với ID: 999"

---

## 📊 **COVERAGE MATRIX**

| Chức năng | Happy Path | Error Cases | Auth Check | Total |
|-----------|------------|-------------|------------|-------|
| GET All   | ✅ TC-001  | -           | N/A        | 1     |
| GET By ID | ✅ TC-002  | ✅ TC-003   | N/A        | 2     |
| POST      | ✅ TC-004  | ✅ TC-005, TC-006, TC-007 | ✅ TC-008, TC-009 | 6 |
| PUT       | ✅ TC-010, TC-012 | ✅ TC-011, TC-013 | (Same as POST) | 4 |
| DELETE    | ✅ TC-014  | ✅ TC-015, TC-016 | (Same as POST) | 3 |
| **TOTAL** | **6**      | **7**       | **2**      | **16** |

---

## 🚀 **HƯỚNG DẪN CHẠY TEST**

### **Bước 1: Khởi động Backend**
```bash
cd D:\CNPM\ute-phonehub\backend
docker-compose up -d --build
```

### **Bước 2: Mở Swagger UI**
```
http://localhost:8081/swagger-ui/index.html
```

### **Bước 3: Lấy Admin Token**
1. Tìm endpoint **POST /api/v1/auth/login**
2. Click "Try it out"
3. Body:
   ```json
   {
     "username": "admin",
     "password": "password123"
   }
   ```
4. Execute và copy `accessToken`

### **Bước 4: Authorize**
1. Click nút **"Authorize"** (🔓)
2. Nhập: `Bearer <your_token>`
3. Click "Authorize"

### **Bước 5: Run Test Cases**
- Chạy từng test case theo thứ tự TC-001 → TC-016
- Check status code và message response
- Verify data consistency

---

## ✅ **EXPECTED INITIAL DATA (From init.sql)**

```sql
-- Brands in database after initialization:
1. Apple
2. Samsung
3. Xiaomi
4. OPPO
5. Dell
```

Sử dụng data này để test các scenario có ràng buộc product.

