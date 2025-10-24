/**
 * Error Boundary Component
 * 
 * A React error boundary that catches JavaScript errors anywhere in the
 * child component tree, logs those errors, and displays a fallback UI
 * instead of crashing the entire application.
 * 
 * Features:
 * - Catches errors in child components
 * - Custom fallback UI support
 * - Error reset functionality
 * - Optional error callback for logging/reporting
 * - Default fallback UI if none provided
 * 
 * @component
 * @example
 * <ErrorBoundary fallback={CustomErrorFallback}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
import React from 'react';

/**
 * Error boundary state interface
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Whether an error has been caught
 * @property {Error | null} error - The caught error object
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary props interface
 * @interface ErrorBoundaryProps
 * @property {React.ReactNode} children - Child components to wrap
 * @property {React.ComponentType} [fallback] - Optional custom fallback component
 * @property {Function} [onError] - Optional error callback for logging
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

/**
 * ErrorBoundary Class Component
 * 
 * Implements React's error boundary lifecycle methods to catch and handle
 * errors in the component tree.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Static lifecycle method called when an error is thrown
   * Updates state to trigger fallback UI rendering
   * 
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} New state with error information
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error is caught
   * Used for logging errors to external services
   * 
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} info - Additional error information including component stack
   * @returns {void}
   */
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, info);

    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  /**
   * Resets the error boundary state to allow retry
   * @returns {void}
   */
  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback component if provided, otherwise use default
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.resetError}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;