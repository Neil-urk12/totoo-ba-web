import type { FoodProduct, DrugProduct, VerifyResponse } from '../types';
import { verifyProduct } from './verifyProduct';

export interface ProductVerificationAdapter {
  findExactRegistrationNumber(
    table: 'food_products' | 'drug_products',
    query: string
  ): Promise<FoodProduct | DrugProduct | null>;
  fullTextSearch(
    table: 'food_products' | 'drug_products',
    query: string,
    limit: number
  ): Promise<(FoodProduct | DrugProduct)[]>;
}

const tablesForCategory = (category?: string): readonly ('food_products' | 'drug_products')[] => {
  const c = (category || '').toLowerCase();
  if (c === 'food') return ['food_products'] as const;
  if (c === 'drugs' || c === 'drug' || c === 'pharmaceutical') return ['drug_products'] as const;
  return ['food_products', 'drug_products'] as const;
};

export const createProductVerification = (adapter: ProductVerificationAdapter) => ({
  verify: async (query: string, category?: string): Promise<VerifyResponse> => {
    const q = (query || '').trim();
    if (!q) throw new Error('Empty query');

    const tables = tablesForCategory(category);
    const hasFood = tables.length === 2 || tables[0] === 'food_products';
    const hasDrug = tables.length === 2 || tables[0] === 'drug_products';

    const [exactFood, exactDrug] = await Promise.all([
      hasFood ? adapter.findExactRegistrationNumber('food_products', q) as Promise<FoodProduct | null> : Promise.resolve(null),
      hasDrug ? adapter.findExactRegistrationNumber('drug_products', q) as Promise<DrugProduct | null> : Promise.resolve(null),
    ]);

    let foodMatches: FoodProduct[] = [];
    let drugMatches: DrugProduct[] = [];

    if (tables.length === 2) {
      const [foodRes, drugRes] = await Promise.allSettled([
        adapter.fullTextSearch('food_products', q, 10),
        adapter.fullTextSearch('drug_products', q, 10),
      ]);

      foodMatches = foodRes.status === 'fulfilled' ? foodRes.value as FoodProduct[] : [];
      drugMatches = drugRes.status === 'fulfilled' ? drugRes.value as DrugProduct[] : [];

      if (foodRes.status === 'rejected' && drugRes.status === 'rejected' && !exactFood && !exactDrug) {
        throw (foodRes.reason ?? drugRes.reason);
      }
    } else if (tables[0] === 'food_products') {
      foodMatches = await adapter.fullTextSearch('food_products', q, 10) as FoodProduct[];
    } else if (tables[0] === 'drug_products') {
      drugMatches = await adapter.fullTextSearch('drug_products', q, 10) as DrugProduct[];
    }

    if (tables.length === 1) {
      const chosen = tables[0];
      const noFoodAlts = chosen === 'food_products' && foodMatches.length <= 1;
      const noDrugAlts = chosen === 'drug_products' && drugMatches.length <= 1;
      if (noFoodAlts) {
        try { drugMatches = await adapter.fullTextSearch('drug_products', q, 10) as DrugProduct[]; } catch (err) { console.error(err); }
      } else if (noDrugAlts) {
        try { foodMatches = await adapter.fullTextSearch('food_products', q, 10) as FoodProduct[]; } catch (err) { console.error(err); }
      }
    }

    return verifyProduct({ exactFood, exactDrug, foodMatches, drugMatches });
  },
});
