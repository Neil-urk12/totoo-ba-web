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

const fetchProducts = async (pageParam: number = 0, searchQuery?: string, category?: string): Promise<ProductsResponse> => {
  const limit = 20;
  const offset = pageParam * limit;

  // Determine which tables to query based on category
  const shouldQueryFood = !category || category === 'All Categories' || category === 'Food' || category === 'Food Supplement' || category === 'Cosmetic' || category === 'Medical Device';
  const shouldQueryDrug = !category || category === 'All Categories' || category === 'Pharmaceutical';

  let allData: Product[] = [];
  let totalCount = 0;

  // Query food products
  if (shouldQueryFood) {
    let foodQuery = supabase
      .from('food_products')
      .select('*', { count: 'exact' })
      .order('product_name', { ascending: true })
      .range(offset, offset + limit - 1);

    // Add search filter if searchQuery is provided
    if (searchQuery && searchQuery.trim()) {
      foodQuery = foodQuery.or(`product_name.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%,registration_number.ilike.%${searchQuery}%`);
    }

    const { data: foodData, error: foodError, count: foodCount } = await foodQuery;
    
    if (foodError) {
      throw new Error(`Failed to fetch food products: ${foodError.message}`);
    }
    
    allData = allData.concat(foodData || []);
    totalCount += foodCount || 0;
  }

  // Query drug products
  if (shouldQueryDrug) {
    let drugQuery = supabase
      .from('drug_products')
      .select('*', { count: 'exact' })
      .order('brand_name', { ascending: true })
      .range(offset, offset + limit - 1);

    // Add search filter if searchQuery is provided
    if (searchQuery && searchQuery.trim()) {
      drugQuery = drugQuery.or(`brand_name.ilike.%${searchQuery}%,generic_name.ilike.%${searchQuery}%,manufacturer.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%,registration_number.ilike.%${searchQuery}%`);
    }

    const { data: drugData, error: drugError, count: drugCount } = await drugQuery;
    
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

  // Apply pagination to combined results
  const paginatedData = allData.slice(0, limit);
  const hasMore = allData.length > limit;

  return {
    data: paginatedData,
    hasMore,
    totalCount,
  };
};

export const useGetProductsInfiniteQuery = (searchQuery?: string, category?: string) => {
  return useInfiniteQuery({
    queryKey: ["products-infinite", searchQuery, category],
    queryFn: ({ pageParam = 0 }) => fetchProducts(pageParam, searchQuery, category),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Keep the old function for backward compatibility
export const useGetFoodProductsInfiniteQuery = (searchQuery?: string) => {
  return useGetProductsInfiniteQuery(searchQuery, 'Food');
};

export const useGetProductsQuery = (category?: string) => {
  return queryOptions({
    queryKey: ["products", category],
    queryFn: async () => {
      const response = await fetchProducts(0, undefined, category);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetFoodProductsQuery = () => {
  return useGetProductsQuery('Food');
};
