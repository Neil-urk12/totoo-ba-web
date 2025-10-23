import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";

export type FoodProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null; // Brand name field exists in food_products table
  company_name?: string | null;
  product_name?: string | null;
  type_of_product?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
  search_vector?: string | null; // Full-text search vector
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
  search_vector?: string | null; // Full-text search vector
}

export type Product = FoodProduct | DrugProduct;

export type ProductsResponse = {
  data: Product[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
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

/**
 * Validates and sanitizes search query input
 * @param searchQuery - Raw search query string
 * @returns Sanitized search query or null if invalid
 */
const validateAndSanitizeSearchQuery = (searchQuery?: string): string | null => {
  if (!searchQuery || typeof searchQuery !== 'string') {
    return null;
  }

  // Trim whitespace
  const trimmed = searchQuery.trim();
  
  // Check minimum length (at least 2 characters)
  if (trimmed.length < 2) {
    return null;
  }

  return trimmed;
};

const ITEMS_PER_PAGE = 30;

const fetchProducts = async (category?: string, page: number = 0, searchQuery?: string): Promise<ProductsResponse> => {
  const shouldQueryFood = !category || category === 'All Categories' || category === 'Food' || category === 'Food Supplement' || category === 'Cosmetic' || category === 'Medical Device';
  const shouldQueryDrug =
    !category ||
    category === 'All Categories' ||
    category === 'Pharmaceutical' ||
    category === 'Drugs' ||
    category === 'Drug';

  const sanitizedSearchQuery = validateAndSanitizeSearchQuery(searchQuery);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE - 1;

  let allData: Product[] = [];
  let totalCount = 0;

  // When querying both tables, we need to fetch counts first to properly paginate
  if (shouldQueryFood && shouldQueryDrug) {
    // Get counts for both tables
    let foodCountQuery = supabase
      .from('food_products')
      .select('*', { count: 'exact', head: true });
    
    let drugCountQuery = supabase
      .from('drug_products')
      .select('*', { count: 'exact', head: true });
    
    if (sanitizedSearchQuery) {
      foodCountQuery = foodCountQuery.textSearch('search_vector', sanitizedSearchQuery, { type: 'websearch', config: 'english' });
      drugCountQuery = drugCountQuery.textSearch('search_vector', sanitizedSearchQuery, { type: 'websearch', config: 'english' });
    }

    const [foodCountRes, drugCountRes] = await Promise.all([
      foodCountQuery,
      drugCountQuery
    ]);

    if (foodCountRes.error) {
      throw new Error(`Failed to fetch food products count: ${foodCountRes.error.message}`);
    }
    if (drugCountRes.error) {
      throw new Error(`Failed to fetch drug products count: ${drugCountRes.error.message}`);
    }

    const foodCount = foodCountRes.count || 0;
    const drugCount = drugCountRes.count || 0;
    totalCount = foodCount + drugCount;

    // Fetch data from both tables and combine
    let foodQuery = supabase
      .from('food_products')
      .select('*')
      .order('product_name', { ascending: true });
    
    let drugQuery = supabase
      .from('drug_products')
      .select('*')
      .order('brand_name', { ascending: true });
    
    if (sanitizedSearchQuery) {
      foodQuery = foodQuery.textSearch('search_vector', sanitizedSearchQuery, { type: 'websearch', config: 'english' });
      drugQuery = drugQuery.textSearch('search_vector', sanitizedSearchQuery, { type: 'websearch', config: 'english' });
    }

    const [foodRes, drugRes] = await Promise.all([
      foodQuery.range(0, Math.max(endIndex, ITEMS_PER_PAGE * 2)),
      drugQuery.range(0, Math.max(endIndex, ITEMS_PER_PAGE * 2))
    ]);

    if (foodRes.error) {
      throw new Error(`Failed to fetch food products: ${foodRes.error.message}`);
    }
    if (drugRes.error) {
      throw new Error(`Failed to fetch drug products: ${drugRes.error.message}`);
    }

    // Combine and sort results
    allData = [...(foodRes.data || []), ...(drugRes.data || [])];
    allData.sort((a, b) => {
      const nameA = 'product_name' in a ? a.product_name : 'brand_name' in a ? a.brand_name : '';
      const nameB = 'product_name' in b ? b.product_name : 'brand_name' in b ? b.brand_name : '';
      return (nameA || '').localeCompare(nameB || '');
    });

    // Apply pagination on combined sorted results
    allData = allData.slice(startIndex, endIndex + 1);
  } else {
    // Single table query - can use server-side pagination directly
    if (shouldQueryFood) {
      let foodQuery = supabase
        .from('food_products')
        .select('*', { count: 'exact' })
        .order('product_name', { ascending: true });
      
      if (sanitizedSearchQuery) {
        foodQuery = foodQuery.textSearch('search_vector', sanitizedSearchQuery, { type: 'websearch', config: 'english' });
      }

      const { data: foodData, error: foodError, count: foodCount } = await foodQuery.range(startIndex, endIndex);
      
      if (foodError) {
        throw new Error(`Failed to fetch food products: ${foodError.message}`);
      }
      
      allData = foodData || [];
      totalCount = foodCount || 0;
    }

    if (shouldQueryDrug) {
      let drugQuery = supabase
        .from('drug_products')
        .select('*', { count: 'exact' })
        .order('brand_name', { ascending: true });
      
      if (sanitizedSearchQuery) {
        drugQuery = drugQuery.textSearch('search_vector', sanitizedSearchQuery, { type: 'websearch', config: 'english' });
      }

      const { data: drugData, error: drugError, count: drugCount } = await drugQuery.range(startIndex, endIndex);
      
      if (drugError) {
        throw new Error(`Failed to fetch drug products: ${drugError.message}`);
      }
      
      allData = drugData || [];
      totalCount = drugCount || 0;
    }
  }

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasMore = (page + 1) * ITEMS_PER_PAGE < totalCount;

  return {
    data: allData,
    hasMore,
    totalCount,
    currentPage: page,
    totalPages,
  };
};

export const useGetProductsInfiniteQuery = (category?: string, searchQuery?: string) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", category, searchQuery],
    queryFn: async ({ pageParam }) => await fetchProducts(category, pageParam, searchQuery),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetFoodProductsInfiniteQuery = (searchQuery?: string) => {
  return useGetProductsInfiniteQuery('Food', searchQuery);
};

export const useGetProductsQuery = (category?: string, page: number = 0, searchQuery?: string) => {
  return queryOptions({
    queryKey: ["products", category, page, searchQuery],
    queryFn: async () => {
      const response = await fetchProducts(category, page, searchQuery);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetFoodProductsQuery = (searchQuery?: string) => {
  return useGetProductsQuery('Food', 0, searchQuery);
};

// Fetch all rows from all relevant tables without pagination
const fetchAllTablesData = async (): Promise<AllDataResponse> => {
  const [foodProductsRes, drugProductsRes, foodIndustryRes, drugIndustryRes] = await Promise.all([
    supabase.from('food_products').select('*', { count: 'exact' }),
    supabase.from('drug_products').select('*', { count: 'exact' }),
    supabase.from('food_industry').select('*', { count: 'exact' }),
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
