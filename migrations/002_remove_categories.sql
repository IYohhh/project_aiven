ALTER TABLE products
  DROP FOREIGN KEY fk_products_category,
  DROP INDEX idx_products_category_id,
  DROP COLUMN category_id;

DROP TABLE IF EXISTS categories;
