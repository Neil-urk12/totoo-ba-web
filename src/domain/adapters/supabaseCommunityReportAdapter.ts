/**
 * Supabase Community Report Adapter
 *
 * Concrete adapter that fetches community reports from the
 * `reported_products` Supabase table. Satisfies the CommunityReportAdapter
 * interface from the communityReport domain.
 *
 * @module adapters/supabaseCommunityReportAdapter
 */

import { supabase } from '../../db/supabaseClient';
import type { CommunityReport, CommunityReportAdapter } from '../communityReport';

export const supabaseCommunityReportAdapter: CommunityReportAdapter = {
  async fetchReports(): Promise<CommunityReport[]> {
    const { data, error } = await supabase
      .from('reported_products')
      .select('*')
      .order('report_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch community reports: ${error.message}`);
    }

    return (data as CommunityReport[]) || [];
  },
};
