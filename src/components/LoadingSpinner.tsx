const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" aria-hidden="true" />
    </div>
  );
};

export default LoadingSpinner;