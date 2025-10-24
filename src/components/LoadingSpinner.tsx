/**
 * Loading Spinner Component
 * 
 * A full-screen loading spinner displayed while the application or
 * lazy-loaded components are being loaded. Uses CSS animations for
 * smooth rotation effect.
 * 
 * @component
 * @returns {JSX.Element} A centered, animated loading spinner
 * 
 * @example
 * <Suspense fallback={<LoadingSpinner />}>
 *   <LazyComponent />
 * </Suspense>
 */
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" aria-hidden="true" />
    </div>
  );
};

export default LoadingSpinner;