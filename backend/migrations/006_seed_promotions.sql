-- 006_SEED_PROMOTIONS.SQL
-- Create Flash Sale promotion and add products
-- Also update product prices to simulate "Sale" status (Price < Original)

-- 1. Create Promotion: FLASH SALE 2026
INSERT INTO promotions (id, effective_date, expiration_date, title, description, percent_discount, status, template_id) VALUES
('promo-flash-sale-2026', NOW(), NOW() + INTERVAL '30 days', 'FLASH SALE 2026', 'Giảm giá cực sốc lên đến 50%', 15.0, 'ACTIVE', 'template-001')
ON CONFLICT (id) DO NOTHING;

-- 2. Add Products to Promotion (IDs 26-31)
INSERT INTO promotion_targets (applicable_object_id, type, promotion_id) VALUES
(26, 'PRODUCT', 'promo-flash-sale-2026'),
(27, 'PRODUCT', 'promo-flash-sale-2026'),
(28, 'PRODUCT', 'promo-flash-sale-2026'),
(29, 'PRODUCT', 'promo-flash-sale-2026'),
(30, 'PRODUCT', 'promo-flash-sale-2026'),
(31, 'PRODUCT', 'promo-flash-sale-2026')
ON CONFLICT DO NOTHING;

-- 3. Update Prices to trigger "On Sale" logic
-- Logic: product_templates.price (Selling) < product_metadata.sale_price (Original/List)

-- Samsung Z Fold6 (ID 26): List 43.990.000 -> Sale 29.990.000
UPDATE product_templates SET price = 29990000 WHERE product_id = 26;
UPDATE product_metadata SET sale_price = 43990000 WHERE product_id = 26;

-- Asus Zenbook 14 (ID 27): List 34.990.000 -> Sale 27.890.000
UPDATE product_templates SET price = 27890000 WHERE product_id = 27;
UPDATE product_metadata SET sale_price = 34990000 WHERE product_id = 27;

-- Redmi Note 12 (ID 28): List 4.990.000 -> Sale 3.790.000
UPDATE product_templates SET price = 3790000 WHERE product_id = 28;
UPDATE product_metadata SET sale_price = 4990000 WHERE product_id = 28;

-- Vivo V30 (ID 29): List 13.990.000 -> Sale 13.590.000
UPDATE product_templates SET price = 13590000 WHERE product_id = 29;
UPDATE product_metadata SET sale_price = 13990000 WHERE product_id = 29;

-- iPad Gen 10 (ID 30): List 9.990.000 -> Sale 7.990.000
UPDATE product_templates SET price = 7990000 WHERE product_id = 30;
UPDATE product_metadata SET sale_price = 9990000 WHERE product_id = 30;

-- MacBook Air M2 (ID 31): List 24.990.000 -> Sale 17.490.000
UPDATE product_templates SET price = 17490000 WHERE product_id = 31;
UPDATE product_metadata SET sale_price = 24990000 WHERE product_id = 31;

-- Update sequences
SELECT setval('promotion_targets_id_seq', (SELECT MAX(id) FROM promotion_targets));
