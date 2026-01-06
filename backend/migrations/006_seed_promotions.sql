-- 006_SEED_PROMOTIONS.SQL
-- Create Flash Sale promotion and add products

-- 1. Create Promotion: FLASH SALE 2026
INSERT INTO promotions (id, effective_date, expiration_date, title, description, percent_discount, status, template_id) VALUES
('promo-flash-sale-2026', NOW(), NOW() + INTERVAL '30 days', 'FLASH SALE 2026', 'Giảm giá cực sốc lên đến 50%', 15.0, 'ACTIVE', 'template-001');

-- 2. Add Products to Promotion (IDs 27-31)
-- Type 'PRODUCT' implies applicable_object_id is a product_id.
INSERT INTO promotion_targets (applicable_object_id, type, promotion_id) VALUES
(26, 'PRODUCT', 'promo-flash-sale-2026'), -- Samsung Z Fold6
(27, 'PRODUCT', 'promo-flash-sale-2026'), -- Asus Zenbook
(28, 'PRODUCT', 'promo-flash-sale-2026'), -- Redmi Note 12
(29, 'PRODUCT', 'promo-flash-sale-2026'), -- Vivo V30
(30, 'PRODUCT', 'promo-flash-sale-2026'), -- iPad Gen 10
(31, 'PRODUCT', 'promo-flash-sale-2026'); -- MacBook Air M2

-- Update product prices to reflect "discount" visual if needed (optional, logic relies on promotion engine usually)
-- But for simple display, we rely on the promotion association.

-- Update Sequence
SELECT setval('promotion_targets_id_seq', (SELECT MAX(id) FROM promotion_targets));
