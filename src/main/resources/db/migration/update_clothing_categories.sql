-- Ensure storefront clothing categories exist for filter and category pages.

INSERT INTO categories (name, slug, description, parent_id, image, is_active)
SELECT 'Chân váy', 'chan-vay', 'Chân váy thời trang nữ tính và hiện đại', NULL, NULL, b'1'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'chan-vay');

INSERT INTO categories (name, slug, description, parent_id, image, is_active)
SELECT 'Set bộ', 'set-bo', 'Set đồ bộ phối sẵn, mặc là đẹp', NULL, NULL, b'1'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'set-bo');

UPDATE categories
SET name = 'Áo sơ mi',
    description = 'Thiết kế áo sơ mi thanh lịch cho mọi dịp',
    is_active = b'1'
WHERE slug = 'ao-so-mi';

UPDATE categories
SET is_active = b'0'
WHERE slug NOT IN ('ao-so-mi', 'chan-vay', 'set-bo');
