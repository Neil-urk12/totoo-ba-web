/**
 * Unified Products Query Hook
 *
 * React Query hooks for fetching products from the unified_products database view.
 * Delegates to the productListing domain module for query construction.
 *
 * @module useGetUnifiedProductsQuery
 */

import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { productListing } from "../../domain/adapterRegistry";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_SORT = 'Name';

/**
 * React Query infinite query hook for unified products
 * 
 * This is the main hook for components that need infinite scroll or
 * "load more" functionality. It automatically handles pagination and
 * appends new pages to the existing data.
 * 
 * @param {string} [category] - Filter by category ('Food', 'Drugs', or 'All Categories')
 * @param {string} [searchQuery] - Search term for filtering products
 * @param {string} [sortBy='Name'] - Sort option key (changes refetch from page 0)
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
export const useGetUnifiedProductsInfiniteQuery = (category?: string, searchQuery?: string, sortBy: string = DEFAULT_SORT) => {
  return useInfiniteQuery({
    queryKey: ["unified-products-infinite", category, searchQuery, sortBy],
    queryFn: async ({ pageParam }) => await productListing.list({ category, page: pageParam, searchQuery, sortBy }),
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
    queryFn: async () => await productListing.list({ category, page, searchQuery, sortBy: 'Name' }),
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
