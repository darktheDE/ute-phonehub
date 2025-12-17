-- UTE PHONE HUB - DATABASE INITIALIZATION SCRIPT
-- PostgreSQL 15
-- Auto-run by Docker Compose on first startup
-- Updated to match all Entity classes

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
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    street_address TEXT NOT NULL,
    ward VARCHAR(100),
    ward_code VARCHAR(20),
    province VARCHAR(100),
    province_code VARCHAR(20),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: categories (root categories)
INSERT INTO categories (name, description, parent_id) VALUES
('Điện thoại', 'Điện thoại thông minh các loại', NULL),
('Tablet', 'Máy tính bảng', NULL),
('Laptop', 'Máy tính xách tay', NULL),
('Phụ kiện', 'Phụ kiện điện thoại và laptop', NULL),
('Đồng hồ thông minh', 'Smartwatch và thiết bị đeo tay', NULL);

-- Sample data: categories (sub-categories - danh mục con)
INSERT INTO categories (name, description, parent_id) VALUES
-- Sub-categories of "Phụ kiện" (id=4)
('Tai nghe', 'Tai nghe có dây và không dây', 4),
('Sạc dự phòng', 'Pin sạc dự phòng các loại', 4),
('Cáp sạc', 'Cáp sạc USB-C, Lightning, Micro USB', 4),
('Ốp lưng', 'Ốp lưng bảo vệ điện thoại', 4);

-- Table: brands
CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: brands
INSERT INTO brands (name, logo_url) VALUES
('Apple', 'https://example.com/logos/apple.png'),
('Samsung', 'https://example.com/logos/samsung.png'),
('Xiaomi', 'https://example.com/logos/xiaomi.png'),
('OPPO', 'https://example.com/logos/oppo.png'),
('Dell', 'https://example.com/logos/dell.png');

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    status BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    brand_id BIGINT REFERENCES brands(id) ON DELETE SET NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    deleted_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_by, updated_by, deleted_by) VALUES
('iPhone 15 Pro Max', 'iPhone 15 Pro Max - Điện thoại cao cấp với chip A17 Pro, camera 48MP, pin 4422mAh', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-15-pro-max.jpg', TRUE, FALSE, 1, 1, NULL, NULL, NULL),
('iPhone 15 Pro', 'iPhone 15 Pro - Flagship với chip A17 Pro, thiết kế titan cao cấp', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-15-pro.jpg', TRUE, FALSE, 1, 1, NULL, NULL, NULL),
('iPhone 15', 'iPhone 15 - Điện thoại thông minh với chip A16 Bionic, camera 48MP', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone-15.jpg', TRUE, FALSE, 1, 1, NULL, NULL, NULL),
('Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra - Flagship Android với bút S Pen, camera 200MP', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/a/samsung-galaxy-s24-ultra.jpg', TRUE, FALSE, 1, 2, NULL, NULL, NULL),
('Samsung Galaxy S24', 'Samsung Galaxy S24 - Flagship nhỏ gọn với hiệu năng mạnh mẽ', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/a/samsung-galaxy-s24.jpg', TRUE, FALSE, 1, 2, NULL, NULL, NULL),
('Samsung Galaxy A55', 'Samsung Galaxy A55 - Điện thoại tầm trung với camera 50MP', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/a/samsung-galaxy-a55.jpg', TRUE, FALSE, 1, 2, NULL, NULL, NULL),
('Xiaomi 14', 'Xiaomi 14 - Smartphone hiệu năng cao với chip Snapdragon 8 Gen 3', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/x/i/xiaomi-14.jpg', TRUE, FALSE, 1, 3, NULL, NULL, NULL),
('Xiaomi Redmi Note 13', 'Xiaomi Redmi Note 13 - Điện thoại giá rẻ hiệu năng tốt', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/x/i/xiaomi-redmi-note-13.jpg', TRUE, FALSE, 1, 3, NULL, NULL, NULL),
('OPPO Reno11', 'OPPO Reno11 - Điện thoại camera chuyên nghiệp với chip MediaTek Dimensity 7050', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/o/p/oppo-reno11.jpg', TRUE, FALSE, 1, 4, NULL, NULL, NULL),
('OPPO Find X7', 'OPPO Find X7 - Flagship với camera Hasselblad, chip Snapdragon 8 Gen 3', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/o/p/oppo-find-x7.jpg', TRUE, FALSE, 1, 4, NULL, NULL, NULL),
('MacBook Pro 14" M3', 'MacBook Pro 14 inch M3 - Laptop chuyên dụng cho developer và designer', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/a/macbook-pro-14-m3.jpg', TRUE, FALSE, 3, 1, NULL, NULL, NULL),
('MacBook Air 15" M3', 'MacBook Air 15 inch M3 - Laptop mỏng nhẹ hiệu năng cao', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/a/macbook-air-15-m3.jpg', TRUE, FALSE, 3, 1, NULL, NULL, NULL),
('Dell XPS 13 Plus', 'Dell XPS 13 Plus - Laptop mỏng nhẹ cao cấp với màn hình OLED', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/d/e/dell-xps-13-plus.jpg', TRUE, FALSE, 3, 5, NULL, NULL, NULL),
('Dell Inspiron 15 3520', 'Dell Inspiron 15 3520 - Laptop phổ thông giá tốt', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/d/e/dell-inspiron-15-3520.jpg', TRUE, FALSE, 3, 5, NULL, NULL, NULL),
('iPad Pro 11" M2', 'iPad Pro 11 inch M2 - Máy tính bảng cao cấp với chip M2', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/p/ipad-pro-11-m2.jpg', TRUE, FALSE, 2, 1, NULL, NULL, NULL),
('iPad Air 11" M2', 'iPad Air 11 inch M2 - Máy tính bảng mỏng nhẹ hiệu năng cao', 'https://cdn.cellphones.com.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/p/ipad-air-11-m2.jpg', TRUE, FALSE, 2, 1, NULL, NULL, NULL);

-- Table: product_templates
CREATE TABLE IF NOT EXISTS product_templates (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50),
    storage VARCHAR(50),
    ram VARCHAR(50),
    price DECIMAL(15,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    stock_status VARCHAR(20) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_product_template_sku ON product_templates (sku);
CREATE INDEX IF NOT EXISTS idx_product_template_product_id ON product_templates (product_id);
CREATE INDEX IF NOT EXISTS idx_product_template_stock_status ON product_templates (stock_status);

-- Sample data: product_templates
INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(1, 'IP15PM-256-BLK', 'Titan Black', '256GB', '8GB', 32990000.00, 50, 'IN_STOCK', TRUE),
(2, 'IP15P-256-BLK', 'Black', '256GB', '8GB', 28990000.00, 45, 'IN_STOCK', TRUE),
(3, 'IP15-128-PNK', 'Pink', '128GB', '6GB', 21990000.00, 60, 'IN_STOCK', TRUE),
(4, 'S24U-512-BLK', 'Black', '512GB', '12GB', 29990000.00, 40, 'IN_STOCK', TRUE),
(5, 'S24-256-VIO', 'Violet', '256GB', '8GB', 19990000.00, 55, 'IN_STOCK', TRUE),
(6, 'A55-128-BLU', 'Blue', '128GB', '8GB', 8990000.00, 70, 'IN_STOCK', TRUE),
(7, 'XM14-256-GRN', 'Green', '256GB', '12GB', 17990000.00, 65, 'IN_STOCK', TRUE),
(8, 'RN13-128-BLK', 'Black', '128GB', '8GB', 5990000.00, 80, 'IN_STOCK', TRUE),
(9, 'OPR11-256-GRN', 'Green', '256GB', '8GB', 10990000.00, 50, 'IN_STOCK', TRUE),
(10, 'OPX7-512-BLK', 'Black', '512GB', '16GB', 19990000.00, 35, 'IN_STOCK', TRUE),
(11, 'MBP14M3-16-512-SLV', 'Silver', '512GB', '16GB', 42990000.00, 30, 'IN_STOCK', TRUE),
(12, 'MBA15M3-16-512-GLD', 'Gold', '512GB', '16GB', 32990000.00, 40, 'IN_STOCK', TRUE),
(13, 'XPS13P-1T-SLV', 'Silver', '1TB', '16GB', 35990000.00, 25, 'IN_STOCK', TRUE),
(14, 'INS15-512-SLV', 'Silver', '512GB', '8GB', 14990000.00, 50, 'IN_STOCK', TRUE),
(15, 'IPDP11-256-SLV', 'Silver', '256GB', '8GB', 24990000.00, 35, 'IN_STOCK', TRUE),
(16, 'IPDA11-128-BLU', 'Blue', '128GB', '8GB', 18990000.00, 45, 'IN_STOCK', TRUE);

-- Table: product_metadata
CREATE TABLE IF NOT EXISTS product_metadata (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    import_price DECIMAL(15,2),
    sale_price DECIMAL(15,2),
    screen_resolution VARCHAR(100),
    screen_size DOUBLE PRECISION CHECK (screen_size >= 1.0 AND screen_size <= 50.0),
    screen_technology VARCHAR(100),
    refresh_rate INTEGER,
    cpu_chipset VARCHAR(100),
    gpu VARCHAR(100),
    camera_megapixels DOUBLE PRECISION,
    camera_details VARCHAR(200),
    front_camera_megapixels DOUBLE PRECISION,
    battery_capacity INTEGER,
    charging_power INTEGER,
    charging_type VARCHAR(100),
    weight DOUBLE PRECISION,
    dimensions VARCHAR(100),
    material VARCHAR(100),
    operating_system VARCHAR(100),
    keyboard_type VARCHAR(100),
    ports VARCHAR(200),
    case_size VARCHAR(50),
    health_features VARCHAR(200),
    battery_life_days INTEGER,
    wireless_connectivity VARCHAR(100),
    sim_type VARCHAR(100),
    water_resistance VARCHAR(200),
    audio_features VARCHAR(200),
    security_features VARCHAR(200),
    additional_specs TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_metadata_product_id ON product_metadata (product_id);

-- Sample data: product_metadata
INSERT INTO product_metadata (product_id, import_price, sale_price, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type, weight, dimensions, material, operating_system, keyboard_type, ports, case_size, health_features, battery_life_days, wireless_connectivity, sim_type, water_resistance, audio_features, security_features, additional_specs) VALUES
(1, 25000000.00, 32990000.00, '2796 x 1290', 6.7, 'Super Retina XDR OLED', 120, 'Apple A17 Pro', 'Apple GPU', 48.0, '48MP + 12MP + 12MP', 12.0, 4422, 20, 'USB-C / MagSafe', 221.0, '159.9 x 76.7 x 8.25 mm', 'Titanium', 'iOS 17', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 6E, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Stereo speakers', 'Face ID', NULL),
(2, 23000000.00, 28990000.00, '2556 x 1179', 6.1, 'Super Retina XDR OLED', 120, 'Apple A17 Pro', 'Apple GPU', 48.0, '48MP + 12MP + 12MP', 12.0, 3274, 20, 'USB-C / MagSafe', 187.0, '146.6 x 70.6 x 8.25 mm', 'Titanium', 'iOS 17', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 6E, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Stereo speakers', 'Face ID', NULL),
(3, 17000000.00, 21990000.00, '2556 x 1179', 6.1, 'Super Retina XDR OLED', 60, 'Apple A16 Bionic', 'Apple GPU', 48.0, '48MP + 12MP', 12.0, 3349, 20, 'USB-C', 171.0, '147.6 x 71.6 x 7.8 mm', 'Aluminum', 'iOS 17', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 6E, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Stereo speakers', 'Face ID', NULL),
(4, 25000000.00, 29990000.00, '3120 x 1440', 6.8, 'Dynamic AMOLED 2X', 120, 'Snapdragon 8 Gen 3', 'Adreno 750', 200.0, '200MP + 50MP + 12MP + 10MP', 12.0, 5000, 45, 'USB-C PD', 232.0, '162.3 x 79 x 8.6 mm', 'Armor Aluminum', 'Android 14', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 7, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Stereo speakers', 'Ultrasonic fingerprint', NULL),
(5, 15000000.00, 19990000.00, '2340 x 1080', 6.2, 'Dynamic AMOLED 2X', 120, 'Snapdragon 8 Gen 3', 'Adreno 750', 50.0, '50MP + 12MP + 10MP', 12.0, 4000, 25, 'USB-C PD', 168.0, '147 x 70.6 x 7.6 mm', 'Armor Aluminum', 'Android 14', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 7, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Stereo speakers', 'Ultrasonic fingerprint', NULL),
(6, 6000000.00, 8990000.00, '2340 x 1080', 6.6, 'Super AMOLED', 120, 'Exynos 1480', 'Mali', 50.0, '50MP + 12MP + 5MP', 32.0, 5000, 25, 'USB-C PD', 213.0, '161.1 x 77.4 x 8.2 mm', 'Plastic', 'Android 14', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 6, Bluetooth 5.3', 'Dual SIM', 'IP67', 'Stereo speakers', 'Side fingerprint', NULL),
(7, 12000000.00, 17990000.00, '2670 x 1200', 6.36, 'AMOLED', 120, 'Snapdragon 8 Gen 3', 'Adreno 750', 50.0, '50MP triple', 32.0, 4610, 90, 'USB-C PD', 188.0, '152.8 x 71.5 x 8.2 mm', 'Aluminum', 'Android 14', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 7, Bluetooth 5.4', 'Dual SIM', 'IP68', 'Stereo speakers', 'In-display fingerprint', NULL),
(8, 4000000.00, 5990000.00, '2400 x 1080', 6.67, 'AMOLED', 120, 'Snapdragon 685', 'Adreno 610', 108.0, '108MP + 8MP + 2MP', 16.0, 5000, 33, 'USB-C PD', 188.0, '162.3 x 75.6 x 7.97 mm', 'Plastic', 'Android 13', NULL, NULL, NULL, NULL, NULL, '4G, Wi-Fi 5, Bluetooth 5.1', 'Dual SIM', 'IP54', 'Stereo speakers', 'Side fingerprint', NULL),
(9, 8000000.00, 10990000.00, '2412 x 1080', 6.7, 'AMOLED', 120, 'Dimensity 7050', 'Mali', 50.0, '50MP + 32MP + 8MP', 32.0, 5000, 67, 'USB-C PD', 182.0, '162.4 x 74.3 x 7.6 mm', 'Plastic', 'Android 14', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 6, Bluetooth 5.3', 'Dual SIM', 'IP54', 'Stereo speakers', 'In-display fingerprint', NULL),
(10, 15000000.00, 19990000.00, '2780 x 1264', 6.78, 'AMOLED', 120, 'Snapdragon 8 Gen 3', 'Adreno 750', 50.0, '50MP + 50MP + 64MP', 32.0, 5000, 80, 'USB-C PD', 218.0, '162.7 x 75.1 x 8.9 mm', 'Glass / Aluminum', 'Android 14', NULL, NULL, NULL, NULL, NULL, '5G, Wi-Fi 7, Bluetooth 5.4', 'Dual SIM', 'IP64', 'Stereo speakers', 'In-display fingerprint', NULL),
(11, 32000000.00, 42990000.00, '3024 x 1964', 14.2, 'Liquid Retina XDR', 120, 'Apple M3', 'Apple GPU', NULL, NULL, NULL, 70, 67, 'MagSafe', 1550.0, '312.6 x 221.2 x 15.5 mm', 'Aluminum', 'macOS Sonoma', 'Magic Keyboard', '3x Thunderbolt 4, HDMI, SD', NULL, NULL, NULL, 'Wi-Fi 6E, Bluetooth 5.3', NULL, NULL, 'Stereo speakers', 'Touch ID', 'SD/HDMI/Thunderbolt 4'),
(12, 25000000.00, 32990000.00, '2880 x 1864', 15.3, 'Liquid Retina', 60, 'Apple M3', 'Apple GPU', NULL, NULL, NULL, 66, 35, 'MagSafe', 1510.0, '340.4 x 237.6 x 11.5 mm', 'Aluminum', 'macOS Sonoma', 'Magic Keyboard', '2x Thunderbolt 4', NULL, NULL, NULL, 'Wi-Fi 6E, Bluetooth 5.3', NULL, NULL, 'Stereo speakers', 'Touch ID', 'Two Thunderbolt 4'),
(13, 27000000.00, 35990000.00, '3456 x 2160', 13.4, 'OLED', 60, 'Intel i7-1360P', 'Intel Iris Xe', NULL, NULL, NULL, 55, 65, 'USB-C PD', 1240.0, '295.3 x 199.1 x 15.3 mm', 'Aluminum', 'Windows 11', 'Backlit Keyboard', '2x Thunderbolt 4, USB-C', NULL, NULL, NULL, 'Wi-Fi 6E, Bluetooth 5.3', NULL, NULL, 'Stereo speakers', 'Fingerprint', '2x Thunderbolt 4'),
(14, 10000000.00, 14990000.00, '1920 x 1080', 15.6, 'IPS', 60, 'Intel i5-1235U', 'Intel Iris Xe', NULL, NULL, NULL, 41, 45, 'USB-C PD', 1780.0, '358.5 x 235.8 x 18.9 mm', 'Plastic', 'Windows 11', 'Backlit Keyboard', 'HDMI, USB-A, USB-C', NULL, NULL, NULL, 'Wi-Fi 6, Bluetooth 5.2', NULL, NULL, 'Stereo speakers', 'Fingerprint', 'HDMI/USB-A/USB-C'),
(15, 18000000.00, 24990000.00, '2388 x 1668', 11.0, 'Liquid Retina', 120, 'Apple M2', 'Apple GPU', 12.0, '12MP dual', 12.0, 28, 30, 'USB-C PD', 466.0, '247.6 x 178.5 x 5.9 mm', 'Aluminum', 'iPadOS 17', NULL, NULL, '45mm case equiv', 'ECG, SPO2', NULL, 'Wi-Fi 6E, Bluetooth 5.3', 'eSIM', 'IPXX', 'Stereo speakers', 'Face ID', NULL),
(16, 14000000.00, 18990000.00, '2360 x 1640', 11.0, 'Liquid Retina', 60, 'Apple M2', 'Apple GPU', 12.0, '12MP', 12.0, 28, 30, 'USB-C PD', 462.0, '247.6 x 178.5 x 6.1 mm', 'Aluminum', 'iPadOS 17', NULL, NULL, '45mm case equiv', 'Health tracking', NULL, 'Wi-Fi 6E, Bluetooth 5.3', 'eSIM', 'IPXX', 'Stereo speakers', 'Touch ID', NULL);

-- Table: product_images
CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    image_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: product_images
INSERT INTO product_images (product_id, image_url, image_order, is_primary) VALUES
(1, 'https://example.com/iphone15-1.jpg', 1, TRUE),
(1, 'https://example.com/iphone15-2.jpg', 2, FALSE),
(2, 'https://example.com/s24ultra-1.jpg', 1, TRUE),
(3, 'https://example.com/xiaomi14-1.jpg', 1, TRUE),
(4, 'https://example.com/macbook14-1.jpg', 1, TRUE);

-- ============================================
-- 3. PROMOTION DOMAIN
-- ============================================

-- Table: promotion_templates
CREATE TABLE IF NOT EXISTS promotion_templates (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    type VARCHAR(20) NOT NULL
);

-- Sample data: promotion_templates
INSERT INTO promotion_templates (id, code, created_at, type) VALUES
('template-001', 'DISCOUNT_TEMPLATE', NOW() - INTERVAL '30 days', 'DISCOUNT'),
('template-002', 'FREESHIP_TEMPLATE', NOW() - INTERVAL '30 days', 'FREESHIP'),
('template-003', 'VOUCHER_TEMPLATE', NOW() - INTERVAL '30 days', 'VOUCHER');

-- Table: promotions
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(255) PRIMARY KEY,
    effective_date TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    percent_discount DOUBLE PRECISION,
    min_value_to_be_applied DOUBLE PRECISION,
    status VARCHAR(20) NOT NULL,
    template_id VARCHAR(255) NOT NULL REFERENCES promotion_templates(id) ON DELETE RESTRICT
);

-- Sample data: promotions
INSERT INTO promotions (id, effective_date, expiration_date, title, description, percent_discount, min_value_to_be_applied, status, template_id) VALUES
('promo-001', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 'Giảm 10% cho khách hàng mới', 'Áp dụng cho đơn hàng đầu tiên', 10.0, 5000000.0, 'ACTIVE', 'template-001'),
('promo-002', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn từ 500K', NULL, 500000.0, 'ACTIVE', 'template-002'),
('promo-003', NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days', 'Voucher 500K', 'Giảm 500K cho đơn từ 10 triệu', NULL, 10000000.0, 'ACTIVE', 'template-001'),
('promo-004', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day', 'Khuyến mãi đã hết hạn', 'Mã đã hết hạn', 5.0, 1000000.0, 'EXPIRED', 'template-001');

-- Table: promotion_targets
CREATE TABLE IF NOT EXISTS promotion_targets (
    id BIGSERIAL PRIMARY KEY,
    applicable_object_id BIGINT,
    type VARCHAR(20) NOT NULL,
    promotion_id VARCHAR(255) REFERENCES promotions(id) ON DELETE CASCADE
);

-- Sample data: promotion_targets
INSERT INTO promotion_targets (applicable_object_id, type, promotion_id) VALUES
(1, 'PRODUCT', 'promo-001'),  -- Áp dụng cho product ID 1
(2, 'PRODUCT', 'promo-001'),  -- Áp dụng cho product ID 2
(1, 'CATEGORY', 'promo-002'), -- Áp dụng cho category ID 1
(3, 'CATEGORY', 'promo-002'), -- Áp dụng cho category ID 3
(NULL, 'WHOLE', 'promo-003'); -- Áp dụng cho toàn bộ

-- ============================================
-- 4. ORDER DOMAIN
-- ============================================

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_fee DECIMAL(15,2),
    shipping_unit VARCHAR(50),
    note TEXT,
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    promotion_id VARCHAR(255) REFERENCES promotions(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0
);

-- Sample data: orders (20 đơn hàng phân bố 7 ngày - có created_at và updated_at động)
INSERT INTO orders (order_code, user_id, email, recipient_name, phone_number, shipping_address, shipping_fee, shipping_unit, note, status, payment_method, total_amount, promotion_id, created_at, updated_at) VALUES
-- 7 ngày trước (3 orders - 2 DELIVERED, 1 CANCELLED)
('ORD-001', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', 30000.00, 'GHN', NULL, 'DELIVERED', 'COD', 32990000.00, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'),
('ORD-002', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', 25000.00, 'GHTK', NULL, 'DELIVERED', 'VNPAY', 29990000.00, 'promo-001', NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'),
('ORD-003', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', 30000.00, 'GHN', NULL, 'CANCELLED', 'COD', 17990000.00, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
-- 6 ngày trước (3 orders - all DELIVERED)
('ORD-004', 5, 'duc.hoang@gmail.com', 'Hoàng Văn Đức', '0945678901', '654 Đinh Tiên Hoàng, TP.HCM', 35000.00, 'GHN', NULL, 'DELIVERED', 'VNPAY', 42990000.00, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
('ORD-005', 6, 'lan.nguyen@gmail.com', 'Nguyễn Thị Lan', '0956789012', '111 Nguyễn Trãi, TP.HCM', 30000.00, 'GHTK', NULL, 'DELIVERED', 'COD', 35990000.00, 'promo-002', NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
('ORD-006', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', 25000.00, 'GHN', NULL, 'DELIVERED', 'VNPAY', 18000000.00, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
-- 5 ngày trước (3 orders - all DELIVERED)
('ORD-007', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', 30000.00, 'GHN', NULL, 'DELIVERED', 'COD', 32990000.00, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
('ORD-008', 7, 'hung.vo@gmail.com', 'Võ Văn Hùng', '0967890123', '222 Lý Thường Kiệt, TP.HCM', 25000.00, 'GHTK', NULL, 'DELIVERED', 'VNPAY', 25000000.00, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
('ORD-009', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', 30000.00, 'GHN', NULL, 'DELIVERED', 'COD', 29990000.00, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
-- 4 ngày trước (3 orders - all DELIVERED)
('ORD-010', 8, 'hoa.bui@gmail.com', 'Bùi Thị Hoa', '0978901234', '333 Hai Bà Trưng, TP.HCM', 25000.00, 'GHN', NULL, 'DELIVERED', 'VNPAY', 17990000.00, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('ORD-011', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', 35000.00, 'GHTK', NULL, 'DELIVERED', 'COD', 42990000.00, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('ORD-012', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', 30000.00, 'GHN', NULL, 'DELIVERED', 'VNPAY', 35990000.00, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
-- 3 ngày trước (3 orders - 2 DELIVERED, 1 SHIPPING)
('ORD-013', 9, 'tai.dang@gmail.com', 'Đặng Văn Tài', '0989012345', '444 Điện Biên Phủ, TP.HCM', 25000.00, 'GHN', NULL, 'DELIVERED', 'COD', 25000000.00, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('ORD-014', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', 30000.00, 'GHTK', NULL, 'DELIVERED', 'VNPAY', 18000000.00, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('ORD-015', 10, 'kim.ly@gmail.com', 'Lý Thị Kim', '0990123456', '555 Cách Mạng Tháng 8, TP.HCM', 30000.00, 'GHN', NULL, 'SHIPPING', 'COD', 32990000.00, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
-- 2 ngày trước (2 orders - 1 DELIVERED, 1 CONFIRMED)
('ORD-016', 2, 'huong.tran@gmail.com', 'Trần Thị Hương', '0912345678', '123 Lê Lợi, TP.HCM', 25000.00, 'GHN', NULL, 'DELIVERED', 'VNPAY', 29990000.00, NULL, NOW() - INTERVAL '2 days', NOW()),
('ORD-017', 3, 'nam.le@gmail.com', 'Lê Văn Nam', '0923456789', '789 Trần Hưng Đạo, TP.HCM', 30000.00, 'GHTK', NULL, 'CONFIRMED', 'COD', 17990000.00, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
-- 1 ngày trước (2 orders - 1 PENDING, 1 CONFIRMED)
('ORD-018', 11, 'long.truong@gmail.com', 'Trương Văn Long', '0901234568', '666 Võ Thị Sáu, TP.HCM', 35000.00, 'GHN', NULL, 'PENDING', 'VNPAY', 42990000.00, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('ORD-019', 4, 'mai.pham@gmail.com', 'Phạm Thị Mai', '0934567890', '321 Võ Văn Tần, TP.HCM', 30000.00, 'GHN', NULL, 'CONFIRMED', 'COD', 35990000.00, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
-- Hôm nay (1 order - PENDING)
('ORD-020', 12, 'nga.phan@gmail.com', 'Phan Thị Nga', '0912345679', '777 Phan Xích Long, TP.HCM', 25000.00, 'GHTK', NULL, 'PENDING', 'VNPAY', 25000000.00, NULL, NOW(), NOW());

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
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
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
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
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider VARCHAR(20),
    transaction_id VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    note TEXT,
    reconciled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: payments
INSERT INTO payments (order_id, provider, transaction_id, amount, status, note, reconciled) VALUES
(2, 'VNPAY', 'VNPAY-20241204142000-12345', 29990000.00, 'SUCCESS', 'Thanh toán thành công qua VNPay', FALSE),
(4, 'VNPAY', 'VNPAY-20241205080000-67890', 42990000.00, 'SUCCESS', 'Thanh toán thành công qua VNPay', FALSE),
(1, NULL, NULL, 32990000.00, 'SUCCESS', 'Thanh toán COD', TRUE),
(3, NULL, NULL, 17990000.00, 'CANCELLED', 'Đơn hàng đã hủy', FALSE),
(5, NULL, NULL, 35990000.00, 'SUCCESS', 'Thanh toán COD', TRUE);

-- Table: payment_callback_logs
CREATE TABLE IF NOT EXISTS payment_callback_logs (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    request_data TEXT,
    response_code VARCHAR(20),
    transaction_id VARCHAR(100),
    signature VARCHAR(255),
    signature_valid BOOLEAN,
    error_message TEXT,
    received_at TIMESTAMP NOT NULL
);

-- Sample data: payment_callback_logs
INSERT INTO payment_callback_logs (payment_id, request_data, response_code, transaction_id, signature, signature_valid, error_message, received_at) VALUES
(1, '{"vnp_Amount": "2999000000", "vnp_ResponseCode": "00"}', '00', 'VNPAY-20241204142000-12345', 'abc123def456', TRUE, NULL, NOW() - INTERVAL '7 days'),
(2, '{"vnp_Amount": "4299000000", "vnp_ResponseCode": "00"}', '00', 'VNPAY-20241205080000-67890', 'xyz789uvw012', TRUE, NULL, NOW() - INTERVAL '6 days');

-- ============================================
-- 5. CART DOMAIN
-- ============================================

-- Table: carts
CREATE TABLE IF NOT EXISTS carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0 NOT NULL
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
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0 NOT NULL
);

-- Sample data: cart_items
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 2, 1),
(1, 5, 1),
(2, 1, 2),
(3, 3, 1),
(4, 4, 1);

-- ============================================
-- 6. INTERACTION DOMAIN
-- ============================================

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: reviews
INSERT INTO reviews (user_id, product_id, order_id, rating, comment) VALUES
(2, 1, 1, 5, 'Sản phẩm rất tốt, camera đẹp, pin trâu!'),
(3, 1, 7, 4, 'Máy đẹp nhưng hơi nóng khi chơi game'),
(4, 2, 2, 5, 'Samsung S24 Ultra xứng đáng flagship, bút S Pen tiện lợi'),
(2, 3, 6, 5, 'Xiaomi 14 giá rẻ mà cấu hình khủng, đáng mua!'),
(3, 4, 4, 5, 'MacBook Pro M3 quá mượt, code cả ngày không nóng');

-- Table: review_likes
CREATE TABLE IF NOT EXISTS review_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    review_id BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
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
    admin_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: conversations
INSERT INTO conversations (user_id, admin_id, session_id, status) VALUES
(2, 1, NULL, 'CLOSED'),
(3, 1, NULL, 'OPEN'),
(NULL, NULL, 'GUEST-SESSION-001', 'OPEN'),
(4, 1, NULL, 'CLOSED'),
(NULL, NULL, 'GUEST-SESSION-002', 'CLOSED');

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data: messages
INSERT INTO messages (conversation_id, sender_type, content, metadata) VALUES
(1, 'USER', 'Cho tôi hỏi iPhone 15 Pro Max còn hàng không?', NULL),
(1, 'BOT', 'Hiện tại iPhone 15 Pro Max còn 50 máy. Bạn muốn đặt hàng không?', '{"product_id": 1}'::jsonb),
(2, 'USER', 'Xiaomi 14 có bảo hành bao lâu?', NULL),
(2, 'ADMIN', 'Sản phẩm bảo hành chính hãng 12 tháng tại trung tâm bảo hành Xiaomi', NULL),
(3, 'USER', 'Tôi muốn tư vấn mua laptop', NULL);

-- ============================================
-- END OF INITIALIZATION SCRIPT
-- ============================================
