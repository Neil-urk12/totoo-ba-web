import { queryOptions } from "@tanstack/react-query";
import { createCommunityReportListing } from "../../domain/communityReport";
import { supabaseCommunityReportAdapter } from "../../domain/adapters/supabaseCommunityReportAdapter";

// Re-export the domain type for consumers
export type { CommunityReport } from "../../domain/communityReport";

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

const communityReportListing = createCommunityReportListing(supabaseCommunityReportAdapter);

export const useGetReportsQuery = () => {
  return queryOptions({
    queryKey: ["reports"],
    queryFn: () => communityReportListing.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
