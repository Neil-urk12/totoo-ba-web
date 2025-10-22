import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";

export type FoodProduct = {
  id?: string;
  registration_number: string;
  company_name?: string | null;
  product_name?: string | null;
  type_of_product?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
}

export type DrugProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
  company_name?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
}

export type Product = FoodProduct | DrugProduct;

export type ProductsResponse = {
  data: Product[];
  hasMore: boolean;
  totalCount: number;
}

// Generic record types for industry tables
export type FoodIndustry = Record<string, unknown>;
export type DrugIndustry = Record<string, unknown>;

export type AllDataResponse = {
  food_products: FoodProduct[];
  drug_products: DrugProduct[];
  food_industry: FoodIndustry[];
  drug_industry: DrugIndustry[];
  totals: {
    food_products: number;
    drug_products: number;
    food_industry: number;
    drug_industry: number;
  };
}



const fetchProducts = async (category?: string): Promise<ProductsResponse> => {
  const shouldQueryFood = !category || category === 'All Categories' || category === 'Food' || category === 'Food Supplement' || category === 'Cosmetic' || category === 'Medical Device';
  const shouldQueryDrug =
    !category ||
    category === 'All Categories' ||
    category === 'Pharmaceutical' ||
    category === 'Drugs' ||
    category === 'Drug';

  let allData: Product[] = [];
  let totalCount = 0;

  // Query food products
  if (shouldQueryFood) {
    const { data: foodData, error: foodError, count: foodCount } = await supabase
      .from('food_products')
      .select('*', { count: 'planned' })
      .order('product_name', { ascending: true });
    
    if (foodError) {
      throw new Error(`Failed to fetch food products: ${foodError.message}`);
    }
    
    allData = allData.concat(foodData || []);
    totalCount += foodCount || 0;
  }

  // Query drug products
  if (shouldQueryDrug) {
    const { data: drugData, error: drugError, count: drugCount } = await supabase
      .from('drug_products')
      .select('*', { count: 'planned' })
      .order('brand_name', { ascending: true });
    
    if (drugError) {
      throw new Error(`Failed to fetch drug products: ${drugError.message}`);
    }
    
    allData = allData.concat(drugData || []);
    totalCount += drugCount || 0;
  }

  // Sort combined results
  allData.sort((a, b) => {
    const nameA = 'product_name' in a ? a.product_name : 'brand_name' in a ? a.brand_name : '';
    const nameB = 'product_name' in b ? b.product_name : 'brand_name' in b ? b.brand_name : '';
    return (nameA || '').localeCompare(nameB || '');
  });

  return {
    data: allData,
    hasMore: false,
    totalCount,
  };
};

export const useGetProductsInfiniteQuery = (category?: string) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", category],
    queryFn: async () => await fetchProducts(category),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetFoodProductsInfiniteQuery = () => {
  return useGetProductsInfiniteQuery('Food');
};

export const useGetProductsQuery = (category?: string) => {
  return queryOptions({
    queryKey: ["products", category],
    queryFn: async () => {
      const response = await fetchProducts(category);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetFoodProductsQuery = () => {
  return useGetProductsQuery('Food');
};

// Fetch all rows from all relevant tables without pagination
const fetchAllTablesData = async (): Promise<AllDataResponse> => {
  const [foodProductsRes, drugProductsRes, foodIndustryRes, drugIndustryRes] = await Promise.all([
    supabase.from('food_products').select('*', { count: 'exact' }),
    supabase.from('Drug Industry').select('*', { count: 'exact' }),
    supabase.from('Food Industry').select('*', { count: 'exact' }),
    supabase.from('drug_industry').select('*', { count: 'exact' }),
  ]);

  if (foodProductsRes.error) {
    throw new Error(`Failed to fetch food_products: ${foodProductsRes.error.message}`);
  }
  if (drugProductsRes.error) {
    throw new Error(`Failed to fetch drug_products: ${drugProductsRes.error.message}`);
  }
  if (foodIndustryRes.error) {
    throw new Error(`Failed to fetch food_industry: ${foodIndustryRes.error.message}`);
  }
  if (drugIndustryRes.error) {
    throw new Error(`Failed to fetch drug_industry: ${drugIndustryRes.error.message}`);
  }

  return {
    food_products: (foodProductsRes.data as FoodProduct[]) || [],
    drug_products: (drugProductsRes.data as DrugProduct[]) || [],
    food_industry: (foodIndustryRes.data as FoodIndustry[]) || [],
    drug_industry: (drugIndustryRes.data as DrugIndustry[]) || [],
    totals: {
      food_products: foodProductsRes.count || 0,
      drug_products: drugProductsRes.count || 0,
      food_industry: foodIndustryRes.count || 0,
      drug_industry: drugIndustryRes.count || 0,
    },
  };
};

// React Query helper to retrieve all data at once
export const useGetAllDataQuery = () => {
  return queryOptions({
    queryKey: ['all-data'],
    queryFn: fetchAllTablesData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
