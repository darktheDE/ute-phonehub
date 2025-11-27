# QUY CHUẨN CODE (CODING CONVENTIONS)
**DỰ ÁN: UTE PHONE HUB**
**Phiên bản:** 1.0

---

## 1. NGUYÊN TẮC CHUNG (GENERAL PRINCIPLES)
1.  **Ngôn ngữ:**
    *   **Code:** 100% Tiếng Anh (Tên biến, hàm, class, comment trong code).
    *   **Commit Message:** Tiếng Anh (theo chuẩn Conventional Commits).
    *   **Tài liệu/Giải trình:** Tiếng Việt hoặc Tiếng Anh.
2.  **Clean Code:**
    *   **DRY (Don't Repeat Yourself):** Không copy-paste code. Nếu một đoạn logic xuất hiện 2 lần, hãy tách thành hàm hoặc component chung.
    *   **KISS (Keep It Simple, Stupid):** Viết code đơn giản, dễ hiểu. Tránh viết code quá phức tạp (over-engineering).
    *   **Single Responsibility:** Một hàm/class chỉ làm một nhiệm vụ duy nhất.

---

## 2. BACKEND CONVENTIONS (JAVA / SPRING BOOT)

### 2.1. Quy tắc đặt tên (Naming)
*   **Class/Interface:** `PascalCase` (Danh từ). Ví dụ: `UserService`, `ProductController`.
*   **Method/Variable:** `camelCase` (Động từ cho hàm). Ví dụ: `findUserByEmail()`, `totalPrice`.
*   **Constant/Enum:** `UPPER_SNAKE_CASE`. Ví dụ: `MAX_LOGIN_ATTEMPTS`, `ROLE_ADMIN`.
*   **Package:** `lowercase` toàn bộ. Ví dụ: `com.ute.phonehub.service`.
*   **Database Table (Entity):** Ánh xạ tên bảng là `snake_case`.
    *   Class: `OrderDetail` -> Table: `order_details`

### 2.2. Cấu trúc Code
*   **Controller:** Chỉ xử lý request/response, validate input cơ bản. **KHÔNG** viết business logic tại đây.
*   **Service:** Chứa toàn bộ business logic. Phải dùng `@Transactional` cho các hàm làm thay đổi dữ liệu.
*   **Repository:** Chỉ chứa các method truy vấn DB. Trả về `Optional<T>` thay vì `null`.
*   **DTO:**
    *   Luôn sử dụng DTO cho Request và Response. **TUYỆT ĐỐI KHÔNG** trả về Entity trực tiếp ra API.
    *   Tên DTO: `<Action><Entity>Request` / `<Entity>Response`. Ví dụ: `RegisterRequest`, `ProductResponse`.

### 2.3. Sử dụng Lombok & Injection
*   Sử dụng `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` để giảm boilerplate code.
*   **Dependency Injection:** Sử dụng **Constructor Injection** (khuyến nghị dùng `@RequiredArgsConstructor` của Lombok) thay vì `@Autowired` trên field.

**Ví dụ (Good):**
```java
@Service
@RequiredArgsConstructor // Tự động tạo constructor cho các field final
public class UserService {
    private final UserRepository userRepository; // Bắt buộc final
}
```

### 2.4. Xử lý Exception
*   Không dùng `try-catch` bừa bãi trong Controller.
*   Ném ra `CustomException` (ví dụ: `ResourceNotFoundException`) và để `GlobalExceptionHandler` xử lý tập trung.

---

## 3. FRONTEND CONVENTIONS (NEXT.JS / REACT / TYPESCRIPT)

### 3.1. Quy tắc đặt tên
*   **Component/File .tsx:** `PascalCase`. Ví dụ: `ProductCard.tsx`, `LoginForm.tsx`.
*   **Function/Hook/Variable:** `camelCase`. Ví dụ: `handleSubmit`, `useAuth`.
*   **Folder:**
    *   Folder chứa Route (App Router): `kebab-case`. Ví dụ: `app/my-account/page.tsx`.
    *   Folder chứa Component: `PascalCase` hoặc `camelCase` tùy thống nhất (Khuyến nghị `PascalCase` để khớp với tên file chính).
*   **Interface/Type:** `PascalCase`. Ví dụ: `IUser`, `ProductProps`.

### 3.2. TypeScript
*   **NO `any`:** Tuyệt đối không dùng kiểu `any`. Phải định nghĩa type/interface rõ ràng.
*   Sử dụng `type` cho props và `interface` cho data models.

### 3.3. React & Next.js 15
*   **Functional Components:** Sử dụng Arrow Function hoặc Function Declaration. Ưu tiên `export default` cho Page và `export const` cho Component tái sử dụng.
*   **Server vs Client Component:**
    *   Mặc định là Server Component.
    *   Chỉ thêm `'use client'` khi cần tương tác (onClick, useState, useEffect).
*   **Hooks:** Luôn đặt hooks ở đầu function component.

### 3.4. Tailwind CSS v4
*   Sử dụng thư viện `clsx` và `tailwind-merge` (hàm `cn()` trong `lib/utils.ts`) để nối class động.
*   **Thứ tự class:** Sắp xếp class theo logic: `Layout` -> `Box Model` (Margin/Padding) -> `Visual` (Color, Font). (Cài extension *Tailwind CSS IntelliSense* để tự sắp xếp).

**Ví dụ (Good):**
```tsx
// Good
export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button 
      className={cn("flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", className)}
      {...props}
    />
  );
};
```

---

## 4. DATABASE CONVENTIONS (POSTGRESQL)

*   **Table Name:** `snake_case`, danh từ số nhiều. Ví dụ: `users`, `product_images`.
*   **Column Name:** `snake_case`. Ví dụ: `created_at`, `full_name`.
*   **Primary Key:** Luôn đặt tên là `id` (BigInt/UUID).
*   **Foreign Key:** `<table_singular>_id`. Ví dụ: `user_id`, `category_id`.
*   **Constraints:** Luôn đặt ràng buộc `NOT NULL` cho các trường bắt buộc.

---

## 5. API STANDARD (RESTful)

### 5.1. Định dạng URL
*   Sử dụng danh từ số nhiều, chữ thường, gạch nối (`kebab-case`).
*   `GET /api/v1/products` (Lấy danh sách)
*   `GET /api/v1/products/{id}` (Lấy chi tiết)
*   `POST /api/v1/products` (Tạo mới)
*   `PUT /api/v1/products/{id}` (Cập nhật toàn bộ)
*   `DELETE /api/v1/products/{id}` (Xóa)

### 5.2. Định dạng Response (JSON)
Thống nhất một cấu trúc trả về chung cho toàn bộ hệ thống (dùng class `ApiResponse<T>` trong Backend).

```json
{
  "code": 200,
  "message": "Success",
  "data": { ... } // Object hoặc Array
}
```
Hoặc khi lỗi:
```json
{
  "code": 400,
  "message": "Email already exists",
  "data": null
}
```

---

## 6. QUY TRÌNH GIT (GIT WORKFLOW)

### 6.1. Các nhánh chính (Branches)
*   `main`: Nhánh sản phẩm, code ổn định nhất (Production).
*   `dev`: Nhánh phát triển chung. Code merged vào đây phải chạy được.
*   `feature/<tên-chức-năng>`: Nhánh làm việc của từng thành viên.
    *   Ví dụ: `feature/login-ui`, `feature/crud-product-api`.

### 6.2. Commit Message (Conventional Commits)
Cấu trúc: `<type>: <subject>`

*   **Types:**
    *   `feat`: Tính năng mới (New feature)
    *   `fix`: Sửa lỗi (Bug fix)
    *   `docs`: Thay đổi tài liệu (Documentation)
    *   `style`: Sửa format, không ảnh hưởng logic (Formatting, missing semi colons, etc)
    *   `refactor`: Sửa code nhưng không thêm tính năng mới hay sửa lỗi (Code restructuring)
    *   `chore`: Thay đổi cấu hình, build task, không ảnh hưởng code (Update dependencies, etc)

*   **Ví dụ:**
    *   `feat: add google oauth2 login`
    *   `fix: fix null pointer in user service`
    *   `style: format code using prettier`

### 6.3. Quy trình Pull Request (PR)
1.  Checkout từ nhánh `dev` ra nhánh `feature/...`.
2.  Code và Commit.
3.  Push lên Git.
4.  Tạo Pull Request (Merge Request) từ `feature/...` vào `dev`.
5.  **BẮT BUỘC:** Phải có ít nhất 1 người (Tech Lead hoặc thành viên khác) review code và approve mới được merge.
6.  Xóa nhánh `feature` sau khi merge xong.

---

## 7. MÔI TRƯỜNG & TOOLS
*   **IDE Backend:** IntelliJ IDEA (Khuyên dùng) hoặc Eclipse/VS Code.
    *   Cài plugin: *Lombok*, *CheckStyle*.
*   **IDE Frontend:** VS Code.
    *   Cài plugin: *ESLint*, *Prettier*, *Tailwind CSS IntelliSense*.
*   **Java:** JDK 17.
*   **Node:** Node.js 20+.
*   **Docker:** Docker Desktop bật sẵn.

---
**Yêu cầu:** Toàn bộ thành viên trong nhóm đọc kỹ và setup IDE tuân thủ theo các quy chuẩn trên trước khi viết dòng code đầu tiên.