import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";

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

const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  // Get total products count from both tables
  const [foodCountResult, drugCountResult] = await Promise.all([
    supabase.from('food_products').select('*', { count: 'exact', head: true }),
    supabase.from('drug_products').select('*', { count: 'exact', head: true })
  ]);

  const totalFoodProducts = foodCountResult.count || 0;
  const totalDrugProducts = drugCountResult.count || 0;
  const totalProducts = totalFoodProducts + totalDrugProducts;

  const verifiedToday = 0;

  // Get products expiring soon (within 30 days)
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const expiryThreshold = thirtyDaysFromNow.toISOString().split('T')[0];

  const [foodExpiringResult, drugExpiringResult] = await Promise.all([
    supabase.from('food_products').select('*', { count: 'exact', head: true }).lte('expiry_date', expiryThreshold).gte('expiry_date', today),
    supabase.from('drug_products').select('*', { count: 'exact', head: true }).lte('expiry_date', expiryThreshold).gte('expiry_date', today)
  ]);

  const expiringSoon = (foodExpiringResult.count || 0) + (drugExpiringResult.count || 0);

  // Get unique companies/manufacturers
  const [foodCompaniesResult, drugCompaniesResult] = await Promise.all([
    supabase.from('food_products').select('company_name').not('company_name', 'is', null),
    supabase.from('drug_products').select('company_name, manufacturer').not('company_name', 'is', null)
  ]);

  const foodCompanies = new Set(foodCompaniesResult.data?.map(p => p.company_name) || []);
  const drugCompanies = new Set([
    ...(drugCompaniesResult.data?.map(p => p.company_name).filter(Boolean) || []),
    ...(drugCompaniesResult.data?.map(p => p.manufacturer).filter(Boolean) || [])
  ]);
  
  const activeBusinesses = foodCompanies.size + drugCompanies.size;

  // Get products by category
  const [foodCategoriesResult, drugCategoriesResult] = await Promise.all([
    supabase.from('food_products').select('type_of_product').not('type_of_product', 'is', null),
    supabase.from('drug_products').select('brand_name')
  ]);

  // Count food categories
  const foodCategoryCounts: Record<string, number> = {};
  foodCategoriesResult.data?.forEach(product => {
    const category = product.type_of_product || 'Food Supplement';
    foodCategoryCounts[category] = (foodCategoryCounts[category] || 0) + 1;
  });

  // Count drug categories
  const drugCount = drugCategoriesResult.data?.length || 0;

  // Create comprehensive category list including all food product types
  const productsByCategory = [
    { name: 'Food Supplements', count: foodCategoryCounts['Food Supplement'] || 0, trend: 'up' as const },
    { name: 'Food Products', count: foodCategoryCounts['Food'] || 0, trend: 'up' as const },
    { name: 'Cosmetics', count: foodCategoryCounts['Cosmetic'] || 0, trend: 'up' as const },
    { name: 'Drugs', count: drugCount, trend: 'neutral' as const },
    { name: 'Medical Devices', count: foodCategoryCounts['Medical Device'] || 0, trend: 'down' as const },
    // Add any other food product types found in the database
    ...Object.entries(foodCategoryCounts)
      .filter(([category]) => !['Food Supplement', 'Food', 'Cosmetic', 'Medical Device'].includes(category))
      .map(([category, count]) => ({ name: category, count, trend: 'up' as const }))
  ].filter(category => category.count > 0);

  // Get top manufacturers by product count
  const [topFoodManufacturersResult, topDrugManufacturersResult] = await Promise.all([
    supabase.from('food_products').select('company_name').not('company_name', 'is', null),
    supabase.from('drug_products').select('company_name, manufacturer').not('company_name', 'is', null)
  ]);

  // Count products per manufacturer
  const manufacturerCounts: Record<string, number> = {};
  
  // Count food products
  topFoodManufacturersResult.data?.forEach(product => {
    const manufacturer = product.company_name;
    if (manufacturer) {
      manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1;
    }
  });

  // Count drug products
  topDrugManufacturersResult.data?.forEach(product => {
    const manufacturer = product.company_name || product.manufacturer;
    if (manufacturer) {
      manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1;
    }
  });

  // Get top 5 manufacturers
  const topManufacturers = Object.entries(manufacturerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, products], index) => ({
      rank: index + 1,
      name,
      products,
      complianceRate: Math.floor(Math.random() * 10) + 90 // Mock compliance rate for now
    }));

  // Generate recent activity based on recent products
  const [recentFoodResult, recentDrugResult] = await Promise.all([
    supabase.from('food_products').select('product_name, issuance_date, company_name').order('issuance_date', { ascending: false }).limit(5),
    supabase.from('drug_products').select('brand_name, issuance_date, company_name').order('issuance_date', { ascending: false }).limit(3)
  ]);

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

  // Calculate compliance rate (mock for now - could be based on expiry dates)
  const complianceRate = Math.round((totalProducts - expiringSoon) / totalProducts * 100);

  // Mock active recalls (this would need a separate recalls table)
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
