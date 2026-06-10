/**
 * ImageVerification Domain Module
 *
 * Owns file validation, response normalization, error classification,
 * and the factory for verifying product images via AI. The API uses
 * computer vision and OCR to extract product information from an image,
 * then matches it against the FDA database.
 *
 * Two seams sit behind it:
 * - ImageVerificationAdapter: calls the external verification API
 *
 * Adding or changing the image verification backend requires editing
 * exactly one place — the adapter implementation. Validation, normalization,
 * and error classification live here so every consumer gets them for free.
 *
 * @module imageVerification
 */

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------

import { DomainError } from './domainError';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Discriminated union for verification status — replaces opaque string */
export type VerificationStatus =
  | 'verified'
  | 'uncertain'
  | 'not_found'
  | 'error';

/** Allowed image MIME types */
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

/** Maximum file size in bytes (10 MB) */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export type VerifyImageResponse = {
  verification_status: VerificationStatus;
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

/**
 * Raw response from the adapter — verification_status is an opaque string
 * that gets normalized by the domain module.
 */
export type RawVerifyImageResponse = Omit<VerifyImageResponse, 'verification_status'> & {
  verification_status: string;
};

export interface ImageVerificationAdapter {
  verifyImage(file: File): Promise<RawVerifyImageResponse>;
}

// ---------------------------------------------------------------------------
// File validation — pure, testable
// ---------------------------------------------------------------------------

/**
 * Validates that the file is an acceptable image for verification.
 * Throws DomainError('permanent') on invalid input.
 */
export function validateImageFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new DomainError(
      'permanent',
      `Unsupported file type: ${file.type || 'unknown'}. Accepted formats: PNG, JPEG, WebP.`,
      { context: { fileName: file.name, mimeType: file.type } },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new DomainError(
      'permanent',
      `File too large: ${sizeMB} MB. Maximum allowed size is 10 MB.`,
      { context: { fileName: file.name, fileSizeBytes: file.size } },
    );
  }
}

// ---------------------------------------------------------------------------
// Response normalization — pure, testable
// ---------------------------------------------------------------------------

/** Map opaque API string to our discriminated union */
const STATUS_MAP: Record<string, VerificationStatus> = {
  verified: 'verified',
  uncertain: 'uncertain',
  not_verified: 'not_found',
  not_found: 'not_found',
  error: 'error',
};

/**
 * Normalizes the raw API response into the domain shape.
 * Unknown status strings map to 'error' rather than silently passing through.
 */
export function normalizeVerificationResponse(
  raw: RawVerifyImageResponse,
): VerifyImageResponse {
  return {
    ...raw,
    verification_status: STATUS_MAP[raw.verification_status] ?? 'error',
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createImageVerification(adapter: ImageVerificationAdapter) {
  return {
    verify: async (file: File): Promise<VerifyImageResponse> => {
      // 1. Validate input
      validateImageFile(file);

      // 2. Call adapter
      let raw: RawVerifyImageResponse;
      try {
        raw = await adapter.verifyImage(file);
      } catch (err) {
        // Re-throw DomainError as-is (adapter already classified it)
        if (err instanceof DomainError) throw err;

        // Classify unknown errors as transient (likely network)
        throw new DomainError(
          'transient',
          'Image verification request failed. Please check your connection and try again.',
          { cause: err },
        );
      }

      // 3. Normalize response
      return normalizeVerificationResponse(raw);
    },
  };
}
