# CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT STRUCTURE) - UTE PHONE HUB

Tài liệu này mô tả chi tiết cấu trúc thư mục của dự án **UTE Phone Hub** theo đúng trạng thái hiện tại, dựa trên Tech Stack đã chọn (Spring Boot 3.5.8 & Next.js 15.5.6).

## 1. Cấu trúc Tổng thể (Root Directory)

Dự án được tổ chức theo mô hình **Monorepo**, chứa cả Backend và Frontend trong cùng một repository để dễ dàng quản lý và đồng bộ.

```
ute-phonehub/
├── .git/                   # Git repository
├── .github/                # GitHub configuration
│   └── copilot-instructions.md  # GitHub Copilot guidelines
├── .gitignore              # File cấu hình git ignore
├── .vscode/                # VS Code settings
├── backend/                # Mã nguồn Backend (Spring Boot)
├── frontend/               # Mã nguồn Frontend (Next.js)
├── docs/                   # Tài liệu dự án (SRS, Design, API, Conventions)
└── README.md               # Hướng dẫn tổng quan dự án
```



---

## 2. Backend (Spring Boot)

Backend được xây dựng theo kiến trúc **Layered Architecture** (Kiến trúc phân lớp) chuẩn của Spring Boot, đảm bảo sự tách biệt giữa các thành phần xử lý request, nghiệp vụ và truy xuất dữ liệu.

**Đường dẫn gốc:** `backend/src/main/java/com/utephonehub/backend/`

```
backend/
├── .gitattributes
├── .gitignore
├── .mvn/                           # Maven wrapper files
├── docker-compose.yml              # Docker Compose configuration (DB + Redis + App)
├── Dockerfile                      # Cấu hình build Docker image cho Backend
├── DOCS/                           # Backend documentation
│   ├── ClassDiagram-UTEPhoneHub.png
│   ├── DATABASE.md                 # Database documentation
│   ├── ERD - UTEPhoneHub.png      # Entity Relationship Diagram
│   ├── UseCaseDiagram-UTEPhoneHub.png
│   └── usecase/                    # Use case documents (M01-M10)
│       ├── M01.md
│       ├── M02.md
│       ├── M03.md
│       ├── M04_1.md
│       ├── M04_2.md
│       ├── M05.md
│       ├── M06.md
│       ├── M07.md
│       ├── M08.md
│       ├── M09.md
│       └── M10.md
├── HELP.md
├── mvnw                            # Maven wrapper script (Unix)
├── mvnw.cmd                        # Maven wrapper script (Windows)
├── pom.xml                         # Quản lý thư viện Maven & Build configuration
├── src/
│   ├── main/
│   │   ├── java/com/utephonehub/backend/
│   │   │   ├── config/             # Cấu hình hệ thống (Security, JWT, CORS...)
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/         # Tiếp nhận Request & trả về Response (API Layer)
│   │   │   ├── dto/                # Data Transfer Objects (Đối tượng chuyển đổi dữ liệu)
│   │   │   │   ├── ApiResponse.java    # Wrapper cho API response
│   │   │   │   ├── request/            # DTO cho dữ liệu đầu vào (Input)
│   │   │   │   └── response/           # DTO cho dữ liệu đầu ra (Output)
│   │   │   ├── entity/             # JPA Entities (Ánh xạ bảng Database)
│   │   │   │   ├── Address.java
│   │   │   │   ├── Brand.java
│   │   │   │   ├── Cart.java
│   │   │   │   ├── CartItem.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── ProductImage.java
│   │   │   │   ├── Review.java
│   │   │   │   ├── ReviewLike.java
│   │   │   │   ├── User.java
│   │   │   │   └── Voucher.java
│   │   │   ├── enums/              # Enum types
│   │   │   │   ├── DiscountType.java
│   │   │   │   ├── OrderStatus.java
│   │   │   │   ├── PaymentMethod.java
│   │   │   │   ├── UserRole.java
│   │   │   │   ├── UserStatus.java
│   │   │   │   └── VoucherStatus.java
│   │   │   ├── exception/          # Xử lý lỗi tập trung (Global Exception Handling)
│   │   │   │   ├── BadRequestException.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── UnauthorizedException.java
│   │   │   ├── mapper/             # Chuyển đổi giữa Entity và DTO (MapStruct)
│   │   │   │   ├── AddressMapper.java
│   │   │   │   └── UserMapper.java
│   │   │   ├── repository/         # Giao tiếp với Database (Data Access Layer)
│   │   │   │   ├── AddressRepository.java
│   │   │   │   ├── BrandRepository.java
│   │   │   │   ├── CartRepository.java
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── ReviewRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── VoucherRepository.java
│   │   │   ├── service/            # Xử lý nghiệp vụ (Business Logic Layer)
│   │   │   │   ├── IAddressService.java
│   │   │   │   ├── IAuthService.java
│   │   │   │   ├── IEmailService.java
│   │   │   │   ├── IUserService.java
│   │   │   │   └── impl/           # Triển khai chi tiết các Service
│   │   │   │       ├── AddressServiceImpl.java
│   │   │   │       ├── AuthServiceImpl.java
│   │   │   │       ├── EmailServiceImpl.java
│   │   │   │       └── UserServiceImpl.java
│   │   │   ├── util/               # Các hàm tiện ích dùng chung (Helper)
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── OtpGenerator.java
│   │   │   │   ├── PasswordEncoder.java
│   │   │   │   └── SecurityUtils.java
│   │   │   └── UtePhonehubBackendApplication.java # Class chạy ứng dụng
│   │   │
│   │   └── resources/
│   │       ├── application.yaml    # File cấu hình chính (DB, Port, Logging...)
│   │       ├── static/             # Tài liệu tĩnh (nếu có)
│   │       └── templates/          # Email templates (nếu có)
│   │
│   └── test/                       # Unit Tests & Integration Tests
│       └── java/com/utephonehub/backend/
│           └── UtePhonehubBackendApplicationTests.java
└── target/                         # Maven build output (gitignored)
    ├── classes/
    ├── generated-sources/
    ├── generated-test-sources/
    ├── maven-status/
    └── test-classes/
```



