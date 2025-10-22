import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";

// Map UI category to table names
const tableForCategory = (category?: string) => {
  const c = (category || '').toLowerCase();
  if (c === 'food') return ['food_products'] as const;
  if (c === 'drugs' || c === 'drug' || c === 'pharmaceutical') return ['drug_products'] as const;
  // Unknown or All -> both
  return ['food_products', 'drug_products'] as const;
};

// Minimal row types
interface FoodProduct {
  id?: string;
  registration_number: string;
  brand_name?: string | null; // Brand name field exists in food_products table
  company_name?: string | null;
  product_name?: string | null;
  type_of_product?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
}
interface DrugProduct {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
  company_name?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
}

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
  };
  registrationDate: string | null;
  expiryDate: string | null;
};

// Build normalized response compatible with current UI
const buildResponse = ({
  exactFood,
  exactDrug,
  foodMatches,
  drugMatches,
}: {
  exactFood: FoodProduct | null;
  exactDrug: DrugProduct | null;
  foodMatches: FoodProduct[];
  drugMatches: DrugProduct[];
}): VerifyResponse => {
  const exact = exactFood || exactDrug || null;
  const isDrug = !!exactDrug || (!exact && drugMatches.length > 0);
  const topFood = foodMatches[0] || null;
  const topDrug = drugMatches[0] || null;
  const totalMatches = foodMatches.length + drugMatches.length;

  const is_exact_registration = !!exact;

  const base: VerifyResponse = {
    product_id: exact?.registration_number || topFood?.registration_number || topDrug?.registration_number || null,
    is_verified: is_exact_registration,
    message: is_exact_registration
      ? 'Product verified via FTS from FDA database.'
      : totalMatches > 0
        ? 'No exact registration match found. Showing closest matches from FDA database.'
        : 'Product not found in FDA database.',
    details: {
      verification_method: 'Full-Text Search in FDA Database',
      total_matches: totalMatches,
      search_results_count: totalMatches,
      confidence_score: is_exact_registration ? 100 : (totalMatches > 0 ? 60 : 0),
      exact_match: is_exact_registration,
      suggestions: totalMatches === 0 ? [
        'Check for typos or spacing in the registration number',
        'Try searching by brand or generic name',
        'Verify the product category (Food vs Drug) and try again'
      ] : undefined,
      product_info: null,
      verified_product: null,
    },
    registrationDate: exact?.issuance_date || topFood?.issuance_date || topDrug?.issuance_date || null,
    expiryDate: exact?.expiry_date || topFood?.expiry_date || topDrug?.expiry_date || null,
  };

  if (isDrug) {
    const row = exactDrug || topDrug;
    if (row) {
      base.details.verified_product = {
        id: row.id || undefined,
        brand_name: row.brand_name || null,
        generic_name: row.generic_name || null,
        manufacturer: row.manufacturer || row.company_name || null,
        registration_number: row.registration_number || null,
        type: 'drug',
        matched_fields: [],
        relevance_score: null,
      };
      base.details.product_info = {
        id: row.id || undefined,
        product_name: row.brand_name || row.generic_name || null,
        company_name: row.manufacturer || row.company_name || null,
        registration_number: row.registration_number || null,
        type: 'drug',
        matched_fields: [],
        relevance_score: null,
      };
    }
  } else {
    const row = exactFood || topFood;
    if (row) {
      base.details.product_info = {
        id: row.id || undefined,
        product_name: row.brand_name || row.product_name || null, // Prioritize brand_name for food products
        company_name: row.company_name || null,
        registration_number: row.registration_number || null,
        type: row.type_of_product || 'food',
        matched_fields: [],
        relevance_score: null,
      };
    }
  }

  return base;
};

const ProductVerify = async (product_id: string, category?: string) => {
  const q = (product_id || '').trim();
  if (!q) throw new Error('Empty query');

  const tables = tableForCategory(category);

  // Try exact registration_number match first to avoid hyphen issues with tsquery
  const hasFood = tables.length === 2 || tables[0] === 'food_products';
  const hasDrug = tables.length === 2 || tables[0] === 'drug_products';
  const [exactFoodRes, exactDrugRes] = await Promise.all([
    hasFood
      ? supabase.from('food_products').select('*').eq('registration_number', q).limit(1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    hasDrug
      ? supabase.from('drug_products').select('*').eq('registration_number', q).limit(1).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const exactFood = exactFoodRes.data || null;
  const exactDrug = exactDrugRes.data || null;

  // Run FTS with websearch; if it errors, fall back to plain
  const runFts = async (table: 'food_products' | 'drug_products') => {
    // Skip FTS if query contains special characters (rely on exact match only)
    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(q);
    if (hasSpecialChars) {
      console.warn(`[FTS] Skipping FTS for "${q}" - contains special characters that could cause tsquery errors`);
      return [];
    }

    const base = supabase.from(table).select('*', { count: 'exact' });

    // Try websearch first with explicit config
    const first = await base
      .textSearch('search_vector', q, { type: 'websearch', config: 'english' })
      .limit(10);

    if (first.error) {
      console.error(`Websearch error on ${table}:`, first.error);

      // Fallback to plain search with same config
      const alt = await base
        .textSearch('search_vector', q, { type: 'plain', config: 'english' })
        .limit(10);

      if (alt.error) {
        console.error(`Plain search error on ${table}:`, alt.error);
        throw new Error(`FTS failed on ${table}: ${alt.error.message}`);
      }

      return alt.data || [];
    }

    return first.data || [];
  };

  let foodMatches: FoodProduct[] = [];
  let drugMatches: DrugProduct[] = [];

  if (tables.length === 2) {
    const [foodRes, drugRes] = await Promise.allSettled([
      runFts('food_products'),
      runFts('drug_products'),
    ]);

    foodMatches = foodRes.status === 'fulfilled' ? (foodRes.value as FoodProduct[]) : [];
    drugMatches = drugRes.status === 'fulfilled' ? (drugRes.value as DrugProduct[]) : [];

    // If both FTS calls failed and there is no exact match, surface the error
    if (foodRes.status === 'rejected' && drugRes.status === 'rejected' && !exactFood && !exactDrug) {
      throw (foodRes.reason ?? drugRes.reason);
    }
  } else if (tables[0] === 'food_products') {
    foodMatches = await runFts('food_products');
  } else if (tables[0] === 'drug_products') {
    drugMatches = await runFts('drug_products');
  }

  return buildResponse({ exactFood, exactDrug, foodMatches, drugMatches });
};

export const useGetProductVerifyQuery = (product_id: string, category?: string) => {
  return queryOptions({
    queryKey: ["verify", product_id, category ?? 'all'],
    queryFn: () => ProductVerify(product_id, category),
  });
};
