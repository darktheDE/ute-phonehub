-- 005_IMPORT_REAL_PRODUCTS.SQL
-- Import real product data scraped from TGDD/CellphoneS
-- IDs start from 26

-- 1. Samsung Galaxy Z Fold6 (Phone, Samsung)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(26, 'Samsung Galaxy Z Fold6 5G', 'Samsung Galaxy Z Fold6 mang đến thiết kế mỏng nhẹ đột phá, màn hình gập đỉnh cao cùng sức mạnh AI vượt trội với Galaxy AI.', 
 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-thumb-1-600x600.jpg', 
 TRUE, FALSE, 1, 2, NOW(), NOW());

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(26, 'SAMSUNG-ZFOLD6-256-GRAY', 'Silver Shadow', '256GB', '12GB', 43990000.00, 20, 'IN_STOCK', TRUE),
(26, 'SAMSUNG-ZFOLD6-512-NAVY', 'Navy', '512GB', '12GB', 47990000.00, 15, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type, 
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(26, 'QXGA+', 7.6, 'Dynamic AMOLED 2X', 120, 'Snapdragon 8 Gen 3 for Galaxy', 'Adreno 750',
50.0, '50MP + 12MP + 10MP', 10.0, 4400, 25, 'USB-C',
239.0, 'Expanded: 153.5 x 132.6 x 5.6 mm', 'Armor Aluminum + Gorilla Glass Victus 2', 'Android 14', '5G, Wi-Fi 7, Bluetooth 5.3', 'Dual SIM + eSIM', 'IP48', 'Side Fingerprint');

INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(26, 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-thumb-1-600x600.jpg', 'Samsung Galaxy Z Fold6 Thumbnail', 1, TRUE),
(26, 'https://cdn.tgdd.vn/Products/Images/42/320721/Slider/vi-vn-samsung-galaxy-z-fold6-5g-1.jpg', 'Samsung Galaxy Z Fold6 Front Back', 2, FALSE),
(26, 'https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-1-1-750x500.jpg', 'Samsung Galaxy Z Fold6 Hinge', 3, FALSE);


-- 2. Asus Zenbook 14 OLED (Laptop, Asus)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(27, 'Asus Zenbook 14 OLED', 'Asus Zenbook 14 OLED UX3405MA là biểu tượng của sự sang trọng và hiệu năng di động với chip Intel Core Ultra tích hợp AI.', 
 'https://cdn.tgdd.vn/Products/Images/44/320431/asus-zenbook-14-oled-thumb-mau-600x600.png', 
 TRUE, FALSE, 3, 6, NOW(), NOW());

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(27, 'ASUS-UX3405-512-BLUE', 'Ponder Blue', '512GB', '32GB', 34990000.00, 10, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity, audio_features) VALUES
(27, '2880 x 1800', 14.0, 'OLED 3K 120Hz', 120, 'Intel Core Ultra 5 125H', 'Intel Arc Graphics',
75, 65, 1200.0, '312.4 x 220.1 x 14.9 mm', 'Aluminum', 'Windows 11 Home', 'Backlit Chiclet', 
'1x USB 3.2, 2x Thunderbolt 4, 1x HDMI 2.1', 'Wi-Fi 6E, Bluetooth 5.3', 'Harman Kardon, Smart Amp');

INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(27, 'https://cdn.tgdd.vn/Products/Images/44/320431/asus-zenbook-14-oled-thumb-mau-600x600.png', 'Asus Zenbook 14 OLED Thumbnail', 1, TRUE),
(27, 'https://cdn.tgdd.vn/Products/Images/44/320431/asus-zenbook-14-oled-ux3405ma-ultra-5-pp151w-hinh-1-750x500.jpg', 'Asus Zenbook 14 OLED Design', 2, FALSE);


-- 3. Xiaomi Redmi Note 12 (Phone, Xiaomi)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(28, 'Xiaomi Redmi Note 12', 'Trải nghiệm thị giác tuyệt vời với màn hình AMOLED 120Hz mượt mà. Hiệu năng ổn định với chip Snapdragon 685.', 
 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-12_2_.png', 
 TRUE, FALSE, 1, 3, NOW(), NOW());

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(28, 'XIAOMI-RN12-128-BLUE', 'Ice Blue', '128GB', '4GB', 4990000.00, 50, 'IN_STOCK', TRUE),
(28, 'XIAOMI-RN12-128-GREY', 'Onyx Gray', '128GB', '4GB', 4990000.00, 45, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type, 
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(28, '2400 x 1080', 6.67, 'AMOLED', 120, 'Snapdragon 685', 'Adreno 610',
50.0, '50MP + 8MP + 2MP', 13.0, 5000, 33, 'USB-C',
183.5, '165.6 x 75.9 x 7.9 mm', 'Plastic', 'Android 13', '4G, Wi-Fi 5, Bluetooth 5.0', 'Dual SIM', 'IP53', 'Side Fingerprint');

INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(28, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-12_2_.png', 'Redmi Note 12 Thumbnail', 1, TRUE);


-- 4. Vivo V30 5G (Phone, Vivo)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(29, 'Vivo V30 5G', 'Nổi bật với hệ thống đèn Aura Light 3.0 hỗ trợ chụp chân dung chuyên nghiệp. Hiệu năng mạnh mẽ từ chip Snapdragon 7 Gen 3.', 
 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/i/vivo-v30.png', 
 TRUE, FALSE, 1, 10, NOW(), NOW());

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(29, 'VIVO-V30-256-GREEN', 'Green', '256GB', '12GB', 13990000.00, 30, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
camera_megapixels, camera_details, front_camera_megapixels, battery_capacity, charging_power, charging_type, 
weight, dimensions, material, operating_system, wireless_connectivity, sim_type, water_resistance, security_features) VALUES
(29, '1260 x 2800', 6.78, 'AMOLED 1.5K', 120, 'Snapdragon 7 Gen 3', 'Adreno 720',
50.0, '50MP OIS + 50MP Ultra Wide', 50.0, 5000, 80, 'USB-C',
186.0, '164.4 x 75.1 x 7.5 mm', 'Glass', 'Android 14', '5G, Wi-Fi 6, Bluetooth 5.4', 'Dual SIM', 'IP54', 'In-display Fingerprint');

INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(29, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/i/vivo-v30.png', 'Vivo V30 Thumbnail', 1, TRUE);


-- 5. iPad Gen 10 (Tablet, Apple)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(30, 'iPad Gen 10 10.9"', 'Thiết kế hoàn toàn mới với các cạnh vuông vức, màu sắc trẻ trung. Màn hình Liquid Retina sắc nét cùng chip A14 Bionic.', 
 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-10-9-inch-2022.png', 
 TRUE, FALSE, 2, 1, NOW(), NOW());

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(30, 'APPLE-IPAD10-64-SILVER', 'Silver', '64GB', '4GB', 9990000.00, 40, 'IN_STOCK', TRUE),
(30, 'APPLE-IPAD10-64-BLUE', 'Blue', '64GB', '4GB', 9990000.00, 35, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
camera_megapixels, front_camera_megapixels, battery_capacity, charging_power, charging_type, 
weight, dimensions, material, operating_system, wireless_connectivity) VALUES
(30, '2360 x 1640', 10.9, 'Liquid Retina IPS', 60, 'Apple A14 Bionic', 'Apple GPU 4-core',
12.0, 12.0, 7600, 20, 'USB-C',
477.0, '248.6 x 179.5 x 7 mm', 'Aluminum', 'iPadOS', 'Wi-Fi 6, Bluetooth 5.2');

INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(30, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-10-9-inch-2022.png', 'iPad Gen 10 Thumbnail', 1, TRUE);


-- 6. MacBook Air M2 (Laptop, Apple)
INSERT INTO products (id, name, description, thumbnail_url, status, is_deleted, category_id, brand_id, created_at, updated_at) VALUES
(31, 'MacBook Air M2 13.6"', 'Sự kết hợp hoàn hảo giữa thiết kế mỏng nhẹ đẳng cấp và hiệu năng vượt trội từ chip M2.', 
 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m2-2022-2.png', 
 TRUE, FALSE, 3, 1, NOW(), NOW());

INSERT INTO product_templates (product_id, sku, color, storage, ram, price, stock_quantity, stock_status, status) VALUES
(31, 'APPLE-AIRM2-256-MIDNIGHT', 'Midnight', '256GB', '8GB', 24990000.00, 25, 'IN_STOCK', TRUE),
(31, 'APPLE-AIRM2-256-STARLIGHT', 'Starlight', '256GB', '8GB', 24990000.00, 20, 'IN_STOCK', TRUE);

INSERT INTO product_metadata (product_id, screen_resolution, screen_size, screen_technology, refresh_rate, cpu_chipset, gpu, 
battery_capacity, charging_power, weight, dimensions, material, operating_system, keyboard_type, ports, wireless_connectivity, audio_features) VALUES
(31, '2560 x 1664', 13.6, 'Liquid Retina', 60, 'Apple M2', 'Apple GPU 8-core',
52, 30, 1240.0, '304.1 x 215 x 11.3 mm', 'Aluminum', 'macOS', 'Magic Keyboard', 
'2x Thunderbolt / USB 4, MagSafe 3', 'Wi-Fi 6, Bluetooth 5.0', '4-speaker sound system');

INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(31, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m2-2022-2.png', 'MacBook Air M2 Thumbnail', 1, TRUE);


-- Update sequences
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_templates_id_seq', (SELECT MAX(id) FROM product_templates));
SELECT setval('product_metadata_id_seq', (SELECT MAX(id) FROM product_metadata));
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
