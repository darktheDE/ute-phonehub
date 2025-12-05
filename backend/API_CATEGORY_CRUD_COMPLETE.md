# API CATEGORY DOCUMENTATION - COMPLETE CRUD

## Overview
API quản lý danh mục sản phẩm (Category Management) cho UTE Phone Hub.  
Base URL: `http://localhost:8081/api/v1/categories`

---

## 1. GET /api/v1/categories
**Mô tả:** Lấy danh sách danh mục theo parentId

**Query Parameters:**
- `parentId` (optional): ID của danh mục cha
  - Nếu `null` hoặc không truyền: trả về danh mục gốc
  - Nếu có giá trị: trả về danh mục con

**Response 200:**
```json
{
  "code": 200,
  "message": "Lấy danh sách danh mục gốc thành công",
  "data": [
    {
      "id": 1,
      "name": "Điện thoại",
      "parentId": null,
      "hasChildren": true,
      "createdAt": "2025-12-02T18:16:54.032044",
      "updatedAt": "2025-12-02T18:16:54.032044"
    }
  ],
  "timestamp": "2025-12-03T01:59:21.209218135"
}
```

---

## 2. POST /api/v1/categories
**Mô tả:** Tạo danh mục mới

**Request Body:**
```json
{
  "name": "Tai nghe",
  "description": "Các loại tai nghe",
  "parentId": 4
}
```

**Validation:**
- `name`: Bắt buộc, 2-100 ký tự
- `description`: Tùy chọn, tối đa 500 ký tự
- `parentId`: Tùy chọn (null = danh mục gốc)

**Business Rules:**
- Kiểm tra trùng tên trong cùng parentId
- Kiểm tra parentId có tồn tại (nếu được cung cấp)

**Response 201:**
```json
{
  "code": 201,
  "message": "Tạo danh mục thành công",
  "data": {
    "id": 6,
    "name": "Tai nghe",
    "parentId": 4,
    "hasChildren": false,
    "createdAt": "2025-12-03T02:30:15.123456",
    "updatedAt": "2025-12-03T02:30:15.123456"
  },
  "timestamp": "2025-12-03T02:30:15.123456"
}
```

---

## 3. PUT /api/v1/categories/{id}
**Mô tả:** Cập nhật danh mục đã tồn tại

**Path Parameters:**
- `id` (required): ID của danh mục cần cập nhật

**Request Body:**
```json
{
  "name": "Tai nghe Bluetooth",
  "description": "Tai nghe không dây",
  "parentId": 4
}
```

**Validation:**
- `name`: Bắt buộc, 2-100 ký tự
- `description`: Tùy chọn, tối đa 500 ký tự
- `parentId`: Tùy chọn (null = chuyển thành danh mục gốc)

**Business Rules:**
- Kiểm tra danh mục tồn tại
- Kiểm tra trùng tên trong cùng parentId (loại trừ chính nó)
- Kiểm tra parentId có tồn tại (nếu được cung cấp)
- Không cho phép đặt danh mục làm cha của chính nó

**Response 200:**
```json
{
  "code": 200,
  "message": "Cập nhật danh mục thành công",
  "data": {
    "id": 6,
    "name": "Tai nghe Bluetooth",
    "parentId": 4,
    "hasChildren": false,
    "createdAt": "2025-12-03T02:30:15.123456",
    "updatedAt": "2025-12-03T02:45:20.789012"
  },
  "timestamp": "2025-12-03T02:45:20.789012"
}
```

---

## 4. DELETE /api/v1/categories/{id}
**Mô tả:** Xóa danh mục theo ID

**Path Parameters:**
- `id` (required): ID của danh mục cần xóa

**Business Rules:**
- Kiểm tra danh mục tồn tại
- **Không cho phép xóa nếu có danh mục con**
- **Không cho phép xóa nếu có sản phẩm liên kết**

**Response 200:**
```json
{
  "code": 200,
  "message": "Xóa danh mục thành công",
  "data": null,
  "timestamp": "2025-12-06T00:40:00.123456"
}
```

**Error Response 400 (Có danh mục con):**
```json
{
  "code": 400,
  "message": "Không thể xóa danh mục. Danh mục này có 3 danh mục con",
  "timestamp": "2025-12-06T00:40:00.123456"
}
```

