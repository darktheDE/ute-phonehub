-- 004_ADD_PRODUCT_IMAGES.SQL
-- Thêm hình ảnh chi tiết cho các sản phẩm đã seed ở 003
-- IDs must match 003_seed_products_data.sql

-- iPhone 15 Pro Max (ID: 1)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', 'iPhone 15 Pro Max Blue', 1, true),
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-1.jpg', 'iPhone 15 Pro Max Front', 2, false),
(1, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-1-2.jpg', 'iPhone 15 Pro Max Back', 3, false);

-- iPhone 15 (ID: 2)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(2, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:100/plain/https://cellphones.com.vn/media/wysiwyg/Phone/Apple/iphone_15/apple-iphone-15-series-8.jpg', 'iPhone 15 Pink', 1, true),
(2, 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-128gb-1.jpg', 'iPhone 15 Display', 2, false);

-- iPhone 14 (ID: 3)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(3, 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-thumb-tim-1-600x600.jpg', 'iPhone 14 Purple', 1, true),
(3, 'https://cdn.tgdd.vn/Products/Images/42/240259/iphone-14-1.jpg', 'iPhone 14 Front', 2, false);

-- Samsung Galaxy S24 Ultra (ID: 4)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(4, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg', 'Galaxy S24 Ultra Gray', 1, true),
(4, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-1.jpg', 'Galaxy S24 Ultra Display', 2, false),
(4, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s24-ultra-2.jpg', 'Galaxy S24 Ultra Camera', 3, false);

-- Samsung Galaxy S23 FE (ID: 5)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(5, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s23-fe_6__1_2.png', 'Galaxy S23 FE Mint', 1, true),
(5, 'https://cdn.tgdd.vn/Products/Images/42/320722/samsung-galaxy-s23-fe-1.jpg', 'Galaxy S23 FE Front', 2, false);

-- iPad Pro 11" M2 (ID: 6)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(6, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-2022-11-inch-m2.png', 'iPad Pro 11 M2 Gray', 1, true),
(6, 'https://cdn.tgdd.vn/Products/Images/522/329143/ipad-pro-11-inch-m4-1.jpg', 'iPad Pro Display', 2, false);

-- iPad Air 11" M2 (ID: 7)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(7, 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/ipad-air-11-inch-m2.png', 'iPad Air 11 M2 Blue', 1, true),
(7, 'https://cdn.tgdd.vn/Products/Images/522/329072/ipad-air-11-inch-m2-1.jpg', 'iPad Air Display', 2, false);

-- Samsung Galaxy Tab S9 (ID: 8)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(8, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-tab-s9_1.png', 'Galaxy Tab S9', 1, true),
(8, 'https://cdn.tgdd.vn/Products/Images/522/306206/samsung-galaxy-tab-s9-ultra-1.jpg', 'Galaxy Tab S9 Display', 2, false);

-- Samsung Galaxy Tab A9+ (ID: 9)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(9, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-tab-a9-plus_4_.png', 'Galaxy Tab A9+', 1, true);

-- Xiaomi Redmi Pad SE (ID: 10)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(10, 'https://cdn.tgdd.vn/Products/Images/522/315607/Slider/xiaomi-redmi-pad-se-thumb-yt-1020x570.jpg', 'Redmi Pad SE', 1, true);

-- MacBook Air 15" M3 (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(11, 'https://www.apple.com/newsroom/images/2024/03/apple-unveils-the-new-13-and-15-inch-macbook-air-with-the-powerful-m3-chip/tile/Apple-MacBook-Air-2-up-hero-240304-lp.jpg.landing-big_2x.jpg', 'MacBook Air 15 M3', 1, true),
(11, 'https://cdn.tgdd.vn/Products/Images/44/329220/macbook-air-m3-13-inch-1.jpg', 'MacBook Air M3 Display', 2, false);

-- MacBook Pro 14" M3 (ID: 12)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(12, 'https://laptopnow.vn/uploads/images/2024/06/macbook-pro-14-m3-pro-1718420240.jpg', 'MacBook Pro 14 M3', 1, true),
(12, 'https://cdn.tgdd.vn/Products/Images/44/329035/macbook-pro-14-m3-1.jpg', 'MacBook Pro 14 M3 Display', 2, false);

-- Dell XPS 13 Plus (ID: 13)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(13, 'https://laptop360.net/wp-content/uploads/2023/07/DELL-XPS-9320-6.jpg', 'Dell XPS 13 Plus', 1, true),
(13, 'https://cdn.tgdd.vn/Products/Images/44/321045/dell-xps-13-plus-1.jpg', 'Dell XPS 13 Plus Display', 2, false);

-- Dell Inspiron 15 3520 (ID: 14)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(14, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/330075/dell-inspiron-15-3520-i5-n3520-i5u085w11slu-1-638627942653445825-750x500.jpg', 'Dell Inspiron 15', 1, true),
(14, 'https://cdn.tgdd.vn/Products/Images/44/329118/dell-inspiron-15-3530-1.jpg', 'Dell Inspiron 15 Display', 2, false);

-- Samsung Galaxy Book3 (ID: 15)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(15, 'https://lapvip.vn/upload/products/original/samsung-galaxy-book3-360-15-2023-1685608650.jpg', 'Samsung Galaxy Book3', 1, true),
(15, 'https://cdn.tgdd.vn/Products/Images/44/328955/dell-alienware-m16-r2-1.jpg', 'Samsung Galaxy Book3 Display', 2, false);

-- Apple Watch Series 9 (ID: 16)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(16, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple_lte_3__1.png', 'Apple Watch Series 9', 1, true),
(16, 'https://cdn.tgdd.vn/Products/Images/7077/329145/apple-watch-series-10-1.jpg', 'Apple Watch Series 9 Display', 2, false);

-- Apple Watch SE (2023) (ID: 17)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(17, 'https://demobile.vn/wp-content/uploads/2024/06/apple-watch-se-lte-2023-44mm-vie.jpg', 'Apple Watch SE 2023', 1, true),
(17, 'https://cdn.tgdd.vn/Products/Images/7077/309017/apple-watch-se-2023-1.jpg', 'Apple Watch SE 2023 Display', 2, false);

-- Samsung Galaxy Watch6 (ID: 18)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(18, 'https://file.hstatic.net/200000224943/file/z4554555368965_10fb4d8e5a9a59035471d27005281970_5284870864aa404eb279d61249ed988a_grande.jpg', 'Samsung Galaxy Watch6', 1, true),
(18, 'https://cdn.tgdd.vn/Products/Images/7077/329128/samsung-galaxy-watch7-1.jpg', 'Samsung Galaxy Watch6 Display', 2, false);

-- Samsung Galaxy Watch FE (ID: 19)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(19, 'https://cdn.tgdd.vn/Products/Images/7077/327469/samsung-galaxy-watch-fe-hong-1-750x500.jpg', 'Samsung Galaxy Watch FE', 1, true);

-- Xiaomi Watch S3 (ID: 20)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(20, 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-den-thumb-600x600.jpg', 'Xiaomi Watch S3', 1, true),
(20, 'https://cdn.tgdd.vn/Products/Images/7077/328881/xiaomi-watch-s3-1.jpg', 'Xiaomi Watch S3 Display', 2, false);

-- Samsung Galaxy A54 (ID: 21)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(21, 'https://cdn.tgdd.vn/Products/Images/42/250103/samsung-galaxy-a54-thumb-den-600x600.jpg', 'Samsung Galaxy A54', 1, true);

-- Xiaomi 14 (ID: 22)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(22, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-4.png', 'Xiaomi 14', 1, true);

-- Xiaomi Redmi Note 13 Pro (ID: 23)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(23, 'https://cdn2.cellphones.com.vn/insecure/rsp:fill:0:358/a:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-redmi-note-13-pro-4g_13__1.png', 'Redmi Note 13 Pro', 1, true),
(23, 'https://cdn.tgdd.vn/Products/Images/42/313205/xiaomi-redmi-note-13-pro-1.jpg', 'Redmi Note 13 Pro Display', 2, false);

-- OPPO Reno11 F (ID: 24)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(24, 'https://cdn.tgdd.vn/Products/Images/42/321895/oppo-reno11-f-purple-thumb-600x600.jpg', 'OPPO Reno11 F', 1, true),
(24, 'https://cdn.tgdd.vn/Products/Images/42/320715/oppo-reno11-f-5g-1.jpg', 'OPPO Reno11 F Display', 2, false);

-- OPPO A79 (ID: 25)
INSERT INTO product_images (product_id, image_url, alt_text, image_order, is_primary) VALUES
(25, 'https://cdn.tgdd.vn/Products/Images/42/316776/oppo-a79-5g-tim-thumb-1-2-600x600.jpg', 'OPPO A79 Purple', 1, true),
(25, 'https://cdn.tgdd.vn/Products/Images/42/329056/oppo-a98-1.jpg', 'OPPO A79 Front', 2, false);

-- Reset sequence for product_images
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
