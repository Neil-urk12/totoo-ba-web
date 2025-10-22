import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";

// Fuzzy matching utilities
const levenshteinDistance = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[s2.length][s1.length];
};

const calculateSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) return 0;
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 100;
  const distance = levenshteinDistance(str1, str2);
  return Math.round(((maxLen - distance) / maxLen) * 100);
};

// Calculate match score for a product against query
const calculateMatchScore = (
  query: string,
  product: FoodProduct | DrugProduct,
  isDrug: boolean
): { score: number; matchedFields: string[] } => {
  const q = query.toLowerCase().trim();
  const matchedFields: string[] = [];
  let totalScore = 0;
  let fieldCount = 0;

  // Check registration number (highest weight)
  const regNum = product.registration_number?.toLowerCase() || '';
  if (regNum) {
    const regScore = calculateSimilarity(q, regNum);
    if (regScore > 50) {
      totalScore += regScore * 3; // 3x weight
      matchedFields.push(`registration_number(${regScore}%)`);
      fieldCount += 3;
    }
  }

  if (isDrug) {
    const drugProduct = product as DrugProduct;
    // Brand name
    const brandName = drugProduct.brand_name?.toLowerCase() || '';
    if (brandName) {
      const brandScore = calculateSimilarity(q, brandName);
      if (brandScore > 40) {
        totalScore += brandScore * 2; // 2x weight
        matchedFields.push(`brand_name(${brandScore}%)`);
        fieldCount += 2;
      }
    }
    // Generic name
    const genericName = drugProduct.generic_name?.toLowerCase() || '';
    if (genericName) {
      const genericScore = calculateSimilarity(q, genericName);
      if (genericScore > 40) {
        totalScore += genericScore * 2; // 2x weight
        matchedFields.push(`generic_name(${genericScore}%)`);
        fieldCount += 2;
      }
    }
    // Manufacturer
    const manufacturer = (drugProduct.manufacturer || drugProduct.company_name)?.toLowerCase() || '';
    if (manufacturer) {
      const mfgScore = calculateSimilarity(q, manufacturer);
      if (mfgScore > 30) {
        totalScore += mfgScore;
        matchedFields.push(`manufacturer(${mfgScore}%)`);
        fieldCount += 1;
      }
    }
  } else {
    const foodProduct = product as FoodProduct;
    // Product name
    const productName = foodProduct.product_name?.toLowerCase() || '';
    if (productName) {
      const nameScore = calculateSimilarity(q, productName);
      if (nameScore > 40) {
        totalScore += nameScore * 2; // 2x weight
        matchedFields.push(`product_name(${nameScore}%)`);
        fieldCount += 2;
      }
    }
    // Company name
    const companyName = foodProduct.company_name?.toLowerCase() || '';
    if (companyName) {
      const companyScore = calculateSimilarity(q, companyName);
      if (companyScore > 30) {
        totalScore += companyScore;
        matchedFields.push(`company_name(${companyScore}%)`);
        fieldCount += 1;
      }
    }
  }

  const averageScore = fieldCount > 0 ? Math.round(totalScore / fieldCount) : 0;
  return { score: averageScore, matchedFields };
};

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

