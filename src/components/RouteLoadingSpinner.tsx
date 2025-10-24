/**
 * Route Loading Spinner Component
 * 
 * A loading spinner specifically designed for route transitions.
 * Displays a smaller, centered spinner with loading text, suitable
 * for showing while lazy-loaded route components are being fetched.
 * 
 * Features:
 * - Animated spinner with blue color scheme
 * - "Loading page..." text indicator
 * - Vertical centering with padding
 * - Dark mode support
 * - Accessible ARIA attributes
 * 
 * @component
 * @returns {JSX.Element} A route loading spinner with text
 * 
 * @example
 * <Suspense fallback={<RouteLoadingSpinner />}>
 *   <LazyRoute />
 * </Suspense>
 */
const RouteLoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" aria-hidden="true" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading page...</p>
      </div>
    </div>
  );
};

export default RouteLoadingSpinner;