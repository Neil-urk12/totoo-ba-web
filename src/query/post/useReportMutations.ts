import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../db/supabaseClient';


type ReportData = {
  product_name: string;
  brand_name: string;
  registration_number: string | null;
  description: string;
  reporter_name: string;
  location: string;
  store_name: string;
};

export const useReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportData: ReportData) => {
      const { data, error } = await supabase
        .from('reported_products')
        .insert([{
          ...reportData,
          user_id: null, // This can be updated later if you add authentication
          report_date: new Date().toISOString()
        }])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch any queries that depend on reports data
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
