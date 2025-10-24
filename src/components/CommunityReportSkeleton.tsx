export default function CommunityReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="animate-pulse h-10 bg-gray-200 rounded-md w-32"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/30 bg-white hover:shadow-lg transition-all duration-300"
            style={{ backgroundColor: "var(--bg)" }}
          >
            <div className="flex-1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-pulse h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
                  <div className="animate-pulse h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="animate-pulse h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="animate-pulse h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="animate-pulse h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3" style={{ backgroundColor: "var(--bg)" }}>
              <div className="flex justify-end">
                <div className="animate-pulse h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