**Error Response 400 (Có sản phẩm liên kết):**
```json
{
  "code": 400,
  "message": "Không thể xóa danh mục. Danh mục đang chứa sản phẩm",
  "timestamp": "2025-12-06T00:40:00.123456"
}
```

**Error Response 404:**
```json
{
  "code": 404,
  "message": "Danh mục không tồn tại với ID: 999",
  "timestamp": "2025-12-06T00:40:00.123456"
}
```

---

## Code Structure (Follow CONVENTIONS.md)

### Controller Layer
- File: `CategoryController.java`
- Endpoints: GET, POST, PUT, DELETE
- Swagger annotations: `@Operation`, `@ApiResponses`, `@Parameter`
- Returns: `ApiResponse<T>` wrapper

### Service Layer
- Interface: `ICategoryService.java`
- Implementation: `CategoryServiceImpl.java`
- Uses: `@Service`, `@Transactional`, `@RequiredArgsConstructor`, `@Slf4j`
- Business logic: Validation, constraint checking, data manipulation

### Repository Layer
**CategoryRepository:**
- `findByParentIdIsNull()` - Get root categories
- `findByParentId(Long parentId)` - Get children
- `existsByNameAndParentId(String, Long)` - Check duplicate (create)
- `existsByNameAndParentIdAndIdNot(String, Long, Long)` - Check duplicate (update)
- `countByParentId(Long parentId)` - Count children (delete constraint)

**ProductRepository:**
- `existsByCategoryId(Long categoryId)` - Check product linkage (delete constraint)

### DTO Layer
- Request: `CreateCategoryRequest`, `UpdateCategoryRequest`
- Response: `CategoryResponse`
- Validation: `@NotBlank`, `@Size`

---

## Testing with Swagger UI

Access: `http://localhost:8081/swagger-ui/index.html#/`

**Tag:** Category

**Available Endpoints:**
1. ✅ `GET /api/v1/categories` - Lấy danh sách danh mục
2. ✅ `POST /api/v1/categories` - Tạo danh mục mới
3. ✅ `PUT /api/v1/categories/{id}` - Cập nhật danh mục
4. ✅ `DELETE /api/v1/categories/{id}` - Xóa danh mục

---

## DELETE Endpoint Test Cases

### Test Case 1: Xóa thành công
**Precondition:** Danh mục không có con và không có sản phẩm
```http
DELETE /api/v1/categories/10
```
**Expected:** 200 OK

---

### Test Case 2: Không thể xóa - Có danh mục con
**Precondition:** Danh mục có children
```http
DELETE /api/v1/categories/4
```
**Expected:** 400 Bad Request - "Danh mục này có X danh mục con"

---

### Test Case 3: Không thể xóa - Có sản phẩm liên kết
**Precondition:** Danh mục có products
```http
DELETE /api/v1/categories/1
```
**Expected:** 400 Bad Request - "Danh mục đang chứa sản phẩm"

---

### Test Case 4: ID không tồn tại
```http
DELETE /api/v1/categories/999
```
**Expected:** 404 Not Found

---

## Constraint Checking Flow

```
DELETE Request
    ↓
Check category exists? → NO → 404 Not Found
    ↓ YES
Check has children? → YES → 400 Bad Request
    ↓ NO
Check has products? → YES → 400 Bad Request
    ↓ NO
Delete category → 200 OK
```

---

## Key Features - COMPLETE CRUD

| Operation | Endpoint | Status Code | Key Features |
|-----------|----------|-------------|--------------|
| **CREATE** | POST /api/v1/categories | 201 | Duplicate check, parent validation |
| **READ** | GET /api/v1/categories | 200 | Hierarchical query, parent/children |
| **UPDATE** | PUT /api/v1/categories/{id} | 200 | Duplicate check (exclude self), circular check |
| **DELETE** | DELETE /api/v1/categories/{id} | 200 | Constraint check (children + products) |

---

## Compliance with M03.md

✅ **[FR-ADMIN-03.1]** - CRUD operations implemented  
✅ **[FR-ADMIN-03.3]** - Constraint checking before deletion:
- Check children categories
- Check linked products
- Clear error messages

---

**Status:** ✅ **COMPLETE CRUD API - Ready for Testing!**