### **Giải thích chức năng các thư mục Backend:**

*   **`config/`**: Chứa các class cấu hình (`@Configuration`). Ví dụ: `SecurityConfig` (phân quyền), `OpenApiConfig` (Swagger), `CorsConfig` (cho phép Frontend gọi API), `JwtAuthenticationFilter` (xác thực JWT).
*   **`controller/`**: Nơi định nghĩa các API Endpoints (`@RestController`). Chỉ làm nhiệm vụ nhận request, gọi Service xử lý và trả về kết quả. **Không chứa logic nghiệp vụ**.
*   **`dto/`**: Chứa các class POJO đơn giản để truyền dữ liệu. `ApiResponse.java` là wrapper chung cho response. `request/` chứa DTO đầu vào, `response/` chứa DTO đầu ra. Giúp ẩn giấu cấu trúc Entity thực tế và chỉ trả về dữ liệu cần thiết cho Client.
*   **`entity/`**: Các class đại diện cho bảng trong Database (`@Entity`). Được quản lý bởi Hibernate/JPA. Bao gồm: User, Product, Order, Cart, Review, Address, Brand, Category, Voucher, etc.
*   **`enums/`**: Chứa các enum type định nghĩa các giá trị cố định như `UserRole`, `OrderStatus`, `PaymentMethod`, `DiscountType`, `VoucherStatus`, `UserStatus`.
*   **`exception/`**: Chứa `GlobalExceptionHandler` (`@ControllerAdvice`) để bắt các lỗi (Exception) ném ra từ Service và trả về thông báo lỗi chuẩn JSON cho Client. Các custom exception: `ResourceNotFoundException`, `BadRequestException`, `UnauthorizedException`.
*   **`mapper/`**: Sử dụng thư viện **MapStruct** để tự động copy dữ liệu giữa Entity và DTO, giúp code gọn gàng hơn so với việc set thủ công.
*   **`repository/`**: Các Interface kế thừa `JpaRepository`, cung cấp các hàm CRUD và truy vấn Database.
*   **`service/`**: Chứa logic nghiệp vụ chính của hệ thống (tính toán, kiểm tra điều kiện, gọi Repository). Nên dùng Interface và Class `Impl` để dễ mở rộng và test.
*   **`util/`**: Các hàm hỗ trợ dùng chung như xử lý JWT (`JwtTokenProvider`), mã hóa password (`PasswordEncoder`), tạo OTP (`OtpGenerator`), và các tiện ích security (`SecurityUtils`).
*   **`DOCS/`**: Chứa tài liệu về database, use case, class diagram, ERD cho Backend.

---

## 3. Frontend (Next.js App Router)

Frontend sử dụng **Next.js 15** với **App Router**, cấu trúc thư mục tập trung vào tính năng và khả năng tái sử dụng component.

**Đường dẫn gốc:** `frontend/`

```
frontend/
├── .gitignore
├── .next/                      # Next.js build output (gitignored)
├── app/                        # App Router (Chứa các Pages & Layouts)
│   ├── (admin)/                # Route Group cho trang quản trị (Admin Dashboard)
│   │   ├── layout.tsx          # Layout riêng cho Admin (Sidebar, Admin Header)
│   │   └── manage/             # Các trang quản lý
│   │       └── page.tsx        # Admin management page
│   ├── (auth)/                 # Route Group cho xác thực (Login, Register...)
│   │   ├── layout.tsx          # Layout riêng cho trang Auth (không có Header/Footer chính)
│   │   ├── forgot-password/    # Trang quên mật khẩu
│   │   │   └── page.tsx
│   │   ├── login/              # Trang đăng nhập
│   │   │   └── page.tsx
│   │   └── register/           # Trang đăng ký
│   │       └── page.tsx
│   ├── (main)/                 # Route Group cho trang người dùng (Public)
│   │   ├── layout.tsx          # Layout chính (Header, Footer)
│   │   └── page.tsx            # Trang chủ (Home Page)
│   ├── favicon.ico             # Website favicon
│   ├── globals.css             # File CSS toàn cục (Tailwind Directives)
│   └── layout.tsx              # Root Layout (Chứa Font, Metadata chung)
│
├── components/                 # Thư viện Components
│   ├── common/                 # Components dùng chung (Header, Footer)
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── index.ts
│   ├── features/               # Components theo tính năng
│   │   ├── auth/               # Authentication components
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── index.ts
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── SocialLogin.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CustomerAddresses.tsx
│   │   │   ├── CustomerProfile.tsx
│   │   │   ├── CustomerWishlist.tsx
│   │   │   ├── index.ts
│   │   │   ├── OrdersTable.tsx
│   │   │   ├── ProductsTable.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── UsersTable.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── index.ts
│   │   │   ├── MainHeader.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── FlashSaleSection.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── index.ts
│   │   └── ProductCard.tsx
│   └── ui/                     # Atomic Components (Button, Input, Modal...) - Shadcn/UI
│       └── button.tsx
│
├── components.json             # Shadcn/UI configuration
├── DOCS/                       # Frontend documentation
│   └── wireframe/              # UI wireframes
│       └── admin/
├── eslint.config.mjs           # ESLint configuration
├── hooks/                      # Custom React Hooks
│   ├── index.ts
│   ├── useAuth.ts
│   └── useFormValidation.ts
├── lib/                        # Cấu hình & Tiện ích cốt lõi
│   ├── api.ts                  # Cấu hình Axios instance (Base URL, Interceptors)
│   ├── auth-context.tsx        # Context API cho Authentication
│   ├── constants/              # Constants
│   │   ├── index.ts
│   │   ├── routes.ts           # Route constants
│   │   └── status.ts           # Status constants
│   ├── mockData.ts             # Mock data for development
│   ├── utils/                  # Utility functions
│   │   ├── formatters.ts       # Format currency, date, etc.
│   │   ├── index.ts
│   │   └── validators.ts       # Validation helpers
│   └── utils.ts                # Main utilities (cn for Tailwind, etc.)
│
├── next-env.d.ts               # Next.js TypeScript declarations
├── next.config.ts              # Cấu hình Next.js
├── node_modules/               # NPM packages (gitignored)
├── package-lock.json           # NPM lock file
├── package.json                # Quản lý thư viện NPM
├── postcss.config.mjs          # PostCSS configuration
├── public/                     # Tài nguyên tĩnh (Images, Fonts, Icons)
├── README.md                   # Frontend documentation
├── store/                      # Quản lý State toàn cục (Zustand Store)
│   ├── cartStore.ts            # Cart state management
│   ├── index.ts
│   └── wishlistStore.ts        # Wishlist state management
├── tsconfig.json               # TypeScript configuration
└── types/                      # TypeScript Interfaces/Types (Đồng bộ với Backend DTO)
    ├── api.d.ts                # API types
    ├── auth.d.ts               # Auth types
    ├── cart.d.ts               # Cart types
    ├── index.ts
    ├── user.d.ts               # User types
    └── wishlist.d.ts           # Wishlist types
```


### **Giải thích chức năng các thư mục Frontend:**

*   **`app/`**: Thư mục chính của Next.js App Router. Mỗi thư mục con bên trong là một đường dẫn (URL).
    *   **Route Groups `(...)`**: Giúp tổ chức các trang có cùng Layout mà không ảnh hưởng đến URL (ví dụ: `(auth)/login` vẫn truy cập bằng `/login`).
    *   **`layout.tsx`**: Định nghĩa giao diện chung cho các trang con (Header, Footer, Sidebar).
    *   **`page.tsx`**: Nội dung chính của một trang.
*   **`components/ui/`**: Chứa các thành phần giao diện nhỏ nhất, có thể tái sử dụng cao (Button, Input, Modal). Thường được tạo bởi **Shadcn/UI**.
*   **`components/common/`**: Components dùng chung cho toàn ứng dụng như Header, Footer.
*   **`components/features/`**: Chứa các component lớn hơn, gắn liền với nghiệp vụ cụ thể, được nhóm theo tính năng:
    *   **`auth/`**: Components liên quan đến xác thực (LoginForm, RegisterForm, ForgotPasswordForm, SocialLogin)
    *   **`dashboard/`**: Components cho trang dashboard (Admin và Customer)
    *   **`layout/`**: Components layout như MainHeader, Sidebar, MobileMenu, TopBar
    *   Các components khác: ProductCard, HeroBanner, FlashSaleSection, FeaturesSection, FeaturedProducts
*   **`lib/`**: Chứa các file cấu hình thư viện bên thứ 3 và các hàm tiện ích thuần túy (không chứa React Component).
    *   **`api.ts`**: Cấu hình Axios cho việc gọi API
    *   **`auth-context.tsx`**: Context cho authentication state
    *   **`constants/`**: Chứa các hằng số (routes, status)
    *   **`utils/`**: Các hàm tiện ích (formatters, validators)
    *   **`utils.ts`**: Hàm tiện ích chính (cn cho Tailwind class merging)
    *   **`mockData.ts`**: Dữ liệu giả cho development
*   **`hooks/`**: Chứa các logic React được tách ra để tái sử dụng (ví dụ: `useAuth` để kiểm tra đăng nhập, `useFormValidation` để validate form).
*   **`store/`**: Sử dụng **Zustand** để quản lý trạng thái toàn cục của ứng dụng (Giỏ hàng - `cartStore`, Wishlist - `wishlistStore`).
*   **`types/`**: Định nghĩa các kiểu dữ liệu (Interface) của TypeScript. Rất quan trọng để đảm bảo dữ liệu từ Backend trả về khớp với Frontend. Bao gồm: api, auth, cart, user, wishlist types.
*   **`public/`**: Tài nguyên tĩnh như images, fonts, icons.
*   **`DOCS/`**: Tài liệu frontend như wireframes.

---

## 4. Tài liệu Dự án (Documentation)

**Đường dẫn:** `docs/`

```
docs/
├── CONVENTIONS.md              # Quy ước coding, naming conventions
├── ROLE.md                     # Vai trò và phân công team
├── SRS.md                      # Software Requirements Specification
├── STRUCTURE.md                # Tài liệu này - cấu trúc project
└── TECHSTACK.md                # Chi tiết về tech stack sử dụng
```

---

## 5. Quy trình Đồng bộ (Sync Workflow)

1.  **Backend First:** Định nghĩa Entity -> Viết API -> Test trên Swagger (`http://localhost:8081/swagger-ui/index.html`).
2.  **Type Sync:** Frontend dựa vào Swagger/DTO của Backend để tạo file `types/*.ts` tương ứng.
3.  **API Service Layer:** Frontend viết hàm gọi API trong `lib/api.ts` và các service functions.
4.  **State Management:** Nếu cần state toàn cục, tạo store trong `store/` bằng Zustand.
5.  **Component Assembly:** Cuối cùng, Frontend ghép nối UI (`components`) với dữ liệu từ API và `store`.

---

## 6. Chạy Dự án (How to Run)

### Backend:
```bash
cd backend
docker-compose up -d --build
```
- Backend API: `http://localhost:8081`
- Swagger UI: `http://localhost:8081/swagger-ui/index.html`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
- Frontend App: `http://localhost:3000`

---

## 7. Lưu ý quan trọng

- **Không có thư mục `src/` trong frontend** - Next.js 15 App Router không cần thiết phải dùng `src/`
- **Backend có folder `enums/`** riêng để chứa các enum types
- **Frontend không có folder `services/`** riêng - API calls được quản lý trong `lib/api.ts`
- **Backend docker-compose.yml** nằm trong folder backend, không ở root
- **Backend DOCS/** và **Frontend DOCS/** là 2 folder tài liệu riêng biệt cho từng phần của dự án