/**
 * API Image Verification Adapter
 *
 * Concrete adapter that calls the external AI verification API.
 * Satisfies the ImageVerificationAdapter interface from the
 * imageVerification domain.
 *
 * Owns all API-specific logic: request construction, form data
 * assembly, error handling, and response parsing.
 *
 * @module adapters/apiImageVerification
 */

import type { ImageVerificationAdapter, VerifyImageResponse } from '../imageVerification';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT = '/api/v1/products/new-verify-image';

export const apiImageVerificationAdapter: ImageVerificationAdapter = {
  async verifyImage(file: File): Promise<VerifyImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to verify image: ${res.statusText}`);
    }

    return res.json();
  },
};
