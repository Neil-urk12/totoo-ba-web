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

import { DomainError } from '../domainError';
import type { ImageVerificationAdapter, RawVerifyImageResponse } from '../imageVerification';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const END_POINT = '/api/v1/products/new-verify-image';

export const apiImageVerificationAdapter: ImageVerificationAdapter = {
  async verifyImage(file: File): Promise<RawVerifyImageResponse> {
    const formData = new FormData();
    formData.append('image', file);

    let res: Response;
    try {
      res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      throw new DomainError(
        'transient',
        'Network request failed. Please check your connection.',
        { cause: err, context: { cause: String(err) } },
      );
    }

    if (!res.ok) {
      if (res.status === 404) {
        throw new DomainError('not_found', `Product not found: ${res.statusText}`);
      }
      if (res.status >= 500) {
        throw new DomainError('transient', `Server error: ${res.statusText}`);
      }
      throw new DomainError('permanent', `Verification failed: ${res.statusText}`);
    }

    return res.json();
  },
};
