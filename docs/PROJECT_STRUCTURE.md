# TÀI LIỆU CẤU TRÚC THƯ MỤC DỰ ÁN - UTE PHONE HUB

## 1. Cấu trúc Thư mục Gốc (Root Directory)

Chúng ta sử dụng mô hình **Monorepo** để quản lý toàn bộ mã nguồn.

```
ute-phonehub/
├── backend/  # Mã nguồn Spring Boot 3.5.8
├── frontend/ # Mã nguồn Next.js 15.5.6 (React 19)
├── docker/   # Cấu hình hạ tầng (Postgres, Redis)
├── docs/                   # Tài liệu dự án (SRS, Diagrams, API)
├── .gitignore              # Git ignore toàn cục
├── README.md               # Hướng dẫn cài đặt & chạy dự án
└── docker-compose.yml      # Orchestration cho toàn bộ hệ thống

```

---

## 2. Cấu trúc Backend (Spring Boot 3.5.8)

Backend chạy trên Port **8081**, sử dụng **Java 17**.

**Đường dẫn:** `ute-phonehub/backend/`

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/ute/phonehub/
│   │   │   ├── config/             # Cấu hình hệ thống
│   │   │   │   ├── OpenAPIConfig.java  # Cấu hình SpringDoc (Swagger UI)
│   │   │   │   ├── SecurityConfig.java # Cấu hình Spring Security + OAuth2
│   │   │   │   ├── RedisConfig.java    # Cấu hình Cache
│   │   │   │   └── CorsConfig.java     # Cho phép Frontend gọi API
│   │   │   │
│   │   │   ├── controller/         # REST Controllers (API Endpoints)
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── request/        # Dữ liệu đầu vào (Validation annotations ở đây)
│   │   │   │   └── response/       # Dữ liệu đầu ra (APIResponse chuẩn)
│   │   │   ├── entity/             # JPA Entities (Ánh xạ bảng DB)
│   │   │   ├── repository/         # Interface JpaRepository
│   │   │   ├── service/            # Business Logic Interfaces
│   │   │   │   └── impl/           # Service Implementations
│   │   │   ├── exception/          # Global Exception Handling
│   │   │   ├── mapper/             # MapStruct Mappers (Entity <-> DTO)
│   │   │   ├── util/               # Tiện ích (JWTUtils, StringUtils)
│   │   │   └── validation/         # Custom Validators
│   │   │
│   │   └── resources/
│   │       ├── application.yml     # Cấu hình chính (DB, Mail, OAuth2)
│   │       ├── messages.properties # Thông báo lỗi tùy chỉnh
│   │       └── static/             # (Để trống - vì dùng Next.js riêng)
│   │
│   └── test/                       # Unit Tests
├── Dockerfile                      # Base image: eclipse-temurin:17-jre-alpine
└── pom.xml                         # Dependencies (Spring Boot 3.5.8)

```

---

## 3. Cấu trúc Frontend (Next.js 15 + Tailwind 4)

**Đường dẫn:** `ute-phonehub/frontend/`

```
frontend/
├── public/                     # Assets tĩnh (Images, Fonts)
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (auth)/             # Route Group: Login, Register (Layout riêng)
│   │   ├── (main)/             # Route Group: Home, Product, Cart (Layout chung)
│   │   ├── (admin)/            # Route Group: Admin Dashboard (Layout quản trị)
│   │   ├── api/                # Route Handlers (nếu cần Proxy API)
│   │   ├── globals.css         # Cấu hình Tailwind 4 (@import "tailwindcss";)
│   │   ├── layout.tsx          # Root Layout
│   │   └── page.tsx            # Landing Page
│   │
│   ├── components/             # UI Components
│   │   ├── ui/                 # Atomic Components (Button, Input) - Shadcn/UI
│   │   ├── common/             # Header, Footer, Sidebar
│   │   └── features/           # Component nghiệp vụ (ProductCard, LoginForm)
│   │
│   ├── lib/                    # Thư viện & Cấu hình
│   │   ├── axios.ts            # Cấu hình Axios (BaseURL, Interceptors)
│   │   └── utils.ts            # cn() function cho Tailwind
│   │
│   ├── hooks/                  # Custom Hooks (useAuth, useCart)
│   ├── services/               # API Calls (tách biệt khỏi Component)
│   ├── types/                  # TypeScript Interfaces (Đồng bộ với Backend DTO)
│   └── store/                  # State Management (Zustand)
│
├── .env.local                  # Biến môi trường (NEXT_PUBLIC_API_URL)
├── next.config.ts              # Cấu hình Next.js 15 (Typed config)
├── postcss.config.mjs          # Cấu hình PostCSS (Bắt buộc cho Tailwind 4)
├── eslint.config.mjs           # Cấu hình ESLint 9 (Flat Config)
├── components.json             # Cấu hình Shadcn/UI
├── package.json                # Dependencies
└── tsconfig.json               # Cấu hình TypeScript

```

## 4. Cấu trúc Hạ tầng (Docker)

**Đường dẫn:** `ute-phonehub/docker/`

```
docker/
├── postgres/
│   ├── init.sql                # Script tạo DB ban đầu (nếu cần)
│   └── data/                   # (Gitignore) Persist data
├── redis/
│   └── redis.conf              # Cấu hình Redis (nếu cần chỉnh eviction policy)
└── nginx/
    └── nginx.conf              # Cấu hình Reverse Proxy (cho Production)

```

## 5. Quy trình Đồng bộ (Sync Workflow)

Để đảm bảo 10 thành viên Fullstack làm việc trơn tru:

1. **Bước 1 (Backend):** Tạo Entity -> Tạo DTO -> Viết Controller -> **Chạy App để sinh Swagger**.
2. **Bước 2 (Contract):** Team thống nhất JSON Response dựa trên Swagger.
3. **Bước 3 (Frontend):**
    - Vào `src/types/` tạo file definition (`user.d.ts`, `product.d.ts`) khớp với DTO Backend.
    - Vào `src/services/` viết hàm gọi API (`authService.ts`).
    - Vào `src/components/` xây dựng giao diện và gắn dữ liệu.

---