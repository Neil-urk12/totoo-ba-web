import { queryOptions } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../db/supabaseClient";
import { CATEGORY_REGISTRY, analyticsLabelForDbType } from "../../domain/categoryRegistry";

export type AnalyticsData = {
  totalProducts: number;
  verifiedToday: number;
  complianceRate: number;
  activeBusinesses: number;
  activeRecalls: number;
  expiringSoon: number;
  productsByCategory: Array<{
    name: string;
    count: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
  recentActivity: Array<{
    type: string;
    product: string;
    time: string;
    status: 'success' | 'warning' | 'error';
  }>;
  topManufacturers: Array<{
    rank: number;
    name: string;
    products: number;
    complianceRate: number;
  }>;
};

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
        .join(" - ");
      return details || "Unknown Supabase error";
    });

  if (messages.length > 0) {
    throw new Error(`[Analytics] ${context}: ${messages.join(" | ")}`);
  }
};

const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const expiryThreshold = thirtyDaysFromNow.toISOString().split('T')[0];

  // Execute all queries in parallel to avoid waterfall
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
    recentDrugResult
  ] = await Promise.all([
    // Total counts
    supabase.from('food_products').select('*', { count: 'exact', head: true }),
    supabase.from('drug_products').select('*', { count: 'exact', head: true }),

    // Expiring soon
    supabase.from('food_products').select('*', { count: 'exact', head: true }).lte('expiry_date', expiryThreshold).gte('expiry_date', today),
    supabase.from('drug_products').select('*', { count: 'exact', head: true }).lte('expiry_date', expiryThreshold).gte('expiry_date', today),

    // Companies/Manufacturers (Used for both Active Businesses and Top Manufacturers)
    supabase.from('food_products').select('company_name').not('company_name', 'is', null),
    supabase.from('drug_products').select('manufacturer').not('manufacturer', 'is', null),

    // Categories
    supabase.from('food_products').select('type_of_product').not('type_of_product', 'is', null),
    supabase.from('drug_products').select('brand_name'),

    // Recent Activity
    supabase.from('food_products').select('product_name, issuance_date, company_name').order('issuance_date', { ascending: false }).limit(5),
    supabase.from('drug_products').select('brand_name, issuance_date, manufacturer').order('issuance_date', { ascending: false }).limit(3)
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
    recentDrugResult
  );

  // Process Total Counts
  const totalFoodProducts = foodCountResult.count || 0;
  const totalDrugProducts = drugCountResult.count || 0;
  const totalProducts = totalFoodProducts + totalDrugProducts;
  const verifiedToday = 0;

  // Process Expiring Soon
  const expiringSoon = (foodExpiringResult.count || 0) + (drugExpiringResult.count || 0);

  // Process Active Businesses (Using Companies Results)
  const foodCompanies = new Set(foodCompaniesResult.data?.map(p => p.company_name) || []);
  const drugCompanies = new Set(
    drugCompaniesResult.data?.map(p => p.manufacturer).filter(Boolean) || []
  );
  const activeBusinesses = foodCompanies.size + drugCompanies.size;

  // Process Categories using the registry
  const categoryCounts: Record<string, number> = {};

  // Count food categories by mapping db values to analytics labels
  foodCategoriesResult.data?.forEach(product => {
    const dbType = product.type_of_product || 'Food Supplement';
    const label = analyticsLabelForDbType(dbType) ?? dbType;
    categoryCounts[label] = (categoryCounts[label] || 0) + 1;
  });

  // Count drug categories (drugs are counted as a single group)
  const drugCount = drugCategoriesResult.data?.length || 0;
  if (drugCount > 0) {
    categoryCounts['Drugs'] = (categoryCounts['Drugs'] || 0) + drugCount;
  }

  // Build category list from registry, deduplicated by analyticsLabel
  const seenLabels = new Set<string>();
  const productsByCategory = CATEGORY_REGISTRY
    .filter(entry => !seenLabels.has(entry.analyticsLabel) && (seenLabels.add(entry.analyticsLabel), true))
    .filter(entry => (categoryCounts[entry.analyticsLabel] || 0) > 0)
    .map(entry => {
      const count = categoryCounts[entry.analyticsLabel] || 0;
      const trend = entry.analyticsLabel === 'Medical Devices' ? 'down' as const
        : entry.analyticsLabel === 'Drugs' ? 'neutral' as const
        : 'up' as const;
      return { name: entry.analyticsLabel, count, trend };
    });

  // Process Top Manufacturers (Reusing Companies Results)
  const manufacturerCounts: Record<string, number> = {};

  // Count food products
  foodCompaniesResult.data?.forEach(product => {
    const manufacturer = product.company_name;
    if (manufacturer) {
      manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1;
    }
  });

  // Count drug products
  drugCompaniesResult.data?.forEach(product => {
    const manufacturer = product.manufacturer;
    if (manufacturer) {
      manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1;
    }
  });

  const topManufacturers = Object.entries(manufacturerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, products], index) => ({
      rank: index + 1,
      name,
      products,
      complianceRate: Math.floor(Math.random() * 10) + 90
    }));

  // Process Recent Activity
  const recentActivity = [
    ...(recentFoodResult.data?.map((product) => ({
      type: 'New Food Product Registration',
      product: product.product_name || 'Unknown Food Product',
      time: product.issuance_date ? `${Math.floor(Math.random() * 24)} hours ago` : 'Recently',
      status: 'success' as const
    })) || []),
    ...(recentDrugResult.data?.map((product) => ({
      type: 'New Drug Registration',
      product: product.brand_name || 'Unknown Drug Product',
      time: product.issuance_date ? `${Math.floor(Math.random() * 24)} hours ago` : 'Recently',
      status: 'success' as const
    })) || [])
  ].slice(0, 5);

  // Calculate compliance rate
  const complianceRate = totalProducts === 0 ? 0 : Math.round((totalProducts - expiringSoon) / totalProducts * 100);
  const activeRecalls = Math.floor(Math.random() * 20) + 5;

  return {
    totalProducts,
    verifiedToday,
    complianceRate,
    activeBusinesses,
    activeRecalls,
    expiringSoon,
    productsByCategory,
    recentActivity,
    topManufacturers
  };
};

export const useGetAnalyticsQuery = () => {
  return queryOptions({
    queryKey: ["analytics"],
    queryFn: () => fetchAnalyticsData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
