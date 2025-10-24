/**
 * Type Definitions for Product Data Models
 * 
 * This module contains TypeScript type definitions for products from the FDA database.
 * It includes types for unified products (combining food and drug data), individual
 * product types, and API response structures.
 */

/**
 * Unified product type that combines food and drug product data
 * 
 * This type represents a normalized view of products from both the food_products
 * and drug_products tables, providing a consistent interface for displaying
 * and querying products regardless of their source.
 * 
 * @typedef {Object} UnifiedProduct
 * @property {string} id - Unique identifier for the product
 * @property {string} registration_number - FDA registration number (e.g., "FR-4000012345678")
 * @property {string | null} name - Product name (brand_name for drugs, product_name for food)
 * @property {string | null} manufacturer - Manufacturer or company name
 * @property {string | null} [brand_name] - Brand name of the product
 * @property {string | null} [generic_name] - Generic name (primarily for drugs)
 * @property {string | null} category - Product category/type
 * @property {string | null} issuance_date - Date when registration was issued (ISO format)
 * @property {string | null} expiry_date - Date when registration expires (ISO format)
 * @property {string | null} search_vector - Full-text search vector for PostgreSQL
 * @property {'food' | 'drug'} source_table - Source table identifier
 * @property {'Food' | 'Drugs'} source_category - Human-readable source category
 */
export type UnifiedProduct = {
  id: string;
  registration_number: string;
  name: string | null;
  manufacturer: string | null;
  brand_name?: string | null;
  generic_name?: string | null;
  category: string | null;
  issuance_date: string | null;
  expiry_date: string | null;
  search_vector: string | null;
  source_table: 'food' | 'drug';
  source_category: 'Food' | 'Drugs';
}

/**
 * Response structure for paginated unified products queries
 * 
 * This type represents the response format for API calls that return
 * paginated lists of unified products, including metadata about pagination state.
 * 
 * @typedef {Object} UnifiedProductsResponse
 * @property {UnifiedProduct[]} data - Array of unified product objects
 * @property {boolean} hasMore - Whether more pages are available
 * @property {number} totalCount - Total number of products matching the query
 * @property {number} currentPage - Current page number (0-indexed)
 * @property {number} totalPages - Total number of pages available
 */
export type UnifiedProductsResponse = {
  data: UnifiedProduct[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Food product type from the food_products table
 * 
 * Represents a food product registered with the FDA Philippines.
 * Includes food items, supplements, cosmetics, and medical devices.
 * 
 * @typedef {Object} FoodProduct
 * @property {string} [id] - Unique identifier
 * @property {string} registration_number - FDA registration number
 * @property {string | null} [brand_name] - Brand name of the product
 * @property {string | null} [company_name] - Name of the company/manufacturer
 * @property {string | null} [product_name] - Name of the product
 * @property {string | null} [type_of_product] - Category/type (e.g., "FOOD_SUPPLEMENT")
 * @property {string | null} [issuance_date] - Registration issuance date
 * @property {string | null} [expiry_date] - Registration expiry date
 * @property {string | null} [search_vector] - Full-text search vector
 */
export type FoodProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  company_name?: string | null;
  product_name?: string | null;
  type_of_product?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
  search_vector?: string | null;
}

/**
 * Drug product type from the drug_products table
 * 
 * Represents a pharmaceutical drug registered with the FDA Philippines.
 * Includes prescription and over-the-counter medications.
 * 
 * @typedef {Object} DrugProduct
 * @property {string} [id] - Unique identifier
 * @property {string} registration_number - FDA registration number
 * @property {string | null} [brand_name] - Brand name of the drug
 * @property {string | null} [generic_name] - Generic/chemical name of the drug
 * @property {string | null} [manufacturer] - Manufacturer name
 * @property {string | null} [issuance_date] - Registration issuance date
 * @property {string | null} [expiry_date] - Registration expiry date
 * @property {string | null} [search_vector] - Full-text search vector
 */
export type DrugProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
  search_vector?: string | null;
}

/**
 * Union type representing either a food or drug product
 * 
 * This type is used when a function or component can work with
 * either food or drug products interchangeably.
 * 
 * @typedef {FoodProduct | DrugProduct} Product
 */
export type Product = FoodProduct | DrugProduct;