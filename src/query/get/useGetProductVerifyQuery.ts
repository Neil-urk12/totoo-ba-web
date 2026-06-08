import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";
import type { FoodProduct, DrugProduct, VerifiedProduct, ProductInfo, VerifyResponse } from "../../types";
import { verifyProduct } from "../../domain/verifyProduct";

export type { VerifiedProduct, ProductInfo, VerifyResponse };

const tableForCategory = (category?: string) => {
  const c = (category || '').toLowerCase();
  if (c === 'food') return ['food_products'] as const;
  if (c === 'drugs' || c === 'drug' || c === 'pharmaceutical') return ['drug_products'] as const;
  return ['food_products', 'drug_products'] as const;
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
    // Sanitize query for FTS: strip special characters and normalize spaces
    const qFts = q
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!qFts) return [];

    const base = supabase.from(table).select('*', { count: 'exact' });

    // Try websearch first with explicit config
    const first = await base
      .textSearch('search_vector', qFts, { type: 'websearch', config: 'english' })
      .limit(10);

    if (first.error) {
      console.error(`Websearch error on ${table}:`, first.error);

      // Fallback to plain search - re-create query to avoid chaining issues
      const alt = await supabase.from(table).select('*', { count: 'exact' })
        .textSearch('search_vector', qFts, { type: 'plain', config: 'english' })
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

  // If no alternative candidates found for a restricted category, try the other table as a fallback for alternatives
  if (tables.length === 1) {
    const chosen = tables[0];
    const noFoodAlts = chosen === 'food_products' && (foodMatches.length <= 1); // likely only exact/top
    const noDrugAlts = chosen === 'drug_products' && (drugMatches.length <= 1);
    if (noFoodAlts) {
      try {
        drugMatches = await runFts('drug_products');
      } catch (err) { console.error(err); }
    } else if (noDrugAlts) {
      try {
        foodMatches = await runFts('food_products');
      } catch (err) { console.error(err); }
    }
  }

  return verifyProduct({ exactFood, exactDrug, foodMatches, drugMatches });
};

export const useGetProductVerifyQuery = (product_id: string, category?: string) => {
  return queryOptions({
    queryKey: ["verify", product_id, category ?? 'all'],
    queryFn: () => ProductVerify(product_id, category),
  });
};
