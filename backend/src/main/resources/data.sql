-- =====================================================
-- SEED DATA FOR UTE PHONE HUB DATABASE
-- =====================================================

-- =====================================================
-- INSERT CATEGORIES (Danh mục sản phẩm)
-- =====================================================

-- Root Categories (Danh mục gốc)
INSERT INTO categories (name, description, parent_id, created_at, updated_at) VALUES
('Điện thoại', 'Điện thoại di động các loại', NULL, NOW(), NOW()),
('Tablet', 'Máy tính bảng', NULL, NOW(), NOW()),
('Laptop', 'Máy tính xách tay', NULL, NOW(), NOW()),
('Phụ kiện', 'Phụ kiện điện thoại và thiết bị điện tử', NULL, NOW(), NOW()),
('Đồng hồ thông minh', 'Smartwatch và thiết bị đeo tay', NULL, NOW(), NOW());

-- Child Categories for Phụ kiện (ID = 4)
INSERT INTO categories (name, description, parent_id, created_at, updated_at) VALUES
('Tai nghe', 'Tai nghe có dây và không dây', 4, NOW(), NOW()),
('Sạc dự phòng', 'Pin sạc dự phòng các loại', 4, NOW(), NOW()),
('Ốp lưng', 'Ốp lưng bảo vệ điện thoại', 4, NOW(), NOW()),
('Cáp sạc', 'Cáp sạc USB, Type-C, Lightning', 4, NOW(), NOW()),
('Miếng dán màn hình', 'Kính cường lực và film dán màn hình', 4, NOW(), NOW());

