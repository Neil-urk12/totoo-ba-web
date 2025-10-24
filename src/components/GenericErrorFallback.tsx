import React from 'react';
import { AlertTriangle } from 'lucide-react';

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