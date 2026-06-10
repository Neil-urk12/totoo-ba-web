import { queryOptions } from "@tanstack/react-query";
import { productVerification } from "../../domain/adapterRegistry";

export const useGetProductVerifyQuery = (product_id: string, category?: string) => {
  return queryOptions({
    queryKey: ["verify", product_id, category ?? 'all'],
    queryFn: () => productVerification.verify(product_id, category),
  });
};
