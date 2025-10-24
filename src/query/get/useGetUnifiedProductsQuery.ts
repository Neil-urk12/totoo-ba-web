/**
 * Unified Products Query Hook
 * 
 * React Query hooks for fetching products from the unified_products database view.
 * This view combines food_products and drug_products tables into a single normalized
 * structure for efficient querying and display.
 * 
 * The unified approach replaces the previous multi-query strategy, reducing from
 * 4 separate queries to 1 optimized query per request.
 * 
 * @module useGetUnifiedProductsQuery
 */

import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";
import type { UnifiedProduct, UnifiedProductsResponse } from "../../types/UnifiedProduct";

/**
 * Validates and sanitizes search query input
 * 
 * Ensures the search query is a valid string with minimum length requirements.
 * This prevents unnecessary database queries and potential injection issues.
 * 
 * @param {string} [searchQuery] - Raw search query string from user input
 * @returns {string | null} Sanitized search query or null if invalid
 * 
 * @example
 * validateAndSanitizeSearchQuery("  Aspirin  ") // Returns "Aspirin"
 * validateAndSanitizeSearchQuery("A") // Returns null (too short)
 * validateAndSanitizeSearchQuery("") // Returns null (empty)
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

/**
 * Number of items to fetch per page
 * @constant {number}
 */
const ITEMS_PER_PAGE = 30;

/**
 * Fetches unified products from the database
 * 
 * Optimized fetch function using the unified_products view. This single query
 * replaces the previous approach that required 4 separate queries (2 for counts,
 * 2 for data) when fetching from both food and drug tables.
 * 
 * Features:
 * - Single database query for all cases
 * - Category filtering (Food/Drugs)
 * - Full-text search support
 * - Server-side pagination
 * - Sorted results by product name
 * 
 * @async
 * @param {string} [category] - Filter by category ('Food', 'Drugs', or 'All Categories')
 * @param {number} [page=0] - Page number (0-indexed)
 * @param {string} [searchQuery] - Search term for full-text search
 * @returns {Promise<UnifiedProductsResponse>} Paginated products with metadata
 * @throws {Error} If the database query fails
 * 
 * @example
 * const response = await fetchUnifiedProducts('Food', 0, 'vitamin');
 * console.log(response.data); // Array of UnifiedProduct objects
 * console.log(response.hasMore); // true if more pages available
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
 * 
 * This is the main hook for components that need infinite scroll or
 * "load more" functionality. It automatically handles pagination and
 * appends new pages to the existing data.
 * 
 * @param {string} [category] - Filter by category ('Food', 'Drugs', or 'All Categories')
 * @param {string} [searchQuery] - Search term for filtering products
 * @returns {UseInfiniteQueryResult} React Query infinite query result
 * @property {Array<UnifiedProductsResponse>} data.pages - Array of page responses
 * @property {Function} fetchNextPage - Function to load the next page
 * @property {boolean} hasNextPage - Whether more pages are available
 * @property {boolean} isFetchingNextPage - Whether next page is loading
 * 
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetUnifiedProductsInfiniteQuery('Food', 'vitamin');
 * 
 * // Render products from all pages
 * data?.pages.map(page => page.data.map(product => <ProductCard key={product.id} product={product} />))
 * 
 * // Load more button
 * {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
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
 * 
 * Returns query options for fetching a single page of products.
 * Use with useQuery() for standard pagination.
 * 
 * @param {string} [category] - Filter by category
 * @param {number} [page=0] - Page number (0-indexed)
 * @param {string} [searchQuery] - Search term
 * @returns {QueryOptions} React Query options object
 * 
 * @example
 * const { data, isLoading } = useQuery(useGetUnifiedProductsQuery('Food', 0, 'vitamin'));
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
 * Convenience hook for fetching food products only
 * 
 * @param {string} [searchQuery] - Search term
 * @returns {QueryOptions} React Query options for food products
 * 
 * @example
 * const { data } = useQuery(useGetUnifiedFoodProductsQuery('vitamin'));
 */
export const useGetUnifiedFoodProductsQuery = (searchQuery?: string) => {
  return useGetUnifiedProductsQuery('Food', 0, searchQuery);
};

/**
 * Convenience hook for fetching drug products only
 * 
 * @param {string} [searchQuery] - Search term
 * @returns {QueryOptions} React Query options for drug products
 * 
 * @example
 * const { data } = useQuery(useGetUnifiedDrugProductsQuery('aspirin'));
 */
export const useGetUnifiedDrugProductsQuery = (searchQuery?: string) => {
  return useGetUnifiedProductsQuery('Drugs', 0, searchQuery);
};
