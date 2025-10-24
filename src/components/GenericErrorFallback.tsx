/**
 * Generic Error Fallback Component
 * 
 * A reusable error fallback UI component used by ErrorBoundary.
 * Displays a styled error message with an icon and a retry button.
 * 
 * Features:
 * - Alert triangle icon
 * - Customizable title and message
 * - Displays actual error message if available
 * - "Try Again" button to reset error state
 * - Red color scheme for errors
 * - Accessible focus management
 * 
 * @component
 * @param {GenericErrorFallbackProps} props - Component props
 * @returns {JSX.Element} An error fallback UI
 * 
 * @example
 * <ErrorBoundary fallback={GenericErrorFallback}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Props interface for GenericErrorFallback component
 * @interface GenericErrorFallbackProps
 * @property {Error | null} error - The error object that was caught
 * @property {Function} resetError - Callback to reset the error state
 * @property {string} [title] - Optional custom error title
 * @property {string} [message] - Optional custom error message
 */
interface GenericErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  title?: string;
  message?: string;
}

const GenericErrorFallback: React.FC<GenericErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.'
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500 text-4xl" />
        </div>
        <h2 className="text-xl font-bold text-red-800 mb-2">{title}</h2>
        <p className="text-red-600 mb-4">
          {error?.message || message}
        </p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default GenericErrorFallback;