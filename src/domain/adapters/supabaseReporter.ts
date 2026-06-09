/**
 * Supabase Reporter Adapter
 *
 * Concrete adapter that persists ProductReport rows to the
 * `reported_products` Supabase table. Satisfies the Reporter
 * interface from the productReport domain.
 *
 * @module adapters/supabaseReporter
 */

import { supabase } from '../../db/supabaseClient';
import type { Reporter, ReportSubmissionData } from '../productReport';

export const supabaseReporter: Reporter = {
  async submitReport(data: ReportSubmissionData) {
    const { data: result, error } = await supabase
      .from('reported_products')
      .insert([{
        ...data,
        user_id: null,
        report_date: new Date().toISOString(),
      }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return result?.[0] ?? { id: '' };
  },
};
