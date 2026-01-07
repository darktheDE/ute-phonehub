# UTE Phone Hub - Modern E-commerce Platform

**UTE Phone Hub** là một nền tảng thương mại điện tử chuyên kinh doanh điện thoại di động và phụ kiện, được xây dựng với kiến trúc **Monolithic (Modular)** hiện đại, tách biệt hoàn toàn giữa **Frontend (Next.js)** và **Backend (Spring Boot)** theo mô hình **BFF (Backend For Frontend)**.

Dự án được phát triển nhằm cung cấp trải nghiệm mua sắm trực tuyến mượt mà, bảo mật và hiệu năng cao, tích hợp các công nghệ tiên tiến nhất năm 2025-2026.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### Backend (Server-side)
*   **Core**: Java 17, Spring Boot 3.5.8
*   **Security**: Spring Security 6, JWT (Stateless), OAuth2 (Google Login)
*   **Database**: PostgreSQL 15 (Primary), Redis 7 (Caching, Session, Cart)
*   **ORM**: Spring Data JPA (Hibernate)
*   **API**: RESTful API, OpenAPI (Swagger) 3.0
*   **Build Tool**: Maven

### Frontend (Client-side)
*   **Framework**: Next.js 16.0.7 (App Router), React 19
*   **Language**: TypeScript 5
*   **Styling**: Tailwind CSS 4, Shadcn/UI (Radix UI)
*   **State Management**: Zustand
*   **Data Fetching**: Axios, SWR
*   **Form**: React Hook Form, Zod

### Infrastructure & Tools
*   **Containerization**: Docker, Docker Compose
*   **Payment**: VNPay Integration
*   **Chatbot**: Tawk.to / AI Chatbot Integration
*   **Mail**: Google SMTP

---

## ✨ Tính Năng Chính (Features)

### 👤 Khách Hàng (User)
*   **Xác thực**: Đăng ký, Đăng nhập (Email/Password), **Đăng nhập nhanh bằng Google**, Quên mật khẩu.
*   **Sản phẩm**: Tìm kiếm (tên, hãng), Lọc nâng cao (giá, cấu hình), Xem chi tiết, **So sánh sản phẩm**.
*   **Mua sắm**: Giỏ hàng (lưu Redis), Thanh toán **VNPay/Momo** hoặc COD, Áp dụng Voucher.
*   **Tương tác**: Đánh giá sản phẩm, Tra cứu đơn hàng (User & Guest), **Quét mã QR đơn hàng**.
*   **Hỗ trợ**: Chatbot AI tư vấn.

### 🛡️ Quản Trị Viên (Admin)
*   **Dashboard**: Thống kê doanh thu, đơn hàng, khách hàng mới theo thời gian thực.
*   **Quản lý Sản phẩm**: Thêm/Sửa/Xóa (Soft delete), Quản lý kho, Hình ảnh, Cấu hình.
*   **Quản lý Đơn hàng**: Duyệt đơn, Cập nhật trạng thái, In hóa đơn.
*   **Quản lý Hệ thống**: User (Phân quyền/Khóa), Voucher (Khuyến mãi).

---

## 🛠️ Yêu Cầu Cài Đặt (Prerequisites)

Để chạy dự án, bạn cần cài đặt các công cụ sau:
*   [Java JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)
*   [Node.js 20+](https://nodejs.org/) (Khuyến nghị bản LTS)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
*   [Git](https://git-scm.com/)

---

## 📥 Hướng Dẫn Cài Đặt & Chạy (Installation)

### 1. Clone Project
```bash
git clone https://github.com/darktheDE/ute-phonehub.git
cd ute-phonehub
```

### 2. Cấu Hình & Chạy Backend (Docker)
Chúng tôi khuyến khích chạy Backend và Database bằng Docker Compose để đảm bảo môi trường đồng nhất.

1.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```

2.  Tạo file cấu hình môi trường:
    ```bash
    # Trên Windows (PowerShell)
    copy .env.example .env
    # Trên Linux/Mac
    cp .env.example .env
    ```

3.  Cập nhật file `.env` với thông tin của bạn (Google Client ID, VNPay, Mail, etc.). *Nếu chỉ chạy test local cơ bản, bạn có thể giữ nguyên các cấu hình Database/Redis mặc định.*

4.  Khởi chạy hệ thống (Database + Redis + Backend):
    ```bash
    docker-compose up -d --build
    ```
    *Lệnh này sẽ tự động khởi tạo database, chạy migration và start server tại port `8081`.*

### 3. Cấu Hình & Chạy Frontend
1.  Mở một terminal mới, di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```

2.  Tạo file môi trường (Nếu chưa có):
    Tạo file `.env.local` với nội dung sau:
    ```properties
    NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
    ```

3.  Cài đặt dependencies:
    ```bash
    npm install
    ```

4.  Chạy server development:
    ```bash
    npm run dev
    ```

🚀 **Frontend sẽ chạy tại:** [http://localhost:3000](http://localhost:3000)

---

## 📚 Tài Liệu API (Documentation)

Sau khi chạy Backend thành công, bạn có thể truy cập tài liệu API đầy đủ (Swagger UI) tại:

👉 **[http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)**

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```
ute-phonehub/
├── backend/                # Mã nguồn Backend (Spring Boot)
│   ├── src/main/java       # Source code Java
│   ├── src/main/resources  # Configs, SQL Migrations
│   ├── Dockerfile          # Config Docker Backend
│   └── docker-compose.yml  # Config Docker Compose (Full Stack infra)
├── frontend/               # Mã nguồn Frontend (Next.js)
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # React Components (Shadcn/UI)
│   ├── services/           # API Services (Axios)
│   └── store/              # Zustand State Management
├── docs/                   # Tài liệu dự án (SRS, Diagrams, Convention)
└── .cursor/                # Config & Docs cho AI Agent (Cursor)
```

---

## 🤝 Đóng Góp (Contributing)

1.  **Fork** dự án.
2.  Tạo branch feature mới (`git checkout -b feature/AmazingFeature`).
3.  Commit thay đổi (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên branch (`git push origin feature/AmazingFeature`).
5.  Tạo **Pull Request**.

---

## 📝 License

Dự án này được bảo hộ bởi giấy phép [MIT](LICENSE).

---
**UTE Phone Hub Team** - *CNPM HK5 @ HCMUTE*
