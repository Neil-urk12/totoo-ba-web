import { queryOptions } from "@tanstack/react-query";
import { communityReportListing } from "../../domain/adapterRegistry";

// Re-export the domain type for consumers
export type { CommunityReport } from "../../domain/communityReport";

export const useGetReportsQuery = () => {
  return queryOptions({
    queryKey: ["reports"],
    queryFn: () => communityReportListing.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
