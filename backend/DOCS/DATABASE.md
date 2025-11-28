# TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU
**DỰ ÁN: UTE PHONE HUB**
**Phiên bản:** 1.0
**Hệ quản trị:** PostgreSQL 15

## 1. Tổng quan
Mô hình dữ liệu bao gồm **13 bảng**, chia thành các nhóm chức năng: Người dùng, Sản phẩm, Đơn hàng, Giỏ hàng và Tương tác.

## 2. Chi tiết các bảng (Tables)

### 2.1. Nhóm Người dùng & Định danh

#### `users` (Người dùng)
Lưu trữ thông tin tài khoản của khách hàng và quản trị viên.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID duy nhất của người dùng. |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Tên đăng nhập. |
| full_name | VARCHAR(100) | NOT NULL | Họ và tên đầy đủ. |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Địa chỉ email (dùng để đăng nhập/liên lạc). |
| password_hash | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa. |
| phone_number | VARCHAR(15) | | Số điện thoại cá nhân. |
| role | VARCHAR(20) | NOT NULL | Vai trò (ADMIN, CUSTOMER). |
| status | VARCHAR(20) | NOT NULL | Trạng thái (ACTIVE, LOCKED). |
| created_at | TIMESTAMP | DEFAULT NOW() | Thời gian tạo tài khoản. |
| updated_at | TIMESTAMP | DEFAULT NOW() | Thời gian cập nhật gần nhất. |

#### `addresses` (Sổ địa chỉ)
Lưu trữ danh sách địa chỉ giao hàng của người dùng.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID địa chỉ. |
| user_id | BIGINT | FK -> users(id) | Liên kết với người dùng. |
| recipient_name | VARCHAR(100) | NOT NULL | Tên người nhận hàng. |
| phone_number | VARCHAR(15) | NOT NULL | Số điện thoại người nhận. |
| street_address | TEXT | NOT NULL | Địa chỉ cụ thể (số nhà, đường). |
| ward | VARCHAR(100) | | Tên Phường/Xã. |
| ward_code | VARCHAR(20) | | Mã Phường/Xã (Dùng cho API Ship). |
| province | VARCHAR(100) | | Tên Tỉnh/Thành phố. |
| province_code | VARCHAR(20) | | Mã Tỉnh/Thành phố. |
| is_default | BOOLEAN | DEFAULT FALSE | Là địa chỉ mặc định? |
| created_at | TIMESTAMP | | Thời gian tạo. |
| updated_at | TIMESTAMP | | Thời gian cập nhật. |

---

### 2.2. Nhóm Sản phẩm & Danh mục

#### `products` (Sản phẩm)
Bảng trung tâm lưu trữ thông tin sản phẩm.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID sản phẩm. |
| name | VARCHAR(255) | NOT NULL | Tên sản phẩm. |
| description | TEXT | | Mô tả chi tiết sản phẩm (HTML/Markdown). |
| price | DECIMAL(15,2)| NOT NULL | Giá bán hiện tại. |
| stock_quantity | INTEGER | NOT NULL, DEFAULT 0 | Số lượng tồn kho. |
| thumbnail_url | VARCHAR(255)| | URL ảnh đại diện sản phẩm (hiển thị list). |
| specifications | JSONB | | Lưu thông số kỹ thuật (RAM, ROM, Chip...). |
| status | BOOLEAN | DEFAULT TRUE | Trạng thái (True: Đang bán, False: Ngừng KD). |
| category_id | BIGINT | FK -> categories(id)| Thuộc danh mục nào. |
| brand_id | BIGINT | FK -> brands(id) | Thuộc thương hiệu nào. |
| created_at | TIMESTAMP | | Thời gian tạo. |
| updated_at | TIMESTAMP | | Thời gian cập nhật. |

#### `product_images` (Hình ảnh sản phẩm)
Lưu trữ thư viện ảnh chi tiết cho sản phẩm (Gallery).
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID hình ảnh. |
| product_id | BIGINT | FK -> products(id) | Liên kết với sản phẩm. |
| image_url | VARCHAR(255)| NOT NULL | Đường dẫn ảnh. |
| alt_text | VARCHAR(255)| | Văn bản thay thế (SEO). |
| is_primary | BOOLEAN | DEFAULT FALSE | Là ảnh chính? (Có thể dư thừa với thumbnail_url). |
| created_at | TIMESTAMP | | Thời gian tải lên. |

#### `categories` (Danh mục)
Phân loại sản phẩm (Ví dụ: Điện thoại, Phụ kiện...).
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID danh mục. |
| name | VARCHAR(100) | NOT NULL | Tên danh mục. |
| description | TEXT | | Mô tả danh mục. |
| parent_id | BIGINT | FK -> categories(id)| ID danh mục cha (Đệ quy). NULL nếu là gốc. |
| created_at | TIMESTAMP | | Thời gian tạo. |
| updated_at | TIMESTAMP | | Thời gian cập nhật. |

#### `brands` (Thương hiệu)
Nhà sản xuất (Ví dụ: Apple, Samsung...).
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID thương hiệu. |
| name | VARCHAR(100) | NOT NULL | Tên thương hiệu. |
| description | TEXT | | Mô tả thương hiệu. |
| logo_url | VARCHAR(255)| | URL Logo thương hiệu. |
| created_at | TIMESTAMP | | Thời gian tạo. |
| updated_at | TIMESTAMP | | Thời gian cập nhật. |

---

### 2.3. Nhóm Đơn hàng & Thanh toán

