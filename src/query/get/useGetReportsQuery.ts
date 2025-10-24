import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../db/supabaseClient";

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

const fetchReports = async (): Promise<CommunityReport[]> => {
  const { data, error } = await supabase
    .from("reported_products")
    .select("*")
    .order("report_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch community reports: ${error.message}`);
  }

  return (data as CommunityReport[]) || [];
};

export const useGetReportsQuery = () => {
  return queryOptions({
    queryKey: ["reports"],
    queryFn: fetchReports,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
