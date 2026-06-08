/**
 * Image Verification Mutation Hook
 * 
 * React Query mutation hook for verifying product images using AI.
 * Uploads an image to the backend API which uses AI to extract product
 * information and match it against the FDA database.
 * 
 * @module usePostVerifyImage
 */

import { useMutation } from '@tanstack/react-query'
import type { VerifyImageResponse } from '../../types'

/**
 * Verifies a product image by uploading it to the AI verification API
 * 
 * The API uses computer vision and OCR to extract product information
 * from the image, then matches it against the FDA database.
 * 
 * @async
 * @param {File} file - The image file to verify (WEBP, PNG, or JPG)
 * @returns {Promise<VerifyImageResponse>} The verification result
 * @throws {Error} If the API request fails or returns an error
 * 
 * @example
 * const result = await verifyImage(imageFile);
 * console.log(result.verification_status); // "verified"
 * console.log(result.confidence); // 95
 */
const verifyImage = async (file: File): Promise<VerifyImageResponse> => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const END_POINT = "/api/v1/products/new-verify-image";

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Failed to verify image: ${res.statusText}`);
    }

    return res.json();
};

/**
 * React Query mutation hook for image verification
 * 
 * Provides mutation functions and state for uploading and verifying
 * product images. Handles loading states, errors, and success callbacks.
 * 
 * @returns {UseMutationResult} React Query mutation result object
 * @property {Function} mutate - Trigger the mutation with a File
 * @property {Function} mutateAsync - Async version that returns a Promise
 * @property {boolean} isPending - Whether the mutation is in progress
 * @property {boolean} isError - Whether the mutation failed
 * @property {boolean} isSuccess - Whether the mutation succeeded
 * @property {VerifyImageResponse | undefined} data - The mutation result data
 * @property {Error | null} error - The error if mutation failed
 * 
 * @example
 * const verifyMutation = usePostVerifyImage();
 * 
 * const handleUpload = async (file: File) => {
 *   try {
 *     const result = await verifyMutation.mutateAsync(file);
 *     console.log('Verification result:', result);
 *   } catch (error) {
 *     console.error('Verification failed:', error);
 *   }
 * };
 */
export const usePostVerifyImage = () => {
    return useMutation({
        mutationFn: verifyImage,
    });
};

