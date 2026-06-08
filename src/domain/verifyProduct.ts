import type { FoodProduct, DrugProduct, VerifyResponse } from '../types';

export function verifyProduct({
  exactFood,
  exactDrug,
  foodMatches,
  drugMatches,
}: {
  exactFood: FoodProduct | null;
  exactDrug: DrugProduct | null;
  foodMatches: FoodProduct[];
  drugMatches: DrugProduct[];
}): VerifyResponse {
  const exact = exactFood || exactDrug || null;
  const isDrug = !!exactDrug || (!exact && drugMatches.length > 0);
  const topFood = foodMatches[0] || null;
  const topDrug = drugMatches[0] || null;
  const totalMatches = foodMatches.length + drugMatches.length;

  const is_exact_registration = !!exact;
  const has_text_match = totalMatches > 0;

  const base: VerifyResponse = {
    product_id: exact?.registration_number || topFood?.registration_number || topDrug?.registration_number || null,
    is_verified: is_exact_registration || has_text_match,
    message: is_exact_registration
      ? 'Product verified via FTS from FDA database.'
      : has_text_match
        ? 'Product verified via text search match in FDA database.'
        : 'Product not found in FDA database.',
    details: {
      verification_method: 'Full-Text Search in FDA Database',
      total_matches: totalMatches,
      search_results_count: totalMatches,
      confidence_score: is_exact_registration ? 100 : (has_text_match ? 85 : 0),
      exact_match: is_exact_registration,
      suggestions: totalMatches === 0 ? [
        'Check for typos or spacing in the registration number',
        'Try searching by brand or generic name',
        'Verify the product category (Food vs Drug) and try again'
      ] : undefined,
      product_info: null,
      verified_product: null,
      alternative_matches: [],
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
        manufacturer: row.manufacturer || null,
        registration_number: row.registration_number || null,
        type: 'drug',
        matched_fields: [],
        relevance_score: null,
      };
      base.details.product_info = {
        id: row.id || undefined,
        product_name: row.brand_name || row.generic_name || null,
        company_name: row.manufacturer || null,
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
        product_name: row.brand_name || row.product_name || null,
        company_name: row.company_name || null,
        registration_number: row.registration_number || null,
        type: row.type_of_product || 'food',
        matched_fields: [],
        relevance_score: null,
      };
    }
  }

  const chosenReg = base.product_id;
  const alternatives: Array<{
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
  }> = [];

  for (const f of foodMatches) {
    if (!f.registration_number || f.registration_number === chosenReg) continue;
    alternatives.push({
      id: f.id,
      relevance_score: null,
      matched_fields: [],
      type: (f.type_of_product || 'food'),
      registration_number: f.registration_number,
      product_name: f.product_name || 'Unknown',
      company_name: f.company_name || '—',
      brand_name: f.brand_name || null,
      issuance_date: f.issuance_date || null,
      expiry_date: f.expiry_date || null,
    });
  }
  for (const d of drugMatches) {
    if (!d.registration_number || d.registration_number === chosenReg) continue;
    alternatives.push({
      id: d.id,
      relevance_score: null,
      matched_fields: [],
      type: 'drug',
      registration_number: d.registration_number,
      product_name: d.brand_name || d.generic_name || 'Unknown',
      company_name: d.manufacturer || '—',
      brand_name: d.brand_name || null,
      issuance_date: d.issuance_date || null,
      expiry_date: d.expiry_date || null,
    });
  }

  base.details.alternative_matches = alternatives.slice(0, 10);

  return base;
}
