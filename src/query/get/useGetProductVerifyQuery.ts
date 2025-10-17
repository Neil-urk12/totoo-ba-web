import { queryOptions } from "@tanstack/react-query";

const ProductVerify = async (product_id: string) => {
  try {
    const BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string) || "")
      .replace('0.0.0.0', '127.0.0.1')
      .replace(/\/$/, '');
    const endpoint = `/api/v1/products/verify`;

    const res = await fetch(`${BASE_URL}${endpoint}/${encodeURIComponent(product_id)}`, { method: "GET" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch.");

    const details = data?.details ?? {};

    // Handle both regular products and drug products
    const product_info = { ...(details.product_info ?? {}), ...(details.verified_product ?? {}) };

    // For drug products, map the fields to the expected structure
    if (details.verified_product) {
      const drug = details.verified_product;
      product_info.product_name = drug.brand_name || drug.generic_name || product_info.product_name;
      product_info.company_name = drug.manufacturer || product_info.company_name;
      product_info.registration_number = drug.registration_number || product_info.registration_number;
      product_info.type = drug.type || product_info.type;
      product_info.matched_fields = drug.matched_fields || product_info.matched_fields;
      product_info.relevance_score = drug.relevance_score || product_info.relevance_score;
      product_info.id = drug.id || product_info.id;
    }

    if (!product_info?.registration_number && data?.product_id) product_info.registration_number = data.product_id;

    const total_matches = typeof details.total_matches === 'number' ? details.total_matches : details.search_results_count;
    const normalized = { ...data, details: { ...details, product_info, total_matches } };

    const info = normalized.details.product_info || {};
    const verified = normalized.is_verified === true;
    const summary = {
      verified,
      productName: info.product_name ?? null,
      registrationNumber: info.registration_number || normalized.product_id || null,
      companyName: info.company_name ?? null,
      category: info.type ?? null,
      totalMatches: typeof normalized.details.total_matches === 'number' ? normalized.details.total_matches : null,
      message: normalized.message ?? null,
    };

    const parts = [
      verified ? 'Verified' : 'Not Verified',
      info?.product_name,
      (info?.registration_number || normalized?.product_id) ? `Reg: ${info.registration_number || normalized.product_id}` : null,
      info?.company_name,
    ].filter(Boolean) as string[];

    return { ...normalized, summary, summaryText: parts.join(' • ') };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching product verification:', error.message);
      throw new Error(error.message || 'Failed to fetch product verification.');
    }
  }
}
export const useGetProductVerifyQuery = (product_id: string) => {
  return queryOptions({
    queryKey: ["verify", product_id],
    queryFn: () => ProductVerify(product_id)
  });
}
