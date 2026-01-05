-- 003_SEED_PRODUCTS_DATA.SQL
-- Seed data for UTE Phone Hub - HOT PRODUCTS 2025
-- 25 sản phẩm (Điện thoại, Tablet, Laptop, Smartwatch)


-- 1. ĐIỆN THOẠI (10 products)


-- iPhone 15 Pro Max
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max', 'iPhone 15 Pro Max - Điện thoại cao cấp với chip A17 Pro, camera 48MP, viền titan sang trọng', 
 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', 
 TRUE, FALSE, 1, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(1, 'APPLE-IP15PM-256-BLUE', 'Blue Titanium', '256GB', '8GB', 34990000.00, 50, 'IN_STOCK', TRUE),
(1, 'APPLE-IP15PM-256-BLACK', 'Black Titanium', '256GB', '8GB', 34990000.00, 45, 'IN_STOCK', TRUE),
(1, 'APPLE-IP15PM-512-NATURAL', 'Natural Titanium', '512GB', '8GB', 40990000.00, 30, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type, 
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(1, '2796 x 1290', 6.7, 'Super Retina XDR OLED', 120, 'Apple A17 Pro', 'Apple GPU 6-core',
48.0, '48MP Wide + 12MP Ultra Wide + 12MP Telephoto 5x', 12.0, 4422, 20, 'USB-C PD / MagSafe',
221.0, '159.9 x 76.7 x 8.25 mm', 'Titanium', 'iOS 17', '5G, Wi-Fi 6E, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Face ID');

-- iPhone 15
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(2, 'iPhone 15', 'iPhone 15 - Điện thoại thông minh với chip A16 Bionic, camera 48MP, Dynamic Island',
 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-pink-thumbnew-600x600.jpg',
 TRUE, FALSE, 1, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(2, 'APPLE-IP15-128-PINK', 'Pink', '128GB', '6GB', 22990000.00, 60, 'IN_STOCK', TRUE),
(2, 'APPLE-IP15-128-BLACK', 'Black', '128GB', '6GB', 22990000.00, 55, 'IN_STOCK', TRUE),
(2, 'APPLE-IP15-256-BLUE', 'Blue', '256GB', '6GB', 25990000.00, 40, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(2, '2556 x 1179', 6.1, 'Super Retina XDR OLED', 60, 'Apple A16 Bionic', 'Apple GPU 5-core',
48.0, '48MP Wide + 12MP Ultra Wide', 12.0, 3349, 20, 'USB-C PD',
171.0, '147.6 x 71.6 x 7.8 mm', 'Aluminum + Glass', 'iOS 17', '5G, Wi-Fi 6, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Face ID');

-- iPhone 14
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(3, 'iPhone 14', 'iPhone 14 - Điện thoại Apple thế hệ trước, hiệu năng ổn định với chip A15 Bionic',
 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-thumb-tim-1-600x600.jpg',
 TRUE, FALSE, 1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(3, 'APPLE-IP14-128-PURPLE', 'Purple', '128GB', '6GB', 18990000.00, 70, 'IN_STOCK', TRUE),
(3, 'APPLE-IP14-128-MIDNIGHT', 'Midnight', '128GB', '6GB', 18990000.00, 65, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(3, '2532 x 1170', 6.1, 'Super Retina XDR OLED', 60, 'Apple A15 Bionic', 'Apple GPU 5-core',
12.0, '12MP Dual camera', 12.0, 3279, 20, 'Lightning',
172.0, '146.7 x 71.5 x 7.8 mm', 'Aluminum + Glass', 'iOS 16', '5G, Wi-Fi 6, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Face ID');

-- Samsung Galaxy S24 Ultra
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(4, 'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra - Flagship Android với bút S Pen, camera 200MP, AI tích hợp',
 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg',
 TRUE, FALSE, 1, 2, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(4, 'SAMSUNG-S24U-256-GRAY', 'Titanium Gray', '256GB', '12GB', 29990000.00, 40, 'IN_STOCK', TRUE),
(4, 'SAMSUNG-S24U-512-BLACK', 'Titanium Black', '512GB', '12GB', 33990000.00, 35, 'IN_STOCK', TRUE),
(4, 'SAMSUNG-S24U-512-VIOLET', 'Titanium Violet', '512GB', '12GB', 33990000.00, 25, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(4, '3120 x 1440', 6.8, 'Dynamic AMOLED 2X', 120, 'Snapdragon 8 Gen 3', 'Adreno 750',
200.0, '200MP + 50MP Telephoto + 12MP Ultra Wide + 10MP Telephoto', 12.0, 5000, 45, 'USB-C PD 3.0',
232.0, '162.3 x 79.0 x 8.6 mm', 'Titanium Frame + Gorilla Armor', 'Android 14', '5G, Wi-Fi 7, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP68', 'Ultrasonic Fingerprint');

-- Samsung Galaxy S23 FE
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(5, 'Samsung Galaxy S23 FE', 'Samsung Galaxy S23 FE - Flagship giá tốt với hiệu năng Exynos 2200, camera 50MP',
 'https://cdn.tgdd.vn/Products/Images/42/316881/samsung-galaxy-s23-fe-mint-thumbnew-600x600.jpg',
 TRUE, FALSE, 1, 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(5, 'SAMSUNG-S23FE-128-MINT', 'Mint', '128GB', '8GB', 12990000.00, 60, 'IN_STOCK', TRUE),
(5, 'SAMSUNG-S23FE-128-GRAPHITE', 'Graphite', '128GB', '8GB', 12990000.00, 55, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(5, '2340 x 1080', 6.4, 'Dynamic AMOLED 2X', 120, 'Exynos 2200', 'Xclipse 920',
50.0, '50MP + 12MP Ultra Wide + 8MP Telephoto', 10.0, 4500, 25, 'USB-C PD',
209.0, '158.0 x 76.5 x 8.2 mm', 'Aluminum + Gorilla Glass 5', 'Android 13', '5G, Wi-Fi 6E, Bluetooth 5.3', 'Dual SIM', 'IP68', 'In-display Fingerprint');

-- Samsung Galaxy A54
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(21, 'Samsung Galaxy A54', 'Samsung Galaxy A54 - Điện thoại tầm trung với camera 50MP, màn hình Super AMOLED 120Hz',
 'https://cdn.tgdd.vn/Products/Images/42/302816/samsung-galaxy-a54-5g-den-thumb-600x600.jpg',
 TRUE, FALSE, 1, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(21, 'SAMSUNG-A54-128-BLACK', 'Awesome Black', '128GB', '8GB', 9490000.00, 80, 'IN_STOCK', TRUE),
(21, 'SAMSUNG-A54-256-VIOLET', 'Awesome Violet', '256GB', '8GB', 10490000.00, 70, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(21, '2400 x 1080', 6.4, 'Super AMOLED', 120, 'Exynos 1380', 'Mali-G68 MP5',
50.0, '50MP + 12MP Ultra Wide + 5MP Macro', 32.0, 5000, 25, 'USB-C PD',
7.0, '158.2 x 76.7 x 8.2 mm', 'Plastic + Gorilla Glass 5', 'Android 13', '5G, Wi-Fi 6, Bluetooth 5.3', 'Dual SIM', 'IP67', 'In-display Fingerprint');

-- Xiaomi 14
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(22, 'Xiaomi 14', 'Xiaomi 14 - Flagship với chip Snapdragon 8 Gen 3, camera Leica 50MP, sạc nhanh 90W',
 'https://cdn.tgdd.vn/Products/Images/42/320621/xiaomi-14-white-thumbnew-600x600.jpg',
 TRUE, FALSE, 1, 3, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(22, 'XIAOMI-14-256-WHITE', 'White', '256GB', '12GB', 21990000.00, 50, 'IN_STOCK', TRUE),
(22, 'XIAOMI-14-512-BLACK', 'Black', '512GB', '12GB', 24990000.00, 40, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(22, '2670 x 1200', 6.36, 'AMOLED', 120, 'Snapdragon 8 Gen 3', 'Adreno 750',
50.0, 'Leica 50MP + 50MP Telephoto + 50MP Ultra Wide', 32.0, 4610, 90, 'USB-C PD',
193.0, '152.8 x 71.5 x 8.2 mm', 'Aluminum + Glass', 'Android 14 (HyperOS)', '5G, Wi-Fi 7, Bluetooth 5.4', 'Dual SIM', 'IP68', 'In-display Fingerprint');

-- Xiaomi Redmi Note 13 Pro
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(23, 'Xiaomi Redmi Note 13 Pro', 'Xiaomi Redmi Note 13 Pro - Smartphone giá rẻ camera 200MP, sạc nhanh 67W',
 'https://cdn.tgdd.vn/Products/Images/42/316771/xiaomi-redmi-note-13-pro-purple-thumbnew-600x600.jpg',
 TRUE, FALSE, 1, 3, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(23, 'XIAOMI-RN13P-128-PURPLE', 'Midnight Purple', '128GB', '8GB', 7490000.00, 90, 'IN_STOCK', TRUE),
(23, 'XIAOMI-RN13P-256-BLACK', 'Midnight Black', '256GB', '8GB', 8490000.00, 80, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(23, '2712 x 1220', 6.67, 'AMOLED', 120, 'Snapdragon 7s Gen 2', 'Adreno 710',
200.0, '200MP + 8MP Ultra Wide + 2MP Macro', 16.0, 5100, 67, 'USB-C PD',
187.0, '161.4 x 74.2 x 8.0 mm', 'Plastic + Glass', 'Android 13 (MIUI 14)', '5G, Wi-Fi 6, Bluetooth 5.2', 'Dual SIM', 'IP54', 'Side Fingerprint');

-- OPPO Reno11 F
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(24, 'OPPO Reno11 F', 'OPPO Reno11 F - Điện thoại camera chân dung chuyên nghiệp, chip MediaTek Dimensity 7050',
 'https://cdn.tgdd.vn/Products/Images/42/322096/oppo-reno11-f-green-thumbnew-600x600.jpg',
 TRUE, FALSE, 1, 4, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(24, 'OPPO-RENO11F-128-GREEN', 'Ocean Green', '128GB', '8GB', 8990000.00, 70, 'IN_STOCK', TRUE),
(24, 'OPPO-RENO11F-256-PURPLE', 'Palm Purple', '256GB', '8GB', 9990000.00, 60, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(24, '2412 x 1080', 6.7, 'AMOLED', 120, 'MediaTek Dimensity 7050', 'Mali-G68 MC4',
64.0, '64MP + 8MP Ultra Wide + 2MP Macro', 32.0, 5000, 67, 'USB-C SuperVOOC',
177.0, '161.1 x 74.7 x 7.54 mm', 'Plastic + Glass', 'Android 14 (ColorOS 14)', '5G, Wi-Fi 6, Bluetooth 5.3', 'Dual SIM', 'IP65', 'In-display Fingerprint');

-- OPPO A79
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(25, 'OPPO A79', 'OPPO A79 - Smartphone giá rẻ màn hình 90Hz, pin 5000mAh, sạc nhanh 33W',
 'https://cdn.tgdd.vn/Products/Images/42/319622/oppo-a79-tim-thumb-1-600x600.jpg',
 TRUE, FALSE, 1, 4, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(25, 'OPPO-A79-128-PURPLE', 'Mystery Purple', '128GB', '8GB', 6290000.00, 100, 'IN_STOCK', TRUE),
(25, 'OPPO-A79-128-BLACK', 'Glowing Black', '128GB', '8GB', 6290000.00, 95, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(25, '2400 x 1080', 6.72, 'IPS LCD', 90, 'MediaTek Dimensity 6020', 'Mali-G57 MC2',
50.0, '50MP + 2MP Depth', 8.0, 5000, 33, 'USB-C SuperVOOC',
193.0, '165.7 x 76.1 x 7.99 mm', 'Plastic', 'Android 13 (ColorOS 13.1)', '5G, Wi-Fi 5, Bluetooth 5.3', 'Dual SIM', 'IPX4', 'Side Fingerprint');


-- 2. TABLET (5 products)


-- iPad Pro 11" M2
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(6, 'iPad Pro 11" M2', 'iPad Pro 11 inch M2 - Máy tính bảng cao cấp với chip M2, màn hình Liquid Retina 120Hz',
 'https://cdn.tgdd.vn/Products/Images/522/325515/ipad-pro-11-inch-m2-wifi-gray-thumb-600x600.jpg',
 TRUE, FALSE, 2, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(6, 'APPLE-IPADPRO11-128-GRAY', 'Space Gray', '128GB', '8GB', 22990000.00, 40, 'IN_STOCK', TRUE),
(6, 'APPLE-IPADPRO11-256-SILVER', 'Silver', '256GB', '8GB', 25990000.00, 35, 'IN_STOCK', TRUE),
(6, 'APPLE-IPADPRO11-512-GRAY', 'Space Gray', '512GB', '8GB', 31990000.00, 25, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity) VALUES
(6, '2388 x 1668', 11.0, 'Liquid Retina IPS LCD', 120, 'Apple M2', 'Apple GPU 10-core',
12.0, 12.0, 7538, 20, 'USB-C PD',
466.0, '247.6 x 178.5 x 5.9 mm', 'Aluminum', 'iPadOS 17', 'Wi-Fi 6E, Bluetooth 5.3');

-- iPad Air 11" M2
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(7, 'iPad Air 11" M2', 'iPad Air 11 inch M2 - Máy tính bảng mỏng nhẹ hiệu năng cao với chip M2',
 'https://cdn.tgdd.vn/Products/Images/522/329149/ipad-air-11-inch-m2-wifi-blue-thumb-600x600.jpg',
 TRUE, FALSE, 2, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(7, 'APPLE-IPADAIR11-128-BLUE', 'Blue', '128GB', '8GB', 16990000.00, 50, 'IN_STOCK', TRUE),
(7, 'APPLE-IPADAIR11-256-PURPLE', 'Purple', '256GB', '8GB', 19990000.00, 45, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity) VALUES
(7, '2360 x 1640', 11.0, 'Liquid Retina IPS LCD', 60, 'Apple M2', 'Apple GPU 10-core',
12.0, 12.0, 7606, 20, 'USB-C PD',
462.0, '247.6 x 178.5 x 6.1 mm', 'Aluminum', 'iPadOS 17', 'Wi-Fi 6E, Bluetooth 5.3');

-- Samsung Galaxy Tab S9
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(8, 'Samsung Galaxy Tab S9', 'Samsung Galaxy Tab S9 - Tablet Android cao cấp với bút S Pen, màn hình Dynamic AMOLED 2X',
 'https://cdn.tgdd.vn/Products/Images/522/309816/samsung-galaxy-tab-s9-grey-thumb-600x600.jpg',
 TRUE, FALSE, 2, 2, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(8, 'SAMSUNG-TABS9-128-GRAY', 'Graphite', '128GB', '8GB', 19990000.00, 35, 'IN_STOCK', TRUE),
(8, 'SAMSUNG-TABS9-256-BEIGE', 'Beige', '256GB', '12GB', 22990000.00, 30, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity, water_resistance) VALUES
(8, '2560 x 1600', 11.0, 'Dynamic AMOLED 2X', 120, 'Snapdragon 8 Gen 2', 'Adreno 740',
13.0, 12.0, 8400, 45, 'USB-C PD',
498.0, '254.3 x 165.8 x 5.9 mm', 'Armor Aluminum', 'Android 13', 'Wi-Fi 6E, Bluetooth 5.3', 'IP68');

-- Samsung Galaxy Tab A9+
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(9, 'Samsung Galaxy Tab A9+', 'Samsung Galaxy Tab A9+ - Tablet giá rẻ màn hình 11 inch, loa quad',
 'https://cdn.tgdd.vn/Products/Images/522/318814/samsung-galaxy-tab-a9-plus-xam-thumb-600x600.jpg',
 TRUE, FALSE, 2, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(9, 'SAMSUNG-TABA9PLUS-64-GRAY', 'Graphite', '64GB', '4GB', 5990000.00, 60, 'IN_STOCK', TRUE),
(9, 'SAMSUNG-TABA9PLUS-128-SILVER', 'Silver', '128GB', '8GB', 7490000.00, 50, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity) VALUES
(9, '1920 x 1200', 11.0, 'IPS LCD', 90, 'Snapdragon 695', 'Adreno 619',
8.0, 5.0, 7040, 15, 'USB-C',
480.0, '257.1 x 169.5 x 6.9 mm', 'Metal', 'Android 13', 'Wi-Fi 5, Bluetooth 5.1');

-- Xiaomi Redmi Pad SE
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(10, 'Xiaomi Redmi Pad SE', 'Xiaomi Redmi Pad SE - Tablet giá rẻ màn hình 11 inch, pin 8000mAh',
 'https://cdn.tgdd.vn/Products/Images/522/316892/xiaomi-redmi-pad-se-xanh-thumb-600x600.jpg',
 TRUE, FALSE, 2, 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(10, 'XIAOMI-PADSE-128-MINT', 'Mint Green', '128GB', '6GB', 5190000.00, 70, 'IN_STOCK', TRUE),
(10, 'XIAOMI-PADSE-256-LAVENDER', 'Lavender Purple', '256GB', '8GB', 6490000.00, 60, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
camera_megapixels, front_camera_megapixels, battery_capacity, charging_power, charging_type,
weight, dimensions, material, operating_system, wireless_connectivity) VALUES
(10, '1920 x 1200', 11.0, 'IPS LCD', 90, 'Snapdragon 680', 'Adreno 610',
8.0, 5.0, 8000, 10, 'USB-C',
478.0, '255.5 x 167.1 x 7.36 mm', 'Aluminum', 'Android 13 (MIUI Pad 14)', 'Wi-Fi 5, Bluetooth 5.0');

-- 3. LAPTOP (5 products)


-- MacBook Air M3 15"
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(11, 'MacBook Air 15" M3', 'MacBook Air 15 inch M3 - Laptop mỏng nhẹ với chip M3, màn hình Liquid Retina 15.3 inch',
 'https://cdn.tgdd.vn/Products/Images/44/329025/macbook-air-15-inch-m3-2024-gray-thumb-600x600.jpg',
 TRUE, FALSE, 3, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(11, 'APPLE-MBA15M3-256-GRAY', 'Space Gray', '256GB', '8GB', 34990000.00, 30, 'IN_STOCK', TRUE),
(11, 'APPLE-MBA15M3-512-SILVER', 'Silver', '512GB', '16GB', 42990000.00, 25, 'IN_STOCK', TRUE),
(11, 'APPLE-MBA15M3-512-MIDNIGHT', 'Midnight', '512GB', '16GB', 42990000.00, 20, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity, audio_features) VALUES
(11, '2880 x 1864', 15.3, 'Liquid Retina IPS', 60, 'Apple M3 8-core', 'Apple GPU 10-core',
66, 35, 1510.0, '340.4 x 237.6 x 11.5 mm', 'Aluminum Unibody', 'macOS Sonoma', 'Magic Keyboard with Touch ID',
'2x Thunderbolt 4 / USB-C, 3.5mm Audio', 'Wi-Fi 6E, Bluetooth 5.3', '6-speaker with Spatial Audio');

-- MacBook Pro 14" M3
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(12, 'MacBook Pro 14" M3', 'MacBook Pro 14 inch M3 - Laptop chuyên nghiệp cho developer, designer với chip M3',
 'https://cdn.tgdd.vn/Products/Images/44/325470/macbook-pro-14-inch-m3-2023-gray-thumb-600x600.jpg',
 TRUE, FALSE, 3, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(12, 'APPLE-MBP14M3-512-GRAY', 'Space Gray', '512GB', '16GB', 44990000.00, 25, 'IN_STOCK', TRUE),
(12, 'APPLE-MBP14M3-1TB-SILVER', 'Silver', '1TB', '16GB', 52990000.00, 20, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity, audio_features) VALUES
(12, '3024 x 1964', 14.2, 'Liquid Retina XDR', 120, 'Apple M3 8-core', 'Apple GPU 10-core',
70, 67, 1550.0, '312.6 x 221.2 x 15.5 mm', 'Aluminum Unibody', 'macOS Sonoma', 'Magic Keyboard with Touch ID',
'3x Thunderbolt 4 / USB-C, HDMI 2.1, SDXC, MagSafe 3', 'Wi-Fi 6E, Bluetooth 5.3', '6-speaker with Spatial Audio');

-- Dell XPS 13 Plus
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(13, 'Dell XPS 13 Plus', 'Dell XPS 13 Plus - Laptop cao cấp với màn hình OLED cảm ứng, Intel Core i7 Gen 13',
 'https://cdn.tgdd.vn/Products/Images/44/309016/dell-xps-13-plus-9320-i7-u759746win11-thumb-600x600.jpg',
 TRUE, FALSE, 3, 5, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(13, 'DELL-XPS13P-512-PLATINUM', 'Platinum', '512GB', '16GB', 39990000.00, 20, 'IN_STOCK', TRUE),
(13, 'DELL-XPS13P-1TB-GRAPHITE', 'Graphite', '1TB', '32GB', 49990000.00, 15, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity, audio_features, security_features) VALUES
(13, '3456 x 2160', 13.4, 'OLED Touch', 60, 'Intel Core i7-1360P', 'Intel Iris Xe Graphics',
55, 65, 1240.0, '295.3 x 199.1 x 15.3 mm', 'CNC Aluminum', 'Windows 11 Pro', 'Capacitive Touch Function Keys',
'2x Thunderbolt 4 / USB-C', 'Wi-Fi 6E, Bluetooth 5.3', 'Quad Stereo Speakers', 'Windows Hello IR Camera');

-- Dell Inspiron 15 3520
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(14, 'Dell Inspiron 15 3520', 'Dell Inspiron 15 3520 - Laptop phổ thông cho văn phòng, học sinh sinh viên',
 'https://cdn.tgdd.vn/Products/Images/44/307727/dell-inspiron-15-3520-i5-n5i5791w1-thumb-600x600.jpg',
 TRUE, FALSE, 3, 5, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(14, 'DELL-INS15-256-CARBON', 'Carbon Black', '256GB', '8GB', 12990000.00, 50, 'IN_STOCK', TRUE),
(14, 'DELL-INS15-512-SILVER', 'Platinum Silver', '512GB', '16GB', 15990000.00, 40, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity) VALUES
(14, '1920 x 1080', 15.6, 'WVA IPS', 60, 'Intel Core i5-1235U', 'Intel UHD Graphics',
41, 65, 1650.0, '358.5 x 235.6 x 16.96 mm', 'Plastic', 'Windows 11 Home', 'Standard Chiclet',
'1x USB 3.2, 2x USB 2.0, 1x HDMI, 1x RJ45, 1x SD Card, 1x Audio Jack', 'Wi-Fi 5, Bluetooth 5.0');

-- Samsung Galaxy Book3 (nếu có)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(15, 'Samsung Galaxy Book3', 'Samsung Galaxy Book3 - Laptop Windows mỏng nhẹ với Intel Core i5 Gen 13',
 'https://cdn.tgdd.vn/Products/Images/44/306174/samsung-galaxy-book3-i5-np750xfg-kb1vn-thumb-600x600.jpg',
 TRUE, FALSE, 3, 2, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(15, 'SAMSUNG-BOOK3-256-SILVER', 'Mystic Silver', '256GB', '8GB', 18990000.00, 30, 'IN_STOCK', TRUE),
(15, 'SAMSUNG-BOOK3-512-GRAPHITE', 'Graphite', '512GB', '16GB', 22990000.00, 25, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu,
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity) VALUES
(15, '1920 x 1080', 15.6, 'IPS FHD', 60, 'Intel Core i5-1335U', 'Intel Iris Xe Graphics',
54, 65, 1580.0, '355.4 x 229.4 x 15.4 mm', 'Aluminum', 'Windows 11 Home', 'Island-Style Backlit',
'1x USB-C, 2x USB-A 3.2, 1x HDMI, 1x MicroSD, 1x Audio Jack', 'Wi-Fi 6E, Bluetooth 5.1');


-- 4. ĐỒNG HỒ THÔNG MINH (5 products)


-- Apple Watch Series 9
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(16, 'Apple Watch Series 9', 'Apple Watch Series 9 - Smartwatch cao cấp với chip S9, màn hình Always-On Retina',
 'https://cdn.tgdd.vn/Products/Images/7077/320225/apple-watch-s9-lte-45mm-vien-nhom-day-cao-su-thumb-600x600.jpg',
 TRUE, FALSE, 5, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(16, 'APPLE-AWS9-45-MIDNIGHT', 'Midnight Aluminum', '45mm', '1GB', 11490000.00, 40, 'IN_STOCK', TRUE),
(16, 'APPLE-AWS9-41-PINK', 'Pink Aluminum', '41mm', '1GB', 10490000.00, 35, 'IN_STOCK', TRUE),
(16, 'APPLE-AWS9-45-STARLIGHT', 'Starlight Aluminum', '45mm', '1GB', 11490000.00, 30, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, case_size, weight, material, water_resistance,
health_features, battery_capacity, battery_life_days, operating_system, wireless_connectivity, additional_specs) VALUES
(16, '484 x 396', 1.9, 'LTPO3 OLED Always-On Retina', '45mm', 38.7, 'Aluminum', '50m (5 ATM)',
'ECG, Blood Oxygen, Heart Rate, Temperature, Crash & Fall Detection, Sleep Tracking', 309, 1, 'watchOS 10',
'Bluetooth 5.3, Wi-Fi 4, NFC, UWB, GPS/GLONASS', 'Double Tap gesture, Siri, Emergency SOS, Cellular (LTE)');

-- Apple Watch SE (2023)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(17, 'Apple Watch SE (2023)', 'Apple Watch SE Gen 2 - Smartwatch giá rẻ của Apple, đầy đủ tính năng cơ bản',
 'https://cdn.tgdd.vn/Products/Images/7077/325536/apple-watch-se-2023-gps-44mm-vien-nhom-day-cao-su-thumb-600x600.jpg',
 TRUE, FALSE, 5, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(17, 'APPLE-AWSE-44-MIDNIGHT', 'Midnight Aluminum', '44mm', '1GB', 6990000.00, 50, 'IN_STOCK', TRUE),
(17, 'APPLE-AWSE-40-STARLIGHT', 'Starlight Aluminum', '40mm', '1GB', 6490000.00, 45, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, case_size, weight, material, water_resistance,
health_features, battery_capacity, battery_life_days, operating_system, wireless_connectivity, additional_specs) VALUES
(17, '448 x 368', 1.78, 'LTPO OLED Retina', '44mm', 32.9, 'Aluminum', '50m (5 ATM)',
'Heart Rate, Crash & Fall Detection, Sleep Tracking', 296, 1, 'watchOS 10',
'Bluetooth 5.3, Wi-Fi 4, NFC, GPS/GLONASS', 'Siri, Emergency SOS, Family Setup');

-- Samsung Galaxy Watch6
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(18, 'Samsung Galaxy Watch6', 'Samsung Galaxy Watch6 - Smartwatch Android với Samsung Health, màn hình Super AMOLED',
 'https://cdn.tgdd.vn/Products/Images/7077/309732/samsung-galaxy-watch6-lte-44mm-thumb-600x600.jpg',
 TRUE, FALSE, 5, 2, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(18, 'SAMSUNG-GW6-44-GRAPHITE', 'Graphite', '44mm', '2GB', 7990000.00, 35, 'IN_STOCK', TRUE),
(18, 'SAMSUNG-GW6-40-GOLD', 'Gold', '40mm', '2GB', 6990000.00, 30, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, case_size, weight, material, water_resistance,
health_features, battery_capacity, battery_life_days, operating_system, wireless_connectivity, additional_specs) VALUES
(18, '480 x 480', 1.5, 'Super AMOLED', '44mm', 33.3, 'Sapphire Crystal + Aluminum', '5 ATM + IP68',
'ECG, BIA (Body Composition), Blood Pressure, SpO2, Heart Rate, Sleep Coaching', 425, 2, 'Wear OS 4 (One UI Watch 5)',
'Bluetooth 5.3, Wi-Fi 5, NFC, GPS/GLONASS, LTE', 'Samsung Pay, Bixby, Google Assistant');

-- Samsung Galaxy Watch FE
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(19, 'Samsung Galaxy Watch FE', 'Samsung Galaxy Watch FE - Smartwatch giá rẻ của Samsung, đầy đủ tính năng sức khỏe',
 'https://cdn.tgdd.vn/Products/Images/7077/329164/samsung-galaxy-watch-fe-den-thumb-600x600.jpg',
 TRUE, FALSE, 5, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(19, 'SAMSUNG-GWFE-40-BLACK', 'Black', '40mm', '1.5GB', 3990000.00, 60, 'IN_STOCK', TRUE),
(19, 'SAMSUNG-GWFE-40-SILVER', 'Silver', '40mm', '1.5GB', 3990000.00, 55, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, case_size, weight, material, water_resistance,
health_features, battery_capacity, battery_life_days, operating_system, wireless_connectivity) VALUES
(19, '396 x 396', 1.2, 'Super AMOLED', '40mm', 26.6, 'Aluminum', '5 ATM + IP68',
'Heart Rate, SpO2, Sleep Tracking, Stress Monitoring', 247, 2, 'Wear OS 4 (One UI Watch 5)',
'Bluetooth 5.3, Wi-Fi 5, NFC, GPS');

-- Xiaomi Watch S3
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(20, 'Xiaomi Watch S3', 'Xiaomi Watch S3 - Smartwatch cao cấp với màn hình AMOLED 1.43 inch, pin 15 ngày',
 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-den-thumb-600x600.jpg',
 TRUE, FALSE, 5, 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(20, 'XIAOMI-WATCHS3-46-BLACK', 'Midnight Black', '46mm', '1GB', 4490000.00, 50, 'IN_STOCK', TRUE),
(20, 'XIAOMI-WATCHS3-46-SILVER', 'Silver', '46mm', '1GB', 4490000.00, 45, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, case_size, weight, material, water_resistance,
health_features, battery_capacity, battery_life_days, operating_system, wireless_connectivity, additional_specs) VALUES
(20, '466 x 466', 1.43, 'AMOLED', '46mm', 48.0, 'Stainless Steel', '5 ATM',
'Heart Rate, SpO2, Sleep Tracking, Stress Monitoring, 150+ Sports Modes', 486, 15, 'HyperOS',
'Bluetooth 5.2, Wi-Fi 5, GPS/GLONASS/Galileo', 'Voice Assistant, NFC, Always-On Display');


-- Reset ID sequences for next inserts

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_templates_id_seq', (SELECT MAX(id) FROM product_templates));
SELECT setval('product_metadata_id_seq', (SELECT MAX(id) FROM product_metadata));


-- PRODUCT IMAGES - Thêm hình ảnh cho các sản phẩm


-- iPhone 15 Pro Max (ID: 1)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', 'iPhone 15 Pro Max Blue', 1),
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-1.jpg', 'iPhone 15 Pro Max Front', 2),
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-2.jpg', 'iPhone 15 Pro Max Back', 3);

-- iPhone 15 (ID: 2)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(2, 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-pink-thumbnew-600x600.jpg', 'iPhone 15 Pink', 1),
(2, 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-128gb-1.jpg', 'iPhone 15 Display', 2);

-- iPhone 14 (ID: 3)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(3, 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-thumb-tim-1-600x600.jpg', 'iPhone 14 Purple', 1),
(3, 'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-1.jpg', 'iPhone 14 Front', 2);

-- Samsung Galaxy S24 Ultra (ID: 6)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(6, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg', 'Galaxy S24 Ultra Gray', 1),
(6, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-1.jpg', 'Galaxy S24 Ultra Display', 2),
(6, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-2.jpg', 'Galaxy S24 Ultra Camera', 3);

-- Samsung Galaxy S23 FE (ID: 7)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(7, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s23-fe-mint-thumbnew-600x600.jpg', 'Galaxy S23 FE Mint', 1),
(7, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s23-fe-1.jpg', 'Galaxy S23 FE Front', 2);

-- Samsung Galaxy Z Fold6 (ID: 8)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(8, 'https://cdn.tgdd.vn/Products/Images/42/320830/samsung-galaxy-z-fold6-xam-thumbn-600x600.jpg', 'Galaxy Z Fold6 Gray', 1),
(8, 'https://cdn.tgdd.vn/Products/Images/42/320830/samsung-galaxy-z-fold6-1.jpg', 'Galaxy Z Fold6 Unfolded', 2);

-- Xiaomi 14 Ultra (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(11, 'https://cdn.tgdd.vn/Products/Images/42/319896/xiaomi-14-ultra-den-thumb-600x600.jpg', 'Xiaomi 14 Ultra Black', 1),
(11, 'https://cdn.tgdd.vn/Products/Images/42/319896/xiaomi-14-ultra-1.jpg', 'Xiaomi 14 Ultra Camera', 2);

-- Xiaomi Redmi Note 13 Pro (ID: 12)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(12, 'https://cdn.tgdd.vn/Products/Images/42/313205/xiaomi-redmi-note-13-pro-den-thumb-600x600.jpg', 'Redmi Note 13 Pro Black', 1),
(12, 'https://cdn.tgdd.vn/Products/Images/42/313205/xiaomi-redmi-note-13-pro-1.jpg', 'Redmi Note 13 Pro Display', 2);

-- OPPO Find X7 Ultra (ID: 16)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(16, 'https://cdn.tgdd.vn/Products/Images/42/329054/oppo-find-x7-ultra-thumb-600x600.jpg', 'OPPO Find X7 Ultra', 1),
(16, 'https://cdn.tgdd.vn/Products/Images/42/329054/oppo-find-x7-ultra-1.jpg', 'OPPO Find X7 Ultra Camera', 2);

-- OPPO Reno11 F 5G (ID: 17)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(17, 'https://cdn.tgdd.vn/Products/Images/42/320715/oppo-reno11-f-5g-xanh-thumb-600x600.jpg', 'OPPO Reno11 F Green', 1),
(17, 'https://cdn.tgdd.vn/Products/Images/42/320715/oppo-reno11-f-5g-1.jpg', 'OPPO Reno11 F Display', 2);

-- OPPO A98 (ID: 18)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(18, 'https://cdn.tgdd.vn/Products/Images/42/329056/oppo-a98-den-thumb-600x600.jpg', 'OPPO A98 Black', 1),
(18, 'https://cdn.tgdd.vn/Products/Images/42/329056/oppo-a98-1.jpg', 'OPPO A98 Front', 2);

-- iPad Pro M4 11 inch (ID: 4)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(4, 'https://cdn.tgdd.vn/Products/Images/522/329143/ipad-pro-11-inch-m4-wifi-256gb-thumb-600x600.jpg', 'iPad Pro M4 11 inch', 1),
(4, 'https://cdn.tgdd.vn/Products/Images/522/329143/ipad-pro-11-inch-m4-1.jpg', 'iPad Pro M4 Display', 2);

-- iPad Air M2 (ID: 5)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(5, 'https://cdn.tgdd.vn/Products/Images/522/329072/ipad-air-11-inch-m2-wifi-256gb-thumb-600x600.jpg', 'iPad Air M2', 1),
(5, 'https://cdn.tgdd.vn/Products/Images/522/329072/ipad-air-11-inch-m2-1.jpg', 'iPad Air M2 Display', 2);

-- Samsung Galaxy Tab S9 Ultra (ID: 9)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(9, 'https://cdn.tgdd.vn/Products/Images/522/306206/samsung-galaxy-tab-s9-ultra-thumb-600x600.jpg', 'Galaxy Tab S9 Ultra', 1),
(9, 'https://cdn.tgdd.vn/Products/Images/522/306206/samsung-galaxy-tab-s9-ultra-1.jpg', 'Galaxy Tab S9 Ultra Display', 2);

-- Samsung Galaxy Tab S9 FE (ID: 10)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(10, 'https://cdn.tgdd.vn/Products/Images/522/309816/samsung-galaxy-tab-s9-fe-wifi-thumb-600x600.jpg', 'Galaxy Tab S9 FE', 1),
(10, 'https://cdn.tgdd.vn/Products/Images/522/309816/samsung-galaxy-tab-s9-fe-1.jpg', 'Galaxy Tab S9 FE Display', 2);

-- Xiaomi Pad 6 (ID: 13)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(13, 'https://cdn.tgdd.vn/Products/Images/522/320721/xiaomi-pad-6-thumb-600x600.jpg', 'Xiaomi Pad 6', 1),
(13, 'https://cdn.tgdd.vn/Products/Images/522/320721/xiaomi-pad-6-1.jpg', 'Xiaomi Pad 6 Display', 2);

-- MacBook Pro 14 M3 (ID: 21)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(21, 'https://cdn.tgdd.vn/Products/Images/44/329035/macbook-pro-14-inch-m3-2023-thumb-600x600.jpg', 'MacBook Pro 14 M3', 1),
(21, 'https://cdn.tgdd.vn/Products/Images/44/329035/macbook-pro-14-m3-1.jpg', 'MacBook Pro 14 M3 Display', 2);

-- MacBook Air M3 13 inch (ID: 22)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(22, 'https://cdn.tgdd.vn/Products/Images/44/329220/macbook-air-13-inch-m3-2024-thumb-600x600.jpg', 'MacBook Air M3 13 inch', 1),
(22, 'https://cdn.tgdd.vn/Products/Images/44/329220/macbook-air-m3-13-inch-1.jpg', 'MacBook Air M3 Display', 2);

-- Dell XPS 13 Plus (ID: 501)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(501, 'https://cdn.tgdd.vn/Products/Images/44/321045/dell-xps-13-plus-9320-i7-thumb-600x600.jpg', 'Dell XPS 13 Plus', 1),
(501, 'https://cdn.tgdd.vn/Products/Images/44/321045/dell-xps-13-plus-1.jpg', 'Dell XPS 13 Plus Display', 2);

-- Dell Inspiron 15 (ID: 502)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(502, 'https://cdn.tgdd.vn/Products/Images/44/329118/dell-inspiron-15-3530-i5-thumb-600x600.jpg', 'Dell Inspiron 15', 1),
(502, 'https://cdn.tgdd.vn/Products/Images/44/329118/dell-inspiron-15-3530-1.jpg', 'Dell Inspiron 15 Display', 2);

-- Dell Alienware m16 R2 (ID: 503)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(503, 'https://cdn.tgdd.vn/Products/Images/44/328955/dell-alienware-m16-r2-ultra-9-thumb-600x600.jpg', 'Dell Alienware m16 R2', 1),
(503, 'https://cdn.tgdd.vn/Products/Images/44/328955/dell-alienware-m16-r2-1.jpg', 'Dell Alienware m16 R2 Gaming', 2);

-- Apple Watch Series 10 (ID: 23)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(23, 'https://cdn.tgdd.vn/Products/Images/7077/329145/apple-watch-series-10-gps-42mm-thumb-600x600.jpg', 'Apple Watch Series 10', 1),
(23, 'https://cdn.tgdd.vn/Products/Images/7077/329145/apple-watch-series-10-1.jpg', 'Apple Watch Series 10 Display', 2);

-- Apple Watch SE 2023 (ID: 24)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(24, 'https://cdn.tgdd.vn/Products/Images/7077/309017/apple-watch-se-2023-gps-40mm-thumb-600x600.jpg', 'Apple Watch SE 2023', 1),
(24, 'https://cdn.tgdd.vn/Products/Images/7077/309017/apple-watch-se-2023-1.jpg', 'Apple Watch SE 2023 Display', 2);

-- Samsung Galaxy Watch7 (ID: 206)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(206, 'https://cdn.tgdd.vn/Products/Images/7077/329128/samsung-galaxy-watch7-44mm-thumb-600x600.jpg', 'Samsung Galaxy Watch7', 1),
(206, 'https://cdn.tgdd.vn/Products/Images/7077/329128/samsung-galaxy-watch7-1.jpg', 'Samsung Galaxy Watch7 Display', 2);

-- Xiaomi Watch S3 (ID: 20)
INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(20, 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-den-thumb-600x600.jpg', 'Xiaomi Watch S3', 1),
(20, 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-1.jpg', 'Xiaomi Watch S3 Display', 2);

-- Reset sequence for product_images
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
