export type UnifiedProduct = {
  id: string;
  registration_number: string;
  name: string | null;
  manufacturer: string | null;
  brand_name?: string | null;
  generic_name?: string | null;
  category: string | null;
  issuance_date: string | null;
  expiry_date: string | null;
  search_vector: string | null;
  source_table: 'food' | 'drug';
  source_category: 'Food' | 'Drugs';
}

export type UnifiedProductsResponse = {
  data: UnifiedProduct[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export type FoodProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  company_name?: string | null;
  product_name?: string | null;
  type_of_product?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
  search_vector?: string | null;
}

export type DrugProduct = {
  id?: string;
  registration_number: string;
  brand_name?: string | null;
  generic_name?: string | null;
  manufacturer?: string | null;
  issuance_date?: string | null;
  expiry_date?: string | null;
  search_vector?: string | null;
}

export type Product = FoodProduct | DrugProduct;