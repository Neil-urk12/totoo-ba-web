-- Unified Products View Creation Script
-- This view combines food_products and drug_products tables into a single queryable entity

-- Drop the view if it already exists (for re-running the script)
DROP VIEW IF EXISTS unified_products;

-- Create the unified products view
CREATE VIEW unified_products AS
SELECT 
    registration_number::TEXT as id,
    registration_number,
    product_name as name,
    company_name as manufacturer,
    brand_name,
    NULL as generic_name,
    type_of_product as category,
    issuance_date::date,
    expiry_date::date,
    search_vector,
    'food' as source_table,
    'Food' as source_category
FROM food_products
WHERE product_name IS NOT NULL

UNION ALL

SELECT 
    registration_number::TEXT as id,
    registration_number,
    COALESCE(brand_name, generic_name) as name,
    manufacturer as manufacturer,
    brand_name,
    generic_name,
    'pharmaceutical' as category,
    issuance_date::date,
    expiry_date::date,
    search_vector,
    'drug' as source_table,
    'Drugs' as source_category
FROM drug_products
WHERE COALESCE(brand_name, generic_name) IS NOT NULL

ORDER BY name ASC;

-- Create indexes for optimal performance
-- Index on product name for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_unified_products_name 
ON food_products (product_name);

CREATE INDEX IF NOT EXISTS idx_unified_products_drug_name 
ON drug_products (COALESCE(brand_name, generic_name));

-- Index on source category for filtering by category
-- Index for full-text search performance
CREATE INDEX IF NOT EXISTS idx_food_products_search_vector 
ON food_products USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_drug_products_search_vector 
ON drug_products USING gin(search_vector);

-- Index registration numbers for exact lookups
CREATE INDEX IF NOT EXISTS idx_food_products_registration_number 
ON food_products (registration_number);

CREATE INDEX IF NOT EXISTS idx_drug_products_registration_number 
ON drug_products (registration_number);

-- You can run this query to test the view
/*
SELECT 
    source_category,
    COUNT(*) as count,
    MIN(name) as sample_name
FROM unified_products 
GROUP BY source_category
ORDER BY source_category;
*/

-- Performance test query
/*
EXPLAIN ANALYZE 
SELECT * 
FROM unified_products 
WHERE source_category = 'Food' 
ORDER BY name 
LIMIT 30;
*/

-- Notes for implementation:
-- 1. This view will be read-only (you cannot INSERT/UPDATE/DELETE through it)
-- 2. All existing queries to individual tables will continue to work unchanged
-- 3. The view provides a unified interface that matches the structure needed by your React app
-- 4. Performance should be significantly better than client-side merging of multiple queries
-- 5. The view automatically stays in sync with the underlying tables