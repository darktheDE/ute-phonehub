-- Seed PromotionTemplate data
-- These are blueprint templates for creating promotions

INSERT INTO promotion_templates (id, code, type, created_at)
VALUES 
    ('TPL_DISCOUNT', 'DISCOUNT_TEMPLATE', 'DISCOUNT', NOW()),
    ('TPL_VOUCHER', 'VOUCHER_TEMPLATE', 'VOUCHER', NOW()),
    ('TPL_FREESHIP', 'FREESHIP_TEMPLATE', 'FREESHIP', NOW())
ON CONFLICT (code) DO NOTHING;

-- Explanation:
-- DISCOUNT: Giảm giá trực tiếp cho sản phẩm/danh mục (áp dụng targets)
-- VOUCHER: Giảm giá theo % cho tổng đơn hàng (yêu cầu minValue)
-- FREESHIP: Miễn phí vận chuyển (có thể yêu cầu minValue)
