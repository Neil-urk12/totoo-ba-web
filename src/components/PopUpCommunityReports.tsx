import { X, Package, User, Calendar, MapPin, Store, AlertCircle } from 'lucide-react';
import type { CommunityReport } from '../query/get/useGetReportsQuery';

interface PopUpCommunityReportsProps {
  report: CommunityReport;
  onClose: () => void;
}

export default function PopUpCommunityReports({ report, onClose }: PopUpCommunityReportsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200/20 dark:border-gray-700/50 transition-all duration-300 transform hover:scale-[1.005]" style={{backgroundColor: "var(--bg)"}}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{backgroundColor: "var(--bg)"}}>
          <div className="flex items-center gap-3" style={{color: "var(--fg)"}}>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{color: "var(--fg)"}}>
                {report.product_name || 'Product Details'}
              </h2>
              {report.brand_name && (
                <p className="text-sm text-gray-500" style={{color: "var(--muted)"}}>{report.brand_name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar" style={{backgroundColor: "var(--bg)", color: "var(--fg)"}}>
          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400" style={{color: "var(--muted)"}}>
              <AlertCircle className="w-4 h-4" />
              <span>Report Details</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-900" style={{backgroundColor: "var(--card)", color: "var(--fg)"}}>
              <p className="text-gray-700" style={{color: "var(--fg)"}}>
                {report.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Information */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={{color: "var(--muted)"}}>
                  Product Information
                </h3>
                <div className="space-y-4 pt-2">
                  {report.brand_name && (
                    <div>
                      <p className="text-xs text-gray-500" style={{color: "var(--muted)"}}>Brand</p>
                      <p className="text-sm font-medium text-gray-900" style={{color: "var(--fg)"}}>{report.brand_name}</p>
                    </div>
                  )}
                  {report.registration_number && (
                    <div>
                      <p className="text-xs text-gray-500" style={{color: "var(--muted)"}}>Registration Number</p>
                      <p className="text-sm font-mono text-blue-600" style={{color: "var(--fg)"}}>
                        {report.registration_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              {(report.location || report.store_name) && (
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </h3>
                  <div className="space-y-4 pt-2">
                    {report.location && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900" style={{color: "var(--fg)"}}>{report.location}</p>
                        </div>
                      </div>
                    )}
                    {report.store_name && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-gray-400">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900" style={{color: "var(--fg)"}}>{report.store_name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Report Information */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={{color: "var(--muted)"}}>
                  Report Information
                </h3>
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500" style={{color: "var(--muted)"}}>Reported By</p>
                      <p className="text-sm font-medium text-gray-900" style={{color: "var(--fg)"}}>
                        {report.reporter_name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500" style={{color: "var(--muted)"}}>Reported On</p>
                      <p className="text-sm font-medium text-gray-900" style={{color: "var(--fg)"}}>
                        {formatDate(report.report_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3" style={{backgroundColor: "var(--bg)", color: "var(--fg)"}}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Global styles for scrollbar */}
      {/* <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style> */}
    </div>
  );
}
