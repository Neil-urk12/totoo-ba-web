/**
 * Image Verification Mutation Hook
 * 
 * React Query mutation hook for verifying product images using AI.
 * Delegates to the imageVerification domain module for the actual
 * API call through an adapter seam.
 * 
 * @module usePostVerifyImage
 */

import { useMutation } from '@tanstack/react-query'
import { imageVerification } from '../../domain/adapterRegistry'

// Re-export the domain type for consumers
export type { VerifyImageResponse } from '../../domain/imageVerification'

/**
 * React Query mutation hook for image verification
 * 
 * Provides mutation functions and state for uploading and verifying
 * product images. Handles loading states, errors, and success callbacks.
 * 
 * @returns {UseMutationResult} React Query mutation result object
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
        mutationFn: imageVerification.verify,
    });
};
