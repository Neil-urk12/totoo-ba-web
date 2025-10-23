import { useMutation } from "@tanstack/react-query";

type VerifyImageResponse = {
  verification_status: string;
  confidence: number;
  matched_product: {
    id: string;
    relevance_score: number;
    matched_fields: string[];
    type: string;
    registration_number: string;
    product_name: string;
    company_name: string;
  };
  extracted_fields: {
    registration_number: string | null;
    brand_name: string;
    product_description: string;
    manufacturer: string | null;
    expiry_date: string | null;
    batch_number: string | null;
    net_weight: string;
  };
  ai_reasoning: string;
  alternative_matches: Array<{
    id: string;
    relevance_score: number;
    matched_fields: string[];
    type: string;
    registration_number: string;
    product_name: string;
    company_name: string;
  }>;
};

const verifyImage = async (file: File): Promise<VerifyImageResponse> => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VERSION = "v1";
  const END_POINT = `/api/${VERSION}/products/new-verify-image`;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}${END_POINT}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Failed to verify image: ${res.statusText}`);
  }

  return res.json();
};

export const usePostVerifyImage = () => {
  return useMutation({
    mutationKey: ["new-verify-image"],
    mutationFn: verifyImage,
  });
};
