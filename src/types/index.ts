/**
 * Product Domain Types
 *
 * Canonical type module for all FDA product-related types. Every
 * product shape, verification result, and image analysis response
 * is defined here. Query hooks and components import from this
 * module — never from each other.
 */

// ---------------------------------------------------------------------------
// Raw DB row shapes
// ---------------------------------------------------------------------------

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
};

export type DrugProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
  search_vector?: string | null;
};

export type Product = FoodProduct | DrugProduct;

// ---------------------------------------------------------------------------
// unified_products view shape
// ---------------------------------------------------------------------------

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
};

export type UnifiedProductsResponse = {
  data: UnifiedProduct[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

// ---------------------------------------------------------------------------
// Display product (view-model for product cards and lists)
// ---------------------------------------------------------------------------

export type DisplayProduct = {
  id: string;
  name: string;
  category: string;
  registrationNo: string;
  manufacturer: string;
  registered: string;
  expires: string;
};

export const toDisplayProduct = (product: UnifiedProduct): DisplayProduct => ({
  id: product.id || product.registration_number,
  name: product.name || 'Unknown Product',
  category: product.category || product.source_category,
  registrationNo: product.registration_number,
  manufacturer: product.manufacturer || 'Unknown Manufacturer',
  registered: product.issuance_date || 'Unknown',
  expires: product.expiry_date || 'Unknown',
});

// ---------------------------------------------------------------------------
// Text-search verification result shapes
// ---------------------------------------------------------------------------

export type VerifiedProduct = {
  id?: string;
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
  registration_number?: string | null;
  type?: string | null;
  matched_fields?: string[];
  relevance_score?: number | null;
  // Food industry specific optional fields
  license_number?: string | null;
  name_of_establishment?: string | null;
};

export type ProductInfo = {
  id?: string;
  product_name?: string | null;
  company_name?: string | null;
  registration_number?: string | null;
  type?: string | null;
  matched_fields?: string[];
  relevance_score?: number | null;
};

export type VerifyResponse = {
  product_id: string | null;
  is_verified: boolean;
  message: string;
  details: {
    verification_method: string;
    total_matches: number;
    // Back-compat optional fields used in UI
    search_results_count?: number;
    suggestions?: string[];
    confidence_score?: number;
    exact_match?: boolean;
    matched_field?: string;
    product_info: ProductInfo | null;
    verified_product: VerifiedProduct | null;
    alternative_matches?: Array<{
      id?: string;
      relevance_score?: number | null;
      matched_fields?: string[];
      type: string;
      registration_number: string;
      product_name: string;
      company_name: string;
      brand_name?: string | null;
      issuance_date?: string | null;
      expiry_date?: string | null;
    }>;
  };
  registrationDate: string | null;
  expiryDate: string | null;
};


