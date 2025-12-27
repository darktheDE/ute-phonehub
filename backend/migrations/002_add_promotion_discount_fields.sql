-- Migration: Add fixed_amount and max_discount to promotions table
-- Date: 2025-12-27
-- Description: Support both fixed amount and percentage-based vouchers with max discount cap

-- Add fixed_amount column for fixed discount vouchers
ALTER TABLE promotions
ADD COLUMN IF NOT EXISTS fixed_amount DOUBLE PRECISION;

-- Add max_discount column to cap percentage-based discounts
ALTER TABLE promotions
ADD COLUMN IF NOT EXISTS max_discount DOUBLE PRECISION;

-- Add comments for documentation
COMMENT ON COLUMN promotions.fixed_amount IS 'Fixed discount amount (VND) - takes priority over percent_discount';
COMMENT ON COLUMN promotions.max_discount IS 'Maximum discount cap (VND) for percentage-based promotions';

-- Add check constraint: either percent_discount or fixed_amount must be set
ALTER TABLE promotions
ADD CONSTRAINT chk_promotion_discount_type
CHECK (
    (percent_discount IS NOT NULL AND percent_discount > 0) OR
    (fixed_amount IS NOT NULL AND fixed_amount > 0)
);
