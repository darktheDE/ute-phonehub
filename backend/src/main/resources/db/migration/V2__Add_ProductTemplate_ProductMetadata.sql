-- ============================================================================
-- V2__Add_ProductTemplate_ProductMetadata.sql
-- Migration to align database with Class Diagram
-- Creates product_templates and product_metadata tables
-- Migrates existing data from products table
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE NEW TABLES
-- ============================================================================

-- Table: product_templates (Product variants with SKU, price, stock)
CREATE TABLE IF NOT EXISTS product_templates (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50),
    storage VARCHAR(50),
    ram VARCHAR(50),
    price DECIMAL(15,2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    stock_status VARCHAR(20) NOT NULL DEFAULT 'IN_STOCK',
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT fk_product_template_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_template_created_by FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_product_template_updated_by FOREIGN KEY (updated_by) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Table: product_metadata (Technical specifications)
CREATE TABLE IF NOT EXISTS product_metadata (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT UNIQUE NOT NULL,
    
    -- Pricing
    import_price DECIMAL(15,2),
    sale_price DECIMAL(15,2),
    
    -- Display (Smartphone/Tablet)
    screen_resolution VARCHAR(100),
    screen_size DECIMAL(4,2),
    screen_technology VARCHAR(100),
    refresh_rate INT,
    
    -- Processor
    cpu_chipset VARCHAR(100),
    gpu VARCHAR(100),
    
    -- Camera
    camera_megapixels DECIMAL(5,1),
    camera_details VARCHAR(200),
    front_camera_megapixels DECIMAL(5,1),
    
    -- Battery
    battery_capacity INT,
    charging_power INT,
    charging_type VARCHAR(100),
    
    -- Physical
    weight DECIMAL(6,2),
    dimensions VARCHAR(100),
    material VARCHAR(100),
    
    -- Laptop-specific
    operating_system VARCHAR(100),
    keyboard_type VARCHAR(100),
    ports VARCHAR(200),
    
    -- Smartwatch-specific
    case_size VARCHAR(50),
    health_features VARCHAR(200),
    battery_life_days INT,
    
    -- Connectivity
    wireless_connectivity VARCHAR(100),
    sim_type VARCHAR(100),
    
    -- Other features
    water_resistance VARCHAR(200),
    audio_features VARCHAR(200),
    security_features VARCHAR(200),
    additional_specs TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_product_metadata_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================================
-- PART 2: CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_product_template_product_id ON product_templates(product_id);
CREATE INDEX idx_product_template_sku ON product_templates(sku);
CREATE INDEX idx_product_template_stock_status ON product_templates(stock_status);
CREATE INDEX idx_product_template_price ON product_templates(price);
CREATE INDEX idx_product_metadata_product_id ON product_metadata(product_id);

-- ============================================================================
-- PART 3: MIGRATE EXISTING DATA
-- ============================================================================

-- Migrate products -> product_templates
-- Each existing product becomes 1 default template with generated SKU
INSERT INTO product_templates (
    product_id,
    sku,
    color,
    storage,
    ram,
    price,
    stock_quantity,
    stock_status,
    status,
    created_at,
    updated_at,
    created_by,
    updated_by
)
SELECT 
    p.id,
    CONCAT('SKU-', p.id) as sku,  -- Generate SKU: SKU-1, SKU-2, etc.
    'Default' as color,
    NULL as storage,
    NULL as ram,
    p.price,
    p.stock_quantity,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'OUT_OF_STOCK'
        WHEN p.stock_quantity <= 10 THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END as stock_status,
    p.status,
    p.created_at,
    p.updated_at,
    p.created_by,
    p.updated_by
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_templates pt WHERE pt.product_id = p.id
);

-- Migrate specifications (JSON) -> product_metadata (if specifications exist)
-- Note: You may need to manually parse JSON data if needed
-- For now, we create empty metadata records
INSERT INTO product_metadata (
    product_id,
    additional_specs,
    created_at,
    updated_at
)
SELECT 
    p.id,
    p.specifications,  -- Store old JSON specs in additional_specs
    p.created_at,
    p.updated_at
FROM products p
WHERE p.specifications IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM product_metadata pm WHERE pm.product_id = p.id
);

-- ============================================================================
-- PART 4: DROP OLD COLUMNS FROM PRODUCTS TABLE
-- ============================================================================

-- Drop old columns now that data is migrated to new structure
ALTER TABLE products DROP COLUMN IF EXISTS price;
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
ALTER TABLE products DROP COLUMN IF EXISTS specifications;

-- ============================================================================
-- PART 5: ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE product_templates IS 'Product variants with SKU, price, stock - aligned with Class Diagram';
COMMENT ON COLUMN product_templates.sku IS 'Stock Keeping Unit - unique identifier for variant (e.g., IP15PM-256-BLK)';
COMMENT ON COLUMN product_templates.stock_status IS 'IN_STOCK (>10), LOW_STOCK (1-10), OUT_OF_STOCK (0)';

COMMENT ON TABLE product_metadata IS 'Technical specifications for products - aligned with Class Diagram';
COMMENT ON COLUMN product_metadata.additional_specs IS 'Free-text or JSON for additional specifications';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Verify data in product_templates and product_metadata tables
-- 2. Test all 10 Product APIs on Swagger
-- 3. If everything works, uncomment DROP COLUMN commands above
-- 4. Update frontend to handle new template/metadata structure
-- ============================================================================