export type AlternativeMatch = {
  id?: string;
  product_name?: string | null;
  company_name?: string | null;
  registration_number?: string | null;
  type?: string | null;
  similarity_score: number;
  matched_fields: string[];
  issuance_date?: string | null;
  expiry_date?: string | null;
  // Drug-specific fields
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
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
    alternative_matches?: AlternativeMatch[];
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
  query,
}: {
  exactFood: FoodProduct | null;
  exactDrug: DrugProduct | null;
  foodMatches: FoodProduct[];
  drugMatches: DrugProduct[];
  query: string;
}): VerifyResponse => {
  const exact = exactFood || exactDrug || null;
  const isDrug = !!exactDrug || (!exact && drugMatches.length > 0);
  const totalMatches = foodMatches.length + drugMatches.length;

  const is_exact_registration = !!exact;

  // Score and rank all matches using fuzzy matching
  const scoredMatches: Array<{ product: FoodProduct | DrugProduct; score: number; matchedFields: string[]; isDrug: boolean }> = [];

  // Score food matches
  for (const food of foodMatches) {
    const { score, matchedFields } = calculateMatchScore(query, food, false);
    scoredMatches.push({ product: food, score, matchedFields, isDrug: false });
  }

  // Score drug matches
  for (const drug of drugMatches) {
    const { score, matchedFields } = calculateMatchScore(query, drug, true);
    scoredMatches.push({ product: drug, score, matchedFields, isDrug: true });
  }

  // Sort by score descending
  scoredMatches.sort((a, b) => b.score - a.score);

  // Get top match (or use exact if available)
  const topMatch = scoredMatches[0] || null;
  const topScore = topMatch?.score || 0;

  // Build alternative matches array
  const alternativeMatches: AlternativeMatch[] = scoredMatches.map(({ product, score, matchedFields, isDrug }) => {
    if (isDrug) {
      const drug = product as DrugProduct;
      return {
        id: drug.id,
        product_name: drug.brand_name || drug.generic_name,
        company_name: drug.manufacturer || drug.company_name,
        registration_number: drug.registration_number,
        type: 'drug',
        similarity_score: score,
        matched_fields: matchedFields,
        issuance_date: drug.issuance_date,
        expiry_date: drug.expiry_date,
        brand_name: drug.brand_name,
        generic_name: drug.generic_name,
        manufacturer: drug.manufacturer || drug.company_name,
      };
    } else {
      const food = product as FoodProduct;
      return {
        id: food.id,
        product_name: food.product_name,
        company_name: food.company_name,
        registration_number: food.registration_number,
        type: food.type_of_product || 'food',
        similarity_score: score,
        matched_fields: matchedFields,
        issuance_date: food.issuance_date,
        expiry_date: food.expiry_date,
      };
    }
  });

  const base: VerifyResponse = {
    product_id: exact?.registration_number || topMatch?.product.registration_number || null,
    is_verified: is_exact_registration,
    message: is_exact_registration
      ? 'Product verified via exact registration match from FDA database.'
      : totalMatches > 0
        ? `Found ${totalMatches} potential match${totalMatches > 1 ? 'es' : ''}. Best match has ${topScore}% similarity score.`
        : 'Product not found in FDA database.',
    details: {
      verification_method: is_exact_registration ? 'Exact Registration Match' : 'Fuzzy Matching with FTS',
      total_matches: totalMatches,
      search_results_count: totalMatches,
      confidence_score: is_exact_registration ? 100 : topScore,
      exact_match: is_exact_registration,
      suggestions: totalMatches === 0 ? [
        'Check for typos or spacing in the registration number',
        'Try searching by brand or generic name',
        'Verify the product category (Food vs Drug) and try again'
      ] : undefined,
      product_info: null,
      verified_product: null,
      alternative_matches: alternativeMatches.length > 0 ? alternativeMatches : undefined,
    },
    registrationDate: exact?.issuance_date || topMatch?.product.issuance_date || null,
    expiryDate: exact?.expiry_date || topMatch?.product.expiry_date || null,
  };

  // Use exact match if available, otherwise use top scored match
  if (exact) {
    // Use exact match
    if (exactDrug) {
      base.details.verified_product = {
        id: exactDrug.id || undefined,
        brand_name: exactDrug.brand_name || null,
        generic_name: exactDrug.generic_name || null,
        manufacturer: exactDrug.manufacturer || exactDrug.company_name || null,
        registration_number: exactDrug.registration_number || null,
        type: 'drug',
        matched_fields: ['registration_number(100%)'],
        relevance_score: 100,
      };
      base.details.product_info = {
        id: exactDrug.id || undefined,
        product_name: exactDrug.brand_name || exactDrug.generic_name || null,
        company_name: exactDrug.manufacturer || exactDrug.company_name || null,
        registration_number: exactDrug.registration_number || null,
        type: 'drug',
        matched_fields: ['registration_number(100%)'],
        relevance_score: 100,
      };
    } else if (exactFood) {
      base.details.product_info = {
        id: exactFood.id || undefined,
        product_name: exactFood.product_name || null,
        company_name: exactFood.company_name || null,
        registration_number: exactFood.registration_number || null,
        type: exactFood.type_of_product || 'food',
        matched_fields: ['registration_number(100%)'],
        relevance_score: 100,
      };
    }
  } else if (topMatch) {
    // Use top scored match from fuzzy matching
    if (topMatch.isDrug) {
      const drug = topMatch.product as DrugProduct;
      base.details.verified_product = {
        id: drug.id || undefined,
        brand_name: drug.brand_name || null,
        generic_name: drug.generic_name || null,
        manufacturer: drug.manufacturer || drug.company_name || null,
        registration_number: drug.registration_number || null,
        type: 'drug',
        matched_fields: topMatch.matchedFields,
        relevance_score: topMatch.score,
      };
      base.details.product_info = {
        id: drug.id || undefined,
        product_name: drug.brand_name || drug.generic_name || null,
        company_name: drug.manufacturer || drug.company_name || null,
        registration_number: drug.registration_number || null,
        type: 'drug',
        matched_fields: topMatch.matchedFields,
        relevance_score: topMatch.score,
      };
    } else {
      const food = topMatch.product as FoodProduct;
      base.details.product_info = {
        id: food.id || undefined,
        product_name: food.product_name || null,
        company_name: food.company_name || null,
        registration_number: food.registration_number || null,
        type: food.type_of_product || 'food',
        matched_fields: topMatch.matchedFields,
        relevance_score: topMatch.score,
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

  return buildResponse({ exactFood, exactDrug, foodMatches, drugMatches, query: q });
};

export const useGetProductVerifyQuery = (product_id: string, category?: string) => {
  return queryOptions({
    queryKey: ["verify", product_id, category ?? 'all'],
    queryFn: () => ProductVerify(product_id, category),
  });
};
