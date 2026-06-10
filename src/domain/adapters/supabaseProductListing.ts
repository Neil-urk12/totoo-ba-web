/**
 * Supabase Product Listing Adapter
 *
 * Concrete adapter that fetches products from the unified_products view.
 * Satisfies the ProductListingAdapter interface from the productListing domain.
 *
 * Owns all Supabase-specific logic: query construction, conditional filters,
 * full-text search, pagination, sorting, and response shape normalization.
 *
 * @module adapters/supabaseProductListing
 */

import { supabase } from '../../db/supabaseClient';
import { getSourceCategory } from '../categoryRegistry';
import type { UnifiedProduct, UnifiedProductsResponse } from '../../types';
import type { ListingParams, ProductListingAdapter } from '../productListing';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 30;

const SORT_COLUMNS: Record<string, { column: string; ascending: boolean }> = {
  'Name': { column: 'name', ascending: true },
  'Registration Date': { column: 'issuance_date', ascending: false },
  'Expiry Date': { column: 'expiry_date', ascending: true },
  'Manufacturer': { column: 'manufacturer', ascending: true },
};

const DEFAULT_SORT = 'Name';

// ---------------------------------------------------------------------------
// Adapter implementation
// ---------------------------------------------------------------------------

export const supabaseProductListingAdapter: ProductListingAdapter = {
  async fetchProducts(params: ListingParams): Promise<UnifiedProductsResponse> {
    const { category, page, searchQuery, sortBy } = params;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE - 1;

    const sortConfig = SORT_COLUMNS[sortBy] ?? SORT_COLUMNS[DEFAULT_SORT];

    // Build query
    let query = supabase
      .from('unified_products')
      .select('*', { count: 'exact' })
      .order(sortConfig.column, { ascending: sortConfig.ascending });

    // Apply category filter
    const sourceCategory = getSourceCategory(category ?? '');
    if (sourceCategory) {
      query = query.eq('source_category', sourceCategory);
    }

    // Apply full-text search
    if (searchQuery) {
      query = query.textSearch('search_vector', searchQuery, {
        type: 'websearch',
        config: 'english',
      });
    }

    // Execute with pagination
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
  },
};
