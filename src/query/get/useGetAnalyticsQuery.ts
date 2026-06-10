import { queryOptions } from "@tanstack/react-query";
import { createAnalyticsDataAccess } from "../../domain/analyticsDataAccess";
import { supabaseAnalyticsAdapter } from "../../domain/adapters/supabaseAnalyticsAdapter";

export type { AnalyticsData } from "../../domain/analyticsDataAccess";

const analyticsDataAccess = createAnalyticsDataAccess(supabaseAnalyticsAdapter);

export const useGetAnalyticsQuery = () => {
  return queryOptions({
    queryKey: ["analytics"],
    queryFn: () => analyticsDataAccess.getAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
