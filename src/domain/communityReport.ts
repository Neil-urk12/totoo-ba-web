/**
 * CommunityReport Domain Module
 *
 * Owns the data access interface, type definitions, and factory for
 * listing community-submitted product reports. The write path lives
 * in productReport.ts via the Reporter adapter — this module is
 * read-only (listing/display).
 *
 * One seam sits behind it:
 * - CommunityReportAdapter: fetches reports from any source
 *
 * Adding or changing community report data sources requires editing
 * exactly one place — the adapter implementation.
 *
 * @module communityReport
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommunityReport = {
  id: string;
  product_name: string;
  brand_name: string;
  registration_number: string | null;
  description: string;
  reporter_name: string;
  location: string;
  store_name: string;
  report_date: string;
  user_id?: string | null;
};

// ---------------------------------------------------------------------------
// Adapter interface
// ---------------------------------------------------------------------------

export interface CommunityReportAdapter {
  fetchReports(): Promise<CommunityReport[]>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createCommunityReportListing(adapter: CommunityReportAdapter) {
  return {
    list: async (): Promise<CommunityReport[]> => {
      return adapter.fetchReports();
    },
  };
}
