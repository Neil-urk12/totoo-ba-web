/**
 * ImageVerification Domain Module
 *
 * Owns the data access interface and factory for verifying product
 * images via AI. The API uses computer vision and OCR to extract
 * product information from an image, then matches it against the
 * FDA database.
 *
 * Two seams sit behind it:
 * - ImageVerificationAdapter: calls the external verification API
 *
 * Adding or changing the image verification backend requires editing
 * exactly one place — the adapter implementation.
 *
 * @module imageVerification
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VerifyImageResponse = {
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

// ---------------------------------------------------------------------------
// Adapter interface
// ---------------------------------------------------------------------------

export interface ImageVerificationAdapter {
  verifyImage(file: File): Promise<VerifyImageResponse>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createImageVerification(adapter: ImageVerificationAdapter) {
  return {
    verify: async (file: File): Promise<VerifyImageResponse> => {
      return adapter.verifyImage(file);
    },
  };
}
