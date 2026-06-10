/**
 * Supabase Analytics Adapter
 *
 * Concrete adapter that fetches raw analytics data from Supabase.
 * Satisfies the AnalyticsAdapter interface from the analyticsDataAccess domain.
 *
 * Owns all Supabase-specific logic: query construction, error handling,
 * and response shape normalization.
 *
 * @module adapters/supabaseAnalyticsAdapter
 */

import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../db/supabaseClient';
import type { AnalyticsAdapter } from '../analyticsDataAccess';

const assertNoSupabaseErrors = (
  context: string,
  ...results: Array<{ error?: PostgrestError | null }>
) => {
  const messages = results
    .map((result) => result?.error)
    .filter((error): error is PostgrestError => Boolean(error))
    .map((error) => {
      const details = [error.message, error.details, error.hint]
        .filter(Boolean)
        .join(' - ');
      return details || 'Unknown Supabase error';
    });

  if (messages.length > 0) {
    throw new Error(`[Analytics] ${context}: ${messages.join(' | ')}`);
  }
};

export const supabaseAnalyticsAdapter: AnalyticsAdapter = {
  async fetchRawData(today, expiryThreshold) {
    const [
      foodCountResult,
      drugCountResult,
      foodExpiringResult,
      drugExpiringResult,
      foodCompaniesResult,
      drugCompaniesResult,
      foodCategoriesResult,
      drugCategoriesResult,
      recentFoodResult,
      recentDrugResult,
    ] = await Promise.all([
      // Total counts
      supabase.from('food_products').select('*', { count: 'exact', head: true }),
      supabase.from('drug_products').select('*', { count: 'exact', head: true }),

      // Expiring soon
      supabase
        .from('food_products')
        .select('*', { count: 'exact', head: true })
        .lte('expiry_date', expiryThreshold)
        .gte('expiry_date', today),
      supabase
        .from('drug_products')
        .select('*', { count: 'exact', head: true })
        .lte('expiry_date', expiryThreshold)
        .gte('expiry_date', today),

      // Companies/Manufacturers
      supabase
        .from('food_products')
        .select('company_name')
        .not('company_name', 'is', null),
      supabase
        .from('drug_products')
        .select('manufacturer')
        .not('manufacturer', 'is', null),

      // Categories
      supabase
        .from('food_products')
        .select('type_of_product')
        .not('type_of_product', 'is', null),
      supabase.from('drug_products').select('brand_name'),

      // Recent Activity
      supabase
        .from('food_products')
        .select('product_name, issuance_date, company_name')
        .order('issuance_date', { ascending: false })
        .limit(5),
      supabase
        .from('drug_products')
        .select('brand_name, issuance_date, manufacturer')
        .order('issuance_date', { ascending: false })
        .limit(3),
    ]);

    assertNoSupabaseErrors(
      'Failed to fetch analytics data',
      foodCountResult,
      drugCountResult,
      foodExpiringResult,
      drugExpiringResult,
      foodCompaniesResult,
      drugCompaniesResult,
      foodCategoriesResult,
      drugCategoriesResult,
      recentFoodResult,
      recentDrugResult,
    );

    return {
      foodCount: foodCountResult.count || 0,
      drugCount: drugCountResult.count || 0,
      foodExpiringCount: foodExpiringResult.count || 0,
      drugExpiringCount: drugExpiringResult.count || 0,
      foodCompanyNames: (foodCompaniesResult.data || [])
        .map((p) => p.company_name)
        .filter((name): name is string => Boolean(name)),
      drugManufacturerNames: (drugCompaniesResult.data || [])
        .map((p) => p.manufacturer)
        .filter((name): name is string => Boolean(name)),
      foodCategoryTypes: (foodCategoriesResult.data || []).map(
        (p) => p.type_of_product,
      ),
      drugBrandNames: (drugCategoriesResult.data || [])
        .map((p) => p.brand_name)
        .filter((name): name is string => Boolean(name)),
      recentFoodProducts: (recentFoodResult.data || []).map((p) => ({
        product_name: p.product_name,
        issuance_date: p.issuance_date,
        company_name: p.company_name,
      })),
      recentDrugProducts: (recentDrugResult.data || []).map((p) => ({
        brand_name: p.brand_name,
        issuance_date: p.issuance_date,
        manufacturer: p.manufacturer,
      })),
    };
  },
};
