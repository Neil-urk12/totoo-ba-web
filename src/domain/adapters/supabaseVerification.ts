import { supabase } from '../../db/supabaseClient';
import type { FoodProduct, DrugProduct } from '../../types';
import type { ProductVerificationAdapter } from '../productVerification';

const sanitizeForFts = (query: string): string =>
  query
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const supabaseVerificationAdapter: ProductVerificationAdapter = {
  async findExactRegistrationNumber(table, query) {
    const { data } = await supabase
      .from(table)
      .select('*')
      .eq('registration_number', query)
      .limit(1)
      .maybeSingle();
    return data ?? null;
  },

  async fullTextSearch(table, query, limit) {
    const sanitized = sanitizeForFts(query);
    if (!sanitized) return [];

    const first = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .textSearch('search_vector', sanitized, { type: 'websearch', config: 'english' })
      .limit(limit);

    if (first.error) {
      console.error(`Websearch error on ${table}:`, first.error);

      const alt = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .textSearch('search_vector', sanitized, { type: 'plain', config: 'english' })
        .limit(limit);

      if (alt.error) {
        console.error(`Plain search error on ${table}:`, alt.error);
        throw new Error(`FTS failed on ${table}: ${alt.error.message}`);
      }

      return (alt.data as FoodProduct[] | DrugProduct[]) || [];
    }

    return (first.data as FoodProduct[] | DrugProduct[]) || [];
  },
};
