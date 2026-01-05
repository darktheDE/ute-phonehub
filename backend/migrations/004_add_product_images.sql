
-- 004_ADD_PRODUCT_IMAGES.SQL
-- Thêm hình ảnh cho 25 sản phẩm seed data


-- iPhone 15 Pro Max (ID: 1)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', 'iPhone 15 Pro Max Blue', 1, true),
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-1.jpg', 'iPhone 15 Pro Max Front', 2, false),
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-2.jpg', 'iPhone 15 Pro Max Back', 3, false);

-- iPhone 15 (ID: 2)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(2, 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-pink-thumbnew-600x600.jpg', 'iPhone 15 Pink', 1, true),
(2, 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-128gb-1.jpg', 'iPhone 15 Display', 2, false);

-- iPhone 14 (ID: 3)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(3, 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-thumb-tim-1-600x600.jpg', 'iPhone 14 Purple', 1, true),
(3, 'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-1.jpg', 'iPhone 14 Front', 2, false);

-- Samsung Galaxy S24 Ultra (ID: 6)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(6, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg', 'Galaxy S24 Ultra Gray', 1, true),
(6, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-1.jpg', 'Galaxy S24 Ultra Display', 2, false),
(6, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-2.jpg', 'Galaxy S24 Ultra Camera', 3, false);

-- Samsung Galaxy S23 FE (ID: 5)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(5, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s23-fe-mint-thumbnew-600x600.jpg', 'Galaxy S23 FE Mint', 1, true),
(5, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s23-fe-1.jpg', 'Galaxy S23 FE Front', 2, false);

-- Samsung Galaxy Z Fold6 (ID: 8)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(8, 'https://cdn.tgdd.vn/Products/Images/42/320830/samsung-galaxy-z-fold6-xam-thumbn-600x600.jpg', 'Galaxy Z Fold6 Gray', 1),
(8, 'https://cdn.tgdd.vn/Products/Images/42/320830/samsung-galaxy-z-fold6-1.jpg', 'Galaxy Z Fold6 Unfolded', 2);

-- Xiaomi 14 Ultra (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(11, 'https://cdn.tgdd.vn/Products/Images/42/319896/xiaomi-14-ultra-den-thumb-600x600.jpg', 'Xiaomi 14 Ultra Black', 1),
(11, 'https://cdn.tgdd.vn/Products/Images/42/319896/xiaomi-14-ultra-1.jpg', 'Xiaomi 14 Ultra Camera', 2);

-- Xiaomi Redmi Note 13 Pro (ID: 12)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(12, 'https://cdn.tgdd.vn/Products/Images/42/313205/xiaomi-redmi-note-13-pro-den-thumb-600x600.jpg', 'Redmi Note 13 Pro Black', 1),
(12, 'https://cdn.tgdd.vn/Products/Images/42/313205/xiaomi-redmi-note-13-pro-1.jpg', 'Redmi Note 13 Pro Display', 2);

-- OPPO Find X7 Ultra (ID: 16)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(16, 'https://cdn.tgdd.vn/Products/Images/42/329054/oppo-find-x7-ultra-thumb-600x600.jpg', 'OPPO Find X7 Ultra', 1),
(16, 'https://cdn.tgdd.vn/Products/Images/42/329054/oppo-find-x7-ultra-1.jpg', 'OPPO Find X7 Ultra Camera', 2);

-- OPPO Reno11 F 5G (ID: 17)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(17, 'https://cdn.tgdd.vn/Products/Images/42/320715/oppo-reno11-f-5g-xanh-thumb-600x600.jpg', 'OPPO Reno11 F Green', 1),
(17, 'https://cdn.tgdd.vn/Products/Images/42/320715/oppo-reno11-f-5g-1.jpg', 'OPPO Reno11 F Display', 2);

-- OPPO A98 (ID: 18)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(18, 'https://cdn.tgdd.vn/Products/Images/42/329056/oppo-a98-den-thumb-600x600.jpg', 'OPPO A98 Black', 1),
(18, 'https://cdn.tgdd.vn/Products/Images/42/329056/oppo-a98-1.jpg', 'OPPO A98 Front', 2);

-- iPad Pro M4 11 inch (ID: 4)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(4, 'https://cdn.tgdd.vn/Products/Images/522/329143/ipad-pro-11-inch-m4-wifi-256gb-thumb-600x600.jpg', 'iPad Pro M4 11 inch', 1),
(4, 'https://cdn.tgdd.vn/Products/Images/522/329143/ipad-pro-11-inch-m4-1.jpg', 'iPad Pro M4 Display', 2);

-- iPad Air M2 (ID: 5)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(5, 'https://cdn.tgdd.vn/Products/Images/522/329072/ipad-air-11-inch-m2-wifi-256gb-thumb-600x600.jpg', 'iPad Air M2', 1),
(5, 'https://cdn.tgdd.vn/Products/Images/522/329072/ipad-air-11-inch-m2-1.jpg', 'iPad Air M2 Display', 2);

-- Samsung Galaxy Tab S9 Ultra (ID: 9)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(9, 'https://cdn.tgdd.vn/Products/Images/522/306206/samsung-galaxy-tab-s9-ultra-thumb-600x600.jpg', 'Galaxy Tab S9 Ultra', 1),
(9, 'https://cdn.tgdd.vn/Products/Images/522/306206/samsung-galaxy-tab-s9-ultra-1.jpg', 'Galaxy Tab S9 Ultra Display', 2);

-- Samsung Galaxy Tab S9 FE (ID: 10)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(10, 'https://cdn.tgdd.vn/Products/Images/522/309816/samsung-galaxy-tab-s9-fe-wifi-thumb-600x600.jpg', 'Galaxy Tab S9 FE', 1),
(10, 'https://cdn.tgdd.vn/Products/Images/522/309816/samsung-galaxy-tab-s9-fe-1.jpg', 'Galaxy Tab S9 FE Display', 2);

-- Xiaomi Pad 6 (ID: 13)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(13, 'https://cdn.tgdd.vn/Products/Images/522/320721/xiaomi-pad-6-thumb-600x600.jpg', 'Xiaomi Pad 6', 1),
(13, 'https://cdn.tgdd.vn/Products/Images/522/320721/xiaomi-pad-6-1.jpg', 'Xiaomi Pad 6 Display', 2);

-- MacBook Pro 14 M3 (ID: 21)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(21, 'https://macstores.vn/wp-content/uploads/2023/10/macbook-pro-m3-14-inch-xam-khong-gian-1.jpg', 'MacBook Pro 14 M3', 1),
(21, 'https://cdn.tgdd.vn/Products/Images/44/329035/macbook-pro-14-m3-1.jpg', 'MacBook Pro 14 M3 Display', 2);

-- MacBook Air M3 13 inch (ID: 22)
INSERT INTO product_images (product_id, image_url, alt_text, image_order) VALUES
(22, 'https://cdn.tgdd.vn/Products/Images/44/329220/macbook-air-13-inch-m3-2024-thumb-600x600.jpg', 'MacBook Air M3 13 inch', 1),
(22, 'https://cdn.tgdd.vn/Products/Images/44/329220/macbook-air-m3-13-inch-1.jpg', 'MacBook Air M3 Display', 2);

-- Dell XPS 13 Plus (ID: 13)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(13, 'https://cdn.tgdd.vn/Products/Images/44/321045/dell-xps-13-plus-9320-i7-thumb-600x600.jpg', 'Dell XPS 13 Plus', 1, true),
(13, 'https://cdn.tgdd.vn/Products/Images/44/321045/dell-xps-13-plus-1.jpg', 'Dell XPS 13 Plus Display', 2, false);

-- Dell Inspiron 15 (ID: 14)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(14, 'https://cdn.tgdd.vn/Products/Images/44/329118/dell-inspiron-15-3530-i5-thumb-600x600.jpg', 'Dell Inspiron 15', 1, true),
(14, 'https://cdn.tgdd.vn/Products/Images/44/329118/dell-inspiron-15-3530-1.jpg', 'Dell Inspiron 15 Display', 2, false);

-- Samsung Galaxy Book3 (ID: 15)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(15, 'https://cdn.tgdd.vn/Products/Images/44/328955/dell-alienware-m16-r2-ultra-9-thumb-600x600.jpg', 'Samsung Galaxy Book3', 1, true),
(15, 'https://cdn.tgdd.vn/Products/Images/44/328955/dell-alienware-m16-r2-1.jpg', 'Samsung Galaxy Book3 Display', 2, false);

-- Apple Watch Series 9 (ID: 16)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(16, 'https://cdn.tgdd.vn/Products/Images/7077/329145/apple-watch-series-10-gps-42mm-thumb-600x600.jpg', 'Apple Watch Series 9', 1, true),
(16, 'https://cdn.tgdd.vn/Products/Images/7077/329145/apple-watch-series-10-1.jpg', 'Apple Watch Series 9 Display', 2, false);

-- Apple Watch SE 2023 (ID: 17)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(17, 'https://cdn.tgdd.vn/Products/Images/7077/309017/apple-watch-se-2023-gps-40mm-thumb-600x600.jpg', 'Apple Watch SE 2023', 1, true),
(17, 'https://cdn.tgdd.vn/Products/Images/7077/309017/apple-watch-se-2023-1.jpg', 'Apple Watch SE 2023 Display', 2, false);

-- Samsung Galaxy Watch6 (ID: 18)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(18, 'https://cdn.tgdd.vn/Products/Images/7077/329128/samsung-galaxy-watch7-44mm-thumb-600x600.jpg', 'Samsung Galaxy Watch6', 1, true),
(18, 'https://cdn.tgdd.vn/Products/Images/7077/329128/samsung-galaxy-watch7-1.jpg', 'Samsung Galaxy Watch6 Display', 2, false);

-- Samsung Galaxy Watch FE (ID: 19)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(19, 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-den-thumb-600x600.jpg', 'Samsung Galaxy Watch FE', 1, true),
(19, 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-1.jpg', 'Samsung Galaxy Watch FE Display', 2, false);
