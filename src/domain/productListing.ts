/**
 * ProductListing Domain Module
 *
 * Owns the data access interface, params shape, validation, and factory
 * for listing FDA-registered products (unified_products view).
 *
 * Two seams sit behind it:
 * - ProductListingAdapter: fetches raw products from any source
 *
 * Adding or changing product listing data sources requires editing exactly
 * one place — the adapter implementation. Listing logic is pure and
 * testable without any database connection.
 *
 * @module productListing
 */

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------

import type { UnifiedProductsResponse } from '../types';

// ---------------------------------------------------------------------------
// Params — what the caller provides
// ---------------------------------------------------------------------------

export type ListingParams = {
  category?: string;
  page: number;
  searchQuery?: string;
  sortBy: string;
};

// ---------------------------------------------------------------------------
// Adapter interface
// ---------------------------------------------------------------------------

export interface ProductListingAdapter {
  fetchProducts(params: ListingParams): Promise<UnifiedProductsResponse>;
}

// ---------------------------------------------------------------------------
// Validation — pure function, moved from query hook
// ---------------------------------------------------------------------------

/**
 * Validates and sanitizes search query input.
 * Returns null for empty, non-string, or too-short queries.
 */
export function validateAndSanitizeSearchQuery(searchQuery?: string): string | null {
  if (!searchQuery || typeof searchQuery !== 'string') {
    return null;
  }

  const trimmed = searchQuery.trim();

  if (trimmed.length < 2) {
    return null;
  }

  return trimmed;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createProductListing(adapter: ProductListingAdapter) {
  return {
    list: async (params: ListingParams): Promise<UnifiedProductsResponse> => {
      const sanitized = validateAndSanitizeSearchQuery(params.searchQuery);

      return adapter.fetchProducts({
        ...params,
        searchQuery: sanitized ?? undefined,
      });
    },
  };
}
