import { queryOptions } from "@tanstack/react-query";
import { createProductVerification } from "../../domain/productVerification";
import { supabaseVerificationAdapter } from "../../domain/adapters/supabaseVerification";

const productVerification = createProductVerification(supabaseVerificationAdapter);

export const useGetProductVerifyQuery = (product_id: string, category?: string) => {
  return queryOptions({
    queryKey: ["verify", product_id, category ?? 'all'],
    queryFn: () => productVerification.verify(product_id, category),
  });
};