#### `orders` (Đơn hàng)
Lưu trữ thông tin các đơn đặt hàng.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID nội bộ đơn hàng. |
| order_code | VARCHAR(20) | UNIQUE, NOT NULL | Mã đơn hàng (User thấy, vd: ORD-123). |
| user_id | BIGINT | FK -> users(id) | Người đặt hàng. |
| email | VARCHAR(100) | NOT NULL | Email liên hệ (phòng trường hợp Guest). |
| recipient_name | VARCHAR(100) | NOT NULL | Tên người nhận. |
| phone_number | VARCHAR(15) | NOT NULL | SĐT người nhận. |
| street_address | TEXT | NOT NULL | Địa chỉ giao hàng. |
| city | VARCHAR(100) | | Thành phố giao hàng. |
| status | VARCHAR(20) | NOT NULL | Trạng thái đơn (PENDING, SHIPPED...). |
| payment_method | VARCHAR(20) | NOT NULL | Phương thức TT (COD, VNPAY...). |
| total_amount | DECIMAL(15,2)| NOT NULL | Tổng giá trị đơn hàng. |
| voucher_id | BIGINT | FK -> vouchers(id) | Mã giảm giá đã áp dụng (NULLABLE). |
| created_at | TIMESTAMP | | Thời gian đặt hàng. |
| updated_at | TIMESTAMP | | Thời gian cập nhật trạng thái. |

#### `order_items` (Chi tiết đơn hàng)
Lưu trữ danh sách sản phẩm trong từng đơn hàng.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID chi tiết. |
| order_id | BIGINT | FK -> orders(id) | Thuộc đơn hàng nào. |
| product_id | BIGINT | FK -> products(id) | Sản phẩm nào. |
| quantity | INTEGER | NOT NULL | Số lượng mua. |
| price | DECIMAL(15,2)| NOT NULL | Giá bán **tại thời điểm mua**. |
| created_at | TIMESTAMP | | Thời gian tạo. |

#### `vouchers` (Mã giảm giá)
Quản lý các chương trình khuyến mãi.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID voucher. |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Mã nhập (vd: SALE50). |
| discount_type | VARCHAR(20) | NOT NULL | Loại giảm (PERCENT, FIXED_AMOUNT). |
| discount_value | DECIMAL(15,2)| NOT NULL | Giá trị giảm. |
| max_usage | INTEGER | | Số lượt dùng tối đa. |
| min_order_value| DECIMAL(15,2)| | Giá trị đơn hàng tối thiểu để áp dụng. |
| expiry_date | TIMESTAMP | NOT NULL | Thời hạn sử dụng. |
| status | VARCHAR(20) | | Trạng thái (ACTIVE, EXPIRED). |
| created_at | TIMESTAMP | | Thời gian tạo. |
| updated_at | TIMESTAMP | | Thời gian cập nhật. |

---

### 2.4. Nhóm Giỏ hàng (Shopping Cart)

#### `carts` (Giỏ hàng)
Mỗi người dùng có 1 giỏ hàng.
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID giỏ hàng. |
| user_id | BIGINT | FK -> users(id) | Thuộc về người dùng nào. |
| created_at | TIMESTAMP | | Thời gian tạo. |
| updated_at | TIMESTAMP | | Thời gian cập nhật. |

#### `cart_items` (Sản phẩm trong giỏ)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID item. |
| cart_id | BIGINT | FK -> carts(id) | Thuộc giỏ hàng nào. |
| product_id | BIGINT | FK -> products(id) | Sản phẩm nào. |
| quantity | INTEGER | DEFAULT 1 | Số lượng muốn mua. |
| created_at | TIMESTAMP | | Thời gian thêm vào. |
| updated_at | TIMESTAMP | | Thời gian cập nhật số lượng. |

---

### 2.5. Nhóm Đánh giá (Reviews)

#### `reviews` (Đánh giá sản phẩm)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID đánh giá. |
| user_id | BIGINT | FK -> users(id) | Người đánh giá. |
| product_id | BIGINT | FK -> products(id) | Sản phẩm được đánh giá. |
| rating | INTEGER | CHECK (1-5) | Điểm sao (1 đến 5). |
| comment | TEXT | | Nội dung bình luận. |
| created_at | TIMESTAMP | | Thời gian đánh giá. |
| updated_at | TIMESTAMP | | Thời gian chỉnh sửa. |

#### `review_likes` (Lượt thích đánh giá)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto Increment | ID lượt thích. |
| user_id | BIGINT | FK -> users(id) | Người thích. |
| review_id | BIGINT | FK -> reviews(id) | Thích đánh giá nào. |
| created_at | TIMESTAMP | | Thời gian thích. |

---

## 3. Sơ đồ quan hệ tổng quát (Relationship Summary)
*   **User** - **Address**: 1 - N (Một người dùng có nhiều địa chỉ).
*   **User** - **Order**: 1 - N (Một người dùng có nhiều đơn hàng).
*   **User** - **Cart**: 1 - 1 (Một người dùng sở hữu một giỏ hàng).
*   **Product** - **Category**: N - 1 (Nhiều sản phẩm thuộc một danh mục).
*   **Product** - **Brand**: N - 1 (Nhiều sản phẩm thuộc một thương hiệu).
*   **Product** - **ProductImage**: 1 - N (Một sản phẩm có nhiều ảnh).
*   **Order** - **OrderItem**: 1 - N (Một đơn hàng có nhiều chi tiết).
*   **Order** - **Voucher**: N - 1 (Nhiều đơn hàng có thể dùng chung 1 mã giảm giá - nếu voucher cho phép).
*   **Product** - **Review**: 1 - N (Một sản phẩm có nhiều đánh giá).
*   **Review** - **ReviewLike**: 1 - N (Một đánh giá có nhiều lượt thích).