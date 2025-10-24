import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";
import type { UnifiedProduct, UnifiedProductsResponse } from "../../types/UnifiedProduct";

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

/**
 * Optimized fetch function using the unified_products view
 * This replaces the previous 4-query approach with a single query
 */
const fetchUnifiedProducts = async (
  category?: string, 
  page: number = 0, 
  searchQuery?: string
): Promise<UnifiedProductsResponse> => {
  const sanitizedSearchQuery = validateAndSanitizeSearchQuery(searchQuery);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE - 1;

  // Build the unified query - SINGLE QUERY FOR ALL CASES
  let query = supabase
    .from('unified_products')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true });

  // Apply category filter if needed
  if (category && category !== 'All Categories') {
    if (category === 'Food' || category === 'Food Supplement' || category === 'Cosmetic' || category === 'Medical Device') {
      query = query.eq('source_category', 'Food');
    } else if (category === 'Drugs' || category === 'Drug' || category === 'Pharmaceutical') {
      query = query.eq('source_category', 'Drugs');
    }
  }

  // Apply search if provided
  if (sanitizedSearchQuery) {
    query = query.textSearch('search_vector', sanitizedSearchQuery, { 
      type: 'websearch', 
      config: 'english' 
    });
  }

  // Execute single query with pagination
  const { data, error, count } = await query.range(startIndex, endIndex);

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasMore = (page + 1) * ITEMS_PER_PAGE < totalCount;

  return {
    data: (data as UnifiedProduct[]) || [],
    hasMore,
    totalCount,
    currentPage: page,
    totalPages,
  };
};

/**
 * React Query infinite query hook for unified products
 * This is the main hook to use in components
 */
export const useGetUnifiedProductsInfiniteQuery = (category?: string, searchQuery?: string) => {
  return useInfiniteQuery({
    queryKey: ["unified-products-infinite", category, searchQuery],
    queryFn: async ({ pageParam }) => await fetchUnifiedProducts(category, pageParam, searchQuery),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};

/**
 * React Query single page query for unified products
 */
export const useGetUnifiedProductsQuery = (category?: string, page: number = 0, searchQuery?: string) => {
  return queryOptions({
    queryKey: ["unified-products", category, page, searchQuery],
    queryFn: async () => {
      const response = await fetchUnifiedProducts(category, page, searchQuery);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Convenience hooks for specific categories
 */
export const useGetUnifiedFoodProductsQuery = (searchQuery?: string) => {
  return useGetUnifiedProductsQuery('Food', 0, searchQuery);
};

export const useGetUnifiedDrugProductsQuery = (searchQuery?: string) => {
  return useGetUnifiedProductsQuery('Drugs', 0, searchQuery);
};
