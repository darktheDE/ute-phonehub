# BÁO CÁO KIỂM TRA MÃ NGUỒN VS TÀI LIỆU - MODULE 01

**Module**: 01 - Xác thực & Bảo mật  
**Người thực hiện**: Đỗ Kiến Hưng  
**Thời gian kiểm tra**: 07/01/2026

---

## 1. TỔNG QUAN
Báo cáo này liệt kê kết quả rà soát mã nguồn (Codebase) so với Đặc tả yêu cầu phần mềm (SRS) cho Module 01.

| Chức năng | Trạng thái Code | Đánh giá |
| :--- | :---: | :--- |
| **Đăng ký (Register)** | ⚠️ Không khớp | Logic xác thực email chưa được thực thi đúng quy trình. |
| **Đăng nhập (Login)** | ⚠️ Không khớp | Thiếu cơ chế khóa tài khoản sau 5 lần nhập sai. |
| **Google OAuth2** | ✅ Đạt | Đã cài đặt tự động tạo tài khoản khi login Google. |
| **Quản lý Profile** | ⚠️ Không khớp | Thiếu trường `avatar` (Ảnh đại diện) trong DB và API. |
| **Đổi mật khẩu** | ✅ Đạt | Đã implement đúng logic. |
| **Quên mật khẩu** | ✅ Đạt | Đã implement logic gửi OTP và reset pass. |
| **Sổ địa chỉ** | ✅ Đạt | Đã implement CRUD địa chỉ giao hàng. |

---

## 2. CHI TIẾT CÁC ĐIỂM KHÔNG KHỚP (MISMATCHES)

### 🔴 1. Quy trình Xác thực Email (FR-CLIENT-01 / UC-01)
**Tài liệu mô tả (SRS):**
> "Tài khoản được tạo trong hệ thống với trạng thái 'Chưa kích hoạt'. Email xác thực được gửi đi."

**Hiện trạng Code (`AuthServiceImpl.java`):**
- Phương thức `register` tạo user và set trạng thái **`ACTIVE` ngay lập tức** (Line 79).
- Hệ thống gửi email "Welcome" (`sendRegistrationEmail`) thay vì gửi OTP/Link xác thực (`sendRegistrationOtpEmail`).
- Mặc dù có API `/verify-email`, nhưng luồng đăng ký hiện tại bỏ qua bước này. User có thể đăng nhập ngay sau khi đăng ký mà không cần xác thực email.

**Đề xuất sửa đổi:**
1. Sửa `AuthServiceImpl.register`: Set `status = UserStatus.UNVERIFIED`.
2. Generate OTP và lưu vào Redis.
3. Gọi `emailService.sendRegistrationOtpEmail` thay vì `sendRegistrationEmail`.
4. Logic `login` phải chặn nếu status là `UNVERIFIED`.

### 🔴 2. Cơ chế Khóa tài khoản (BR-AUTH-02)
**Tài liệu mô tả (SRS):**
> "Nếu người dùng nhập sai mật khẩu quá **5 lần liên tiếp**, tài khoản sẽ bị khóa tạm thời trong 30 phút."

**Hiện trạng Code (`AuthServiceImpl.java`):**
- Phương thức `login` chỉ kiểm tra nếu user *đã bị khóa* (`UserStatus.LOCKED`).
- **Không có logic đếm số lần đăng nhập sai**.
- **Không có logic tự động khóa** khi vượt quá số lần cho phép.

**Đề xuất sửa đổi:**
1. Thêm trường `failedLoginAttempts` và `lockTime` vào Redis hoặc DB.
2. Cập nhật `login`:
   - Nếu sai pass: Tăng biến đếm. Nếu đếm >= 5 -> Set `UserStatus.LOCKED`.
   - Nếu đúng pass: Reset biến đếm về 0.

### 🔴 3. Ảnh đại diện (FR-CLIENT-05)
**Tài liệu mô tả (SRS):**
> "Người dùng (Member) có thể xem và cập nhật thông tin cá nhân: Họ tên, Số điện thoại, **Ảnh đại diện**."

**Hiện trạng Code:**
- Entity `User` (Line 15-72) **không có trường** `avatar` hoặc `imageUrl`.
- `UserResponse` DTO **không trả về** thông tin ảnh đại diện.
- `UpdateProfileRequest` DTO **không có trường** để cập nhật ảnh.
- Chưa có API endpoint hỗ trợ upload ảnh cho user (trừ phần Product có upload).

**Đề xuất sửa đổi:**
1. Thêm column `avatar_url` (varchar) vào bảng `users`.
2. Cập nhật `User` entity và `UserResponse`.
3. Bổ sung API upload ảnh (có thể dùng chung logic upload của Product hoặc viết mới `UserImageController`).

---

## 3. CÁC TÍNH NĂNG ĐÃ ĐẠT YÊU CẦU

- **Quản lý địa chỉ (`AddressController`)**: Đã có đầy đủ chức năng Thêm/Sửa/Xóa và Đặt mặc định.
- **Google Login (`CustomOidcUserService`)**: Đã xử lý đúng logic tự động tạo user mới nếu email chưa tồn tại, set default role và cart.
- **Quên mật khẩu**: Logic xác thực OTP qua Redis và Email hoạt động đúng thiết kế.

## 4. KẾT LUẬN
Module 01 đã hoàn thành khoảng **70%** so với đặc tả. Cần ưu tiên khắc phục 3 vấn đề nêu trên để đảm bảo tính bảo mật và đúng nghiệp vụ (nhất là flow Verify Email và Lock Account).
