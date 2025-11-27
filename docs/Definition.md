### **1. Bối cảnh**

UTE Phone Hub là một hệ thống thương mại điện tử chuyên bán điện thoại và phụ kiện. Hệ thống được phát triển theo kiến trúc microservices-frontend (Backend For Frontend - BFF), bao gồm một ứng dụng **Backend** xây dựng trên **Spring Boot 3+** và một ứng dụng **Frontend** độc lập sử dụng **Next.js (React)**.
Website này là website được tham khảo của thegioididong.vn kết hợp với phần admin management, dashboard để admin quản lý

Hệ thống sử dụng **PostgreSQL** làm cơ sở dữ liệu chính, **Redis** cho việc quản lý cache và session, xác thực dựa trên **JWT**, và hỗ trợ đăng nhập nhanh qua **Google OAuth2**.

### **2. Mục tiêu**

- Xây dựng một sản phẩm hoàn chỉnh, áp dụng các công nghệ hiện đại (Spring Boot, Next.js) và quy trình phát triển phần mềm chuyên nghiệp.
- Cung cấp một giao diện người dùng hiện đại, **responsive toàn diện**, và có tính tương tác cao, mang lại trải nghiệm mua sắm mượt mà cho khách hàng.
- Cung cấp cho quản trị viên (admin) một bộ công cụ mạnh mẽ để quản lý vận hành cửa hàng, từ sản phẩm, đơn hàng đến người dùng, và theo dõi hiệu suất qua dashboard.
- Đảm bảo hệ thống có tính bảo mật cao, hiệu năng tốt và kiến trúc rõ ràng để dễ dàng bảo trì và mở rộng trong tương lai.

### **3. Phạm vi**

- **Ứng dụng Frontend (Next.js):** Giao diện cho khách hàng và admin, áp dụng Server-Side Rendering (SSR) để tối ưu SEO và hiệu năng.
- **Ứng dụng Backend (Spring Boot):** Cung cấp API RESTful cho tất cả các chức năng, được tài liệu hóa tự động bằng **OpenAPI (Swagger)**.
- **Hạ tầng:** Đóng gói bằng Docker Compose (app, PostgreSQL, Redis), có health check endpoint và logging tập trung.

### **4. Stakeholders**

- **Khách hàng (Customer/User):** Duyệt, tìm kiếm, so sánh, mua hàng và theo dõi đơn hàng.
- **Quản trị viên (Admin):** Quản lý toàn bộ nội dung và hoạt động của website.
- **Bộ phận vận hành (Ops):** Triển khai, giám sát và bảo trì hệ thống.
- **Bộ phận hỗ trợ (Support):** Sử dụng hệ thống để hỗ trợ và giải đáp thắc mắc cho khách hàng.

### **5. Yêu cầu Chức năng (Functional Requirements)**

### **5.1 Đối với Khách hàng**

- **Tài khoản:** Đăng ký, đăng nhập, đăng nhập qua Google OAuth2, quên mật khẩu (OTP), xác thực email, đổi mật khẩu, cập nhật hồ sơ, quản lý địa chỉ.
- **Sản phẩm:**
    - Xem danh sách sản phẩm (phân trang, lọc, sắp xếp).
    - Xem chi tiết sản phẩm (hình ảnh, thông số kỹ thuật, mô tả).
    - **So sánh sản phẩm:** Cho phép đặt nhiều sản phẩm cạnh nhau để so sánh thông số kỹ thuật.
    - **Gợi ý sản phẩm:** Hiển thị các sản phẩm tương tự hoặc phụ kiện đi kèm.
- **Đánh giá:** Xem đánh giá từ người dùng khác, viết đánh giá và chấm sao (chỉ khi đã mua hàng), like/unlike đánh giá.
- **Giỏ hàng:** Thêm/cập nhật/xóa sản phẩm, duy trì số lượng hiển thị, hỗ trợ guest checkout.
- **Đơn hàng:**
    - Tạo đơn hàng, áp dụng voucher.
    - Thanh toán qua các phương thức: COD, nhận tại cửa hàng, và **tích hợp cổng thanh toán thực tế (VNPay/Momo)**.
    - Xem lịch sử và theo dõi trạng thái đơn hàng.
    - **QR Code:** Nhận mã QR cho mỗi đơn hàng để tra cứu nhanh hoặc xác nhận tại cửa hàng.
- **Tương tác & Hỗ trợ:**
    - **AI Chatbot:** Hỗ trợ trả lời các câu hỏi thường gặp 24/7.

### **5.2 Đối với Quản trị viên**

- **Dashboard:** Tổng quan doanh thu, đơn hàng, người dùng, sản phẩm mới với các biểu đồ và số liệu thống kê trực quan.
- **Sản phẩm:** CRUD sản phẩm, quản lý ảnh, tồn kho, trạng thái (active/inactive), hỗ trợ soft delete.
- **Danh mục/Thương hiệu:** CRUD, quản lý các ràng buộc khi xóa.
- **Đơn hàng:** Xem danh sách, lọc theo trạng thái, xem chi tiết và cập nhật trạng thái đơn hàng.
- **Người dùng:** Xem danh sách, khóa/mở khóa tài khoản, phân quyền.
- **Voucher:** Tạo và quản lý các mã giảm giá với nhiều điều kiện áp dụng.

### **6. Yêu cầu Phi chức năng (Non-Functional Requirements)**

- **Bảo mật:** Sử dụng Spring Security, JWT cho access token (24h) và refresh token (7 ngày), mật khẩu băm BCrypt, rate limit, role-based access control.
- **Hiệu năng:** Thời gian phản hồi API dưới 500ms, sử dụng connection pooling (HikariCP), cache dữ liệu nóng bằng Redis, tối ưu database query với index.
- **Khả năng sử dụng (Usability):** Giao diện phải **responsive toàn diện**, hoạt động mượt mà trên các thiết bị Mobile, Tablet, và Desktop.
- **Khả năng mở rộng (Scalability):** Kiến trúc stateless authentication, container hóa bằng Docker, sẵn sàng cho việc scale theo chiều ngang.
- **Khả năng bảo trì (Maintainability):** Phân tầng kiến trúc rõ ràng, code tuân thủ coding convention, cấu hình qua biến môi trường.

### **7. Ràng buộc và Giả định**

- **Ràng buộc công nghệ:** Backend: **Spring Boot 3+ (Java 17)**. Frontend: **Next.js 14+ (React 18)**. Database: **PostgreSQL 15**. Cache: **Redis 7**.
- **Giả định:**
    - Hệ thống sẽ **tích hợp ít nhất một cổng thanh toán thực tế** (VNPay/Momo) để xử lý giao dịch.
    - Chức năng AI Chatbot sẽ **tích hợp một dịch vụ của bên thứ ba** (ví dụ: [Tawk.to](http://tawk.to/), Dialogflow), không tự xây dựng từ đầu.
    - Người dùng có thể checkout với tư cách khách (không bắt buộc tạo tài khoản).

### **8. Tiêu chí Chấp nhận (Acceptance Criteria) — Mẫu**

- **Đăng nhập/Đăng ký:** Người dùng có thể đăng ký/đăng nhập thành công bằng email hoặc Google. JWT token được tạo và xác thực đúng.
- **Sản phẩm & So sánh:** Danh sách sản phẩm hiển thị đúng với bộ lọc. Chức năng so sánh hiển thị đúng thông số kỹ thuật của các sản phẩm được chọn.
- **Giỏ hàng & Đặt hàng:** Thêm/sửa/xóa giỏ hàng hoạt động chính xác. Khi checkout, hệ thống tạo đơn hàng và **chuyển hướng đến cổng thanh toán VNPay/Momo thành công**, xử lý callback trả về đúng trạng thái.
- **QR Code & Tra cứu:** Mỗi đơn hàng tạo ra một mã QR hợp lệ. Dùng mã này có thể tra cứu ra đúng thông tin đơn hàng.
- **Admin:** Dashboard hiển thị đúng dữ liệu thống kê. Các chức năng CRUD hoạt động đầy đủ.

### **9. KPI/Chỉ số gợi ý**

- P95 API latency: < 300ms cho các API đọc; < 1s cho API tạo đơn hàng.
- Tỷ lệ lỗi 5xx < 0.5% trong môi trường production.
- Thời gian tải trang (First Contentful Paint) < 3 giây trên kết nối 3G.

### **10. Rủi ro & Giảm thiểu**

- **Rủi ro:** Tích hợp bên thứ ba (VNPay, Chatbot) thất bại do API của đối tác thay đổi hoặc không ổn định.
    - **Giảm thiểu:** Xây dựng các lớp trừu tượng (abstract layers) để dễ dàng thay thế nhà cung cấp. Có cơ chế fallback (ví dụ: nếu VNPay lỗi, tạm thời chỉ cho phép COD).
- **Rủi ro:** Redis không sẵn sàng.
    - **Giảm thiểu:** Tạm thời vô hiệu hóa các chức năng phụ thuộc Redis (cache, giỏ hàng của guest) nhưng vẫn đảm bảo các luồng chính (đặt hàng cho user đã đăng nhập) hoạt động.
- **Rủi ro:** Rò rỉ token.
    - **Giảm thiểu:** Bắt buộc HTTPS, sử dụng httpOnly/secure cookie cho refresh token, triển khai cơ chế blacklist token khi logout.