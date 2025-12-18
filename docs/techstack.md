### **1. Backend (Server-side)**

- **Java 17:** Ngôn ngữ lập trình chính. Phiên bản LTS (Long Term Support) ổn định, hiệu năng cao.
- **Spring Boot 3.5.8:** Framework cốt lõi giúp phát triển ứng dụng nhanh chóng, tự động cấu hình (auto-configuration).
- **Spring Security:** Module bảo mật mạnh mẽ, xử lý xác thực (Authentication) và phân quyền (Authorization).
- **Spring Data JPA (Hibernate):** ORM Framework giúp thao tác với cơ sở dữ liệu thông qua Java Object thay vì viết SQL thủ công.
- **Maven:** Công cụ quản lý thư viện (dependencies) và build dự án.
- **MapStruct:** Thư viện giúp tự động chuyển đổi dữ liệu giữa Entity (Database) và DTO (API) để code gọn gàng hơn.
- **OpenAPI (Swagger):** Tự động sinh tài liệu API và giao diện test API trực quan.

### **2. Frontend (Client-side)**

- **Next.js 16.0.7 (App Router):** Framework React số 1 hiện nay. Hỗ trợ Server-Side Rendering (SSR) giúp SEO tốt và tải trang nhanh.
- **React 19:** Thư viện JS để xây dựng giao diện người dùng (UI) dựa trên Component.
- **TypeScript 5:** Phiên bản nâng cao của JavaScript, giúp bắt lỗi kiểu dữ liệu ngay khi code, giảm thiểu bug runtime.
- **Tailwind CSS 4:** Framework CSS dạng utility-first, giúp style giao diện cực nhanh mà không cần viết file CSS riêng.
- **Shadcn/UI:** Bộ thư viện component giao diện (Button, Input, Dialog...) đẹp, hiện đại và dễ tùy biến.
- **Axios:** Thư viện thực hiện các HTTP Request (gọi API) tới Backend.
- **Zustand (hoặc Redux Toolkit):** Quản lý trạng thái (State Management) phía Client (ví dụ: trạng thái giỏ hàng, thông tin user).

### **3. Database & Storage (Lưu trữ)**

- **PostgreSQL 15+:** Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) chính. Lưu trữ User, Sản phẩm, Đơn hàng, v.v.
- **Redis 7+:** Cơ sở dữ liệu In-memory siêu tốc. Dùng để:
    - Lưu trữ thông tin phiên đăng nhập (Session/Token Blacklist).
    - Lưu trữ giỏ hàng tạm thời.
    - Caching dữ liệu sản phẩm để giảm tải cho Database chính.

### **4. Security & Authentication (Bảo mật)**

- **JWT (JSON Web Token):** Cơ chế xác thực không trạng thái (Stateless). Sử dụng Access Token (ngắn hạn) và Refresh Token (dài hạn).
- **BCrypt:** Thuật toán băm (hashing) mật khẩu an toàn trước khi lưu vào Database.
- **Google OAuth2:** Giao thức cho phép người dùng đăng nhập bằng tài khoản Google mà không cần tạo mật khẩu mới.

### **5. Infrastructure & DevOps (Hạ tầng)**

- **Docker:** Đóng gói ứng dụng (Containerization) để đảm bảo môi trường chạy giống nhau trên mọi máy.
- **Docker Compose:** Công cụ định nghĩa và khởi chạy đa dịch vụ (Backend + Frontend + DB + Redis) chỉ với 1 lệnh.

### **6. Integration (Tích hợp bên thứ 3)**

- **VNPay API:** Cổng thanh toán điện tử.
- **Google SMTP:** Dịch vụ gửi email tự động (Xác thực tài khoản, Quên mật khẩu).
- **Chatbot Service ([Tawk.to](http://tawk.to/) / Dialogflow):** Dịch vụ Chatbot AI nhúng vào website.