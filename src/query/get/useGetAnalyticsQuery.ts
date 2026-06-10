import { queryOptions } from "@tanstack/react-query";
import { analyticsDataAccess } from "../../domain/adapterRegistry";

export type { AnalyticsData } from "../../domain/analyticsDataAccess";

export const useGetAnalyticsQuery = () => {
  return queryOptions({
    queryKey: ["analytics"],
    queryFn: () => analyticsDataAccess.getAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
