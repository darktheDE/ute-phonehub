-- UTE PHONE HUB - DATABASE INITIALIZATION SCRIPT
-- PostgreSQL 15
-- Auto-run by Docker Compose on first startup

-- ============================================
-- 1. USERS DOMAIN
-- ============================================

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    gender VARCHAR(10),
    date_of_birth DATE,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: users (12 users phân bố 7 ngày - có created_at động)
INSERT INTO users (username, password_hash, full_name, email, phone_number, gender, date_of_birth, role, status, created_at, updated_at) VALUES
-- Admin (7 ngày trước)
('admin', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Nguyễn Văn Admin', 'admin@utephonehub.com', '0901234567', 'MALE', '1990-01-01', 'ADMIN', 'ACTIVE', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
-- 6 ngày trước (2 users)
('user001', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Trần Thị Hương', 'huong.tran@gmail.com', '0912345678', 'FEMALE', '1995-05-15', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('user002', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Lê Văn Nam', 'nam.le@gmail.com', '0923456789', 'MALE', '1998-08-20', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
-- 5 ngày trước (2 users)
('user003', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Phạm Thị Mai', 'mai.pham@gmail.com', '0934567890', 'FEMALE', '2000-03-10', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('user004', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Hoàng Văn Đức', 'duc.hoang@gmail.com', '0945678901', 'MALE', '1997-11-25', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
-- 4 ngày trước (1 user)
('user005', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Nguyễn Thị Lan', 'lan.nguyen@gmail.com', '0956789012', 'FEMALE', '1999-07-12', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
-- 3 ngày trước (2 users)
('user006', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Võ Văn Hùng', 'hung.vo@gmail.com', '0967890123', 'MALE', '1996-04-18', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('user007', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Bùi Thị Hoa', 'hoa.bui@gmail.com', '0978901234', 'FEMALE', '2001-09-22', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
-- 2 ngày trước (1 user)
('user008', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Đặng Văn Tài', 'tai.dang@gmail.com', '0989012345', 'MALE', '1994-12-05', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
-- 1 ngày trước (2 users)
('user009', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Lý Thị Kim', 'kim.ly@gmail.com', '0990123456', 'FEMALE', '2002-06-30', 'CUSTOMER', 'ACTIVE', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('user010', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Trương Văn Long', 'long.truong@gmail.com', '0901234568', 'MALE', '1993-03-15', 'CUSTOMER', 'LOCKED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
-- Hôm nay (1 user)
('user011', '$2a$10$N.zmdr9VKQf5VGcbq8BbXeuEYXCEL2k0E3W6AJCvHLE3p91NEVGie', 'Phan Thị Nga', 'nga.phan@gmail.com', '0912345679', 'FEMALE', '1996-08-20', 'CUSTOMER', 'ACTIVE', NOW(), NOW());

-- Table: addresses
CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    street_address TEXT NOT NULL,
    ward VARCHAR(100),
    ward_code VARCHAR(20),
    province VARCHAR(100),
    province_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: addresses
INSERT INTO addresses (user_id, recipient_name, phone_number, street_address, ward, ward_code, province, province_code, is_default) VALUES
(2, 'Trần Thị Hương', '0912345678', '123 Lê Lợi', 'Phường Bến Thành', '26734', 'TP. Hồ Chí Minh', '79', TRUE),
(2, 'Trần Thị Hương', '0912345678', '456 Nguyễn Huệ', 'Phường Bến Nghé', '26743', 'TP. Hồ Chí Minh', '79', FALSE),
(3, 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo', 'Phường 1', '26755', 'TP. Hồ Chí Minh', '79', TRUE),
(4, 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần', 'Phường 5', '26767', 'TP. Hồ Chí Minh', '79', TRUE),
(5, 'Hoàng Văn Đức', '0945678901', '654 Đinh Tiên Hoàng', 'Phường Đa Kao', '26770', 'TP. Hồ Chí Minh', '79', TRUE);

-- ============================================
-- 2. PRODUCT DOMAIN
-- ============================================

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: categories
INSERT INTO categories (name, description, parent_id) VALUES
('Điện thoại', 'Điện thoại thông minh', NULL),
('Laptop', 'Máy tính xách tay', NULL),
('Tablet', 'Máy tính bảng', NULL),
('Phụ kiện', 'Phụ kiện điện thoại và laptop', NULL),
('Tai nghe', 'Tai nghe có dây và không dây', 4);

-- Table: brands
CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: brands
INSERT INTO brands (name, logo_url) VALUES
('Apple', 'https://example.com/logos/apple.png'),
('Samsung', 'https://example.com/logos/samsung.png'),
('Xiaomi', 'https://example.com/logos/xiaomi.png'),
('OPPO', 'https://example.com/logos/oppo.png'),
('Dell', 'https://example.com/logos/dell.png');

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    thumbnail_url VARCHAR(255),
    specifications JSONB,
    status BOOLEAN DEFAULT TRUE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: products
INSERT INTO products (name, description, price, stock_quantity, thumbnail_url, specifications, status, category_id, brand_id) VALUES
('iPhone 15 Pro Max', 'Điện thoại cao cấp với chip A17 Pro', 32990000.00, 50, 'https://example.com/iphone15.jpg', 
'{"screen": "6.7 inch OLED", "chip": "A17 Pro", "ram": "8GB", "storage": "256GB", "battery": "4422mAh", "camera": "48MP"}', TRUE, 1, 1),
('Samsung Galaxy S24 Ultra', 'Flagship Android với bút S Pen', 29990000.00, 45, 'https://example.com/s24ultra.jpg',
'{"screen": "6.8 inch Dynamic AMOLED", "chip": "Snapdragon 8 Gen 3", "ram": "12GB", "storage": "512GB", "battery": "5000mAh", "camera": "200MP"}', TRUE, 1, 2),
('Xiaomi 14', 'Smartphone hiệu năng cao giá tốt', 17990000.00, 60, 'https://example.com/xiaomi14.jpg',
'{"screen": "6.36 inch AMOLED", "chip": "Snapdragon 8 Gen 3", "ram": "12GB", "storage": "256GB", "battery": "4610mAh", "camera": "50MP"}', TRUE, 1, 3),
('MacBook Pro 14 M3', 'Laptop chuyên dụng cho developer', 42990000.00, 30, 'https://example.com/macbook14.jpg',
'{"screen": "14.2 inch Liquid Retina XDR", "chip": "Apple M3", "ram": "16GB", "storage": "512GB SSD", "battery": "70Wh", "weight": "1.55kg"}', TRUE, 2, 1),
('Dell XPS 13 Plus', 'Laptop mỏng nhẹ cao cấp', 35990000.00, 25, 'https://example.com/xps13.jpg',
'{"screen": "13.4 inch FHD+", "chip": "Intel Core i7-1360P", "ram": "16GB", "storage": "1TB SSD", "battery": "55Wh", "weight": "1.24kg"}', TRUE, 2, 5);

-- Table: product_images
CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: product_images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://example.com/iphone15-1.jpg', TRUE),
(1, 'https://example.com/iphone15-2.jpg', FALSE),
(2, 'https://example.com/s24ultra-1.jpg', TRUE),
(3, 'https://example.com/xiaomi14-1.jpg', TRUE),
(4, 'https://example.com/macbook14-1.jpg', TRUE);

-- ============================================
-- 3. ORDER DOMAIN
-- ============================================

-- Table: promotions
CREATE TABLE IF NOT EXISTS promotions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL,
    max_usage INTEGER,
    min_order_value DECIMAL(15,2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: promotions
INSERT INTO promotions (code, name, description, discount_type, discount_value, max_usage, min_order_value, start_date, end_date, status) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'Áp dụng cho đơn hàng đầu tiên', 'PERCENT', 10.00, 100, 5000000.00, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'ACTIVE'),
('SALE500K', 'Giảm 500K cho đơn từ 10 triệu', 'Mã giảm giá cố định', 'AMOUNT', 500000.00, 50, 10000000.00, '2024-01-01 00:00:00', '2024-06-30 00:00:00', 'ACTIVE'),
('FLASH20', 'Flash Sale 20%', 'Giảm 20% trong khung giờ vàng', 'PERCENT', 20.00, 200, 3000000.00, '2024-12-01 00:00:00', '2024-12-31 00:00:00', 'ACTIVE'),
('VIP15', 'Ưu đãi khách VIP 15%', 'Dành cho khách hàng thân thiết', 'PERCENT', 15.00, NULL, 15000000.00, '2024-01-01 00:00:00', '2025-12-31 00:00:00', 'ACTIVE'),
('EXPIRED', 'Mã hết hạn', 'Chỉ dùng test', 'PERCENT', 5.00, 10, 1000000.00, '2023-01-01 00:00:00', '2023-12-31 00:00:00', 'EXPIRED');

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(100),
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    shipping_address TEXT NOT NULL,
    note TEXT,
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    promotion_id BIGINT REFERENCES promotions(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: orders (20 đơn hàng phân bố 7 ngày - có created_at và updated_at động)
INSERT INTO orders (order_code, user_id, email, recipient_name, phone_number, shipping_address, note, status, payment_method, total_amount, promotion_id, created_at, updated_at) VALUES
-- 7 ngày trước (3 orders - 2 DELIVERED, 1 CANCELLED)
('ORD-001', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', NULL, 'DELIVERED', 'COD', 32990000.00, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'),
('ORD-002', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 29990000.00, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'),
('ORD-003', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', NULL, 'CANCELLED', 'COD', 17990000.00, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
-- 6 ngày trước (3 orders - all DELIVERED)
('ORD-004', 5, 'duc.hoang@gmail.com', 'Hoàng Văn Đức', '0945678901', '654 Đinh Tiên Hoàng, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 42990000.00, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
('ORD-005', 6, 'lan.nguyen@gmail.com', 'Nguyễn Thị Lan', '0956789012', '111 Nguyễn Trãi, TP.HCM', NULL, 'DELIVERED', 'COD', 35990000.00, 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
('ORD-006', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 18000000.00, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
-- 5 ngày trước (3 orders - all DELIVERED)
('ORD-007', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', NULL, 'DELIVERED', 'COD', 32990000.00, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
('ORD-008', 7, 'hung.vo@gmail.com', 'Võ Văn Hùng', '0967890123', '222 Lý Thường Kiệt, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 25000000.00, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
('ORD-009', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', NULL, 'DELIVERED', 'COD', 29990000.00, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
-- 4 ngày trước (3 orders - all DELIVERED)
('ORD-010', 8, 'hoa.bui@gmail.com', 'Bùi Thị Hoa', '0978901234', '333 Hai Bà Trưng, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 17990000.00, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('ORD-011', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', NULL, 'DELIVERED', 'COD', 42990000.00, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('ORD-012', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 35990000.00, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
-- 3 ngày trước (3 orders - 2 DELIVERED, 1 SHIPPING)
('ORD-013', 9, 'tai.dang@gmail.com', 'Đặng Văn Tài', '0989012345', '444 Điện Biên Phủ, TP.HCM', NULL, 'DELIVERED', 'COD', 25000000.00, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('ORD-014', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 18000000.00, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('ORD-015', 10, 'kim.ly@gmail.com', 'Lý Thị Kim', '0990123456', '555 Cách Mạng Tháng 8, TP.HCM', NULL, 'SHIPPING', 'COD', 32990000.00, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
-- 2 ngày trước (2 orders - 1 DELIVERED, 1 CONFIRMED)
('ORD-016', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', NULL, 'DELIVERED', 'VNPAY', 29990000.00, NULL, NOW() - INTERVAL '2 days', NOW()),
('ORD-017', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', NULL, 'CONFIRMED', 'COD', 17990000.00, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
-- 1 ngày trước (2 orders - 1 PENDING, 1 CONFIRMED)
('ORD-018', 11, 'long.truong@gmail.com', 'Trương Văn Long', '0901234568', '666 Võ Thị Sáu, TP.HCM', NULL, 'PENDING', 'VNPAY', 42990000.00, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('ORD-019', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', NULL, 'CONFIRMED', 'COD', 35990000.00, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
-- Hôm nay (1 order - PENDING)
('ORD-020', 12, 'nga.phan@gmail.com', 'Phan Thị Nga', '0912345679', '777 Phan Xích Long, TP.HCM', NULL, 'PENDING', 'VNPAY', 25000000.00, NULL, NOW(), NOW());

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: order_items (20 items tương ứng 20 orders - có created_at động)
INSERT INTO order_items (order_id, product_id, quantity, price, created_at) VALUES
(1, 1, 1, 32990000.00, NOW() - INTERVAL '7 days'),
(2, 2, 1, 29990000.00, NOW() - INTERVAL '7 days'),
(3, 3, 1, 17990000.00, NOW() - INTERVAL '7 days'),
(4, 4, 1, 42990000.00, NOW() - INTERVAL '6 days'),
(5, 5, 1, 35990000.00, NOW() - INTERVAL '6 days'),
(6, 3, 1, 18000000.00, NOW() - INTERVAL '6 days'),
(7, 1, 1, 32990000.00, NOW() - INTERVAL '5 days'),
(8, 2, 1, 25000000.00, NOW() - INTERVAL '5 days'),
(9, 2, 1, 29990000.00, NOW() - INTERVAL '5 days'),
(10, 3, 1, 17990000.00, NOW() - INTERVAL '4 days'),
(11, 4, 1, 42990000.00, NOW() - INTERVAL '4 days'),
(12, 5, 1, 35990000.00, NOW() - INTERVAL '4 days'),
(13, 2, 1, 25000000.00, NOW() - INTERVAL '3 days'),
(14, 3, 1, 18000000.00, NOW() - INTERVAL '3 days'),
(15, 1, 1, 32990000.00, NOW() - INTERVAL '3 days'),
(16, 2, 1, 29990000.00, NOW() - INTERVAL '2 days'),
(17, 3, 1, 17990000.00, NOW() - INTERVAL '2 days'),
(18, 4, 1, 42990000.00, NOW() - INTERVAL '1 day'),
(19, 5, 1, 35990000.00, NOW() - INTERVAL '1 day'),
(20, 2, 1, 25000000.00, NOW());

-- Table: order_status_history
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50),
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: order_status_history (history cho các đơn đã DELIVERED - có changed_at động)
INSERT INTO order_status_history (order_id, status, changed_by, changed_at) VALUES
-- ORD-001 (DELIVERED)
(1, 'PENDING', 'System', NOW() - INTERVAL '7 days 2 hours'),
(1, 'CONFIRMED', 'admin', NOW() - INTERVAL '7 days 1 hour'),
(1, 'SHIPPING', 'System', NOW() - INTERVAL '6 days'),
(1, 'DELIVERED', 'System', NOW() - INTERVAL '5 days'),
-- ORD-002 (DELIVERED)
(2, 'PENDING', 'System', NOW() - INTERVAL '7 days'),
(2, 'CONFIRMED', 'admin', NOW() - INTERVAL '6 days 20 hours'),
(2, 'SHIPPING', 'System', NOW() - INTERVAL '6 days'),
(2, 'DELIVERED', 'System', NOW() - INTERVAL '5 days'),
-- ORD-003 (CANCELLED)
(3, 'PENDING', 'System', NOW() - INTERVAL '7 days'),
(3, 'CANCELLED', 'System', NOW() - INTERVAL '7 days'),
-- ORD-004 to ORD-014 (DELIVERED ones)
(4, 'PENDING', 'System', NOW() - INTERVAL '6 days'),
(4, 'DELIVERED', 'System', NOW() - INTERVAL '4 days'),
(5, 'PENDING', 'System', NOW() - INTERVAL '6 days'),
(5, 'DELIVERED', 'System', NOW() - INTERVAL '4 days'),
(6, 'PENDING', 'System', NOW() - INTERVAL '6 days'),
(6, 'DELIVERED', 'System', NOW() - INTERVAL '4 days'),
(7, 'PENDING', 'System', NOW() - INTERVAL '5 days'),
(7, 'DELIVERED', 'System', NOW() - INTERVAL '3 days'),
(8, 'PENDING', 'System', NOW() - INTERVAL '5 days'),
(8, 'DELIVERED', 'System', NOW() - INTERVAL '3 days'),
(9, 'PENDING', 'System', NOW() - INTERVAL '5 days'),
(9, 'DELIVERED', 'System', NOW() - INTERVAL '3 days'),
(10, 'PENDING', 'System', NOW() - INTERVAL '4 days'),
(10, 'DELIVERED', 'System', NOW() - INTERVAL '2 days'),
(11, 'PENDING', 'System', NOW() - INTERVAL '4 days'),
(11, 'DELIVERED', 'System', NOW() - INTERVAL '2 days'),
(12, 'PENDING', 'System', NOW() - INTERVAL '4 days'),
(12, 'DELIVERED', 'System', NOW() - INTERVAL '2 days'),
(13, 'PENDING', 'System', NOW() - INTERVAL '3 days'),
(13, 'DELIVERED', 'System', NOW() - INTERVAL '1 day'),
(14, 'PENDING', 'System', NOW() - INTERVAL '3 days'),
(14, 'DELIVERED', 'System', NOW() - INTERVAL '1 day'),
-- ORD-015 (SHIPPING)
(15, 'PENDING', 'System', NOW() - INTERVAL '3 days'),
(15, 'SHIPPING', 'System', NOW() - INTERVAL '3 days'),
-- ORD-016 (DELIVERED)
(16, 'PENDING', 'System', NOW() - INTERVAL '2 days'),
(16, 'DELIVERED', 'System', NOW()),
-- ORD-017 (CONFIRMED)
(17, 'PENDING', 'System', NOW() - INTERVAL '2 days'),
(17, 'CONFIRMED', 'admin', NOW() - INTERVAL '2 days'),
-- ORD-018 (PENDING)
(18, 'PENDING', 'System', NOW() - INTERVAL '1 day'),
-- ORD-019 (CONFIRMED)
(19, 'PENDING', 'System', NOW() - INTERVAL '1 day'),
(19, 'CONFIRMED', 'admin', NOW() - INTERVAL '1 day'),
-- ORD-020 (PENDING)
(20, 'PENDING', 'System', NOW());

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    provider VARCHAR(20),
    transaction_id VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: payments
INSERT INTO payments (order_id, provider, transaction_id, amount, status) VALUES
(2, 'VNPAY', 'VNPAY-20241204142000-12345', 17990000.00, 'SUCCESS'),
(4, 'VNPAY', 'VNPAY-20241205080000-67890', 35990000.00, 'PENDING'),
(1, NULL, NULL, 29691000.00, 'SUCCESS'),
(3, NULL, NULL, 42990000.00, 'PENDING'),
(5, NULL, NULL, 32990000.00, 'CANCELLED');

-- ============================================
-- 4. CART DOMAIN
-- ============================================

-- Table: carts
CREATE TABLE IF NOT EXISTS carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: carts
INSERT INTO carts (user_id) VALUES
(2),
(3),
(4),
(5),
(1);

-- Table: cart_items
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: cart_items
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 2, 1),
(1, 5, 1),
(2, 1, 2),
(3, 3, 1),
(4, 4, 1);

-- ============================================
-- 5. INTERACTION DOMAIN
-- ============================================

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Sản phẩm rất tốt, camera đẹp, pin trâu!'),
(3, 1, 4, 'Máy đẹp nhưng hơi nóng khi chơi game'),
(4, 2, 5, 'Samsung S24 Ultra xứng đáng flagship, bút S Pen tiện lợi'),
(2, 3, 5, 'Xiaomi 14 giá rẻ mà cấu hình khủng, đáng mua!'),
(3, 4, 5, 'MacBook Pro M3 quá mượt, code cả ngày không nóng');

-- Table: review_likes
CREATE TABLE IF NOT EXISTS review_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, review_id)
);

-- Sample data: review_likes
INSERT INTO review_likes (user_id, review_id) VALUES
(3, 1),
(4, 1),
(2, 3),
(4, 4),
(2, 5);

-- Table: conversations
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: conversations
INSERT INTO conversations (user_id, session_id, status) VALUES
(2, NULL, 'CLOSED'),
(3, NULL, 'OPEN'),
(NULL, 'GUEST-SESSION-001', 'OPEN'),
(4, NULL, 'CLOSED'),
(NULL, 'GUEST-SESSION-002', 'CLOSED');

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data: messages
INSERT INTO messages (conversation_id, sender_type, content, metadata) VALUES
(1, 'USER', 'Cho tôi hỏi iPhone 15 Pro Max còn hàng không?', NULL),
(1, 'BOT', 'Hiện tại iPhone 15 Pro Max còn 50 máy. Bạn muốn đặt hàng không?', '{"product_id": 1}'),
(2, 'USER', 'Xiaomi 14 có bảo hành bao lâu?', NULL),
(2, 'ADMIN', 'Sản phẩm bảo hành chính hãng 12 tháng tại trung tâm bảo hành Xiaomi', NULL),
(3, 'USER', 'Tôi muốn tư vấn mua laptop', NULL);

-- ============================================
-- END OF INITIALIZATION SCRIPT
-- ============================================
