import { X } from 'lucide-react';
import type { CommunityReport } from '../query/get/useGetReportsQuery';

interface PopUpCommunityReportsProps {
  report: CommunityReport;
  onClose: () => void;
}

export default function PopUpCommunityReports({ report, onClose }: PopUpCommunityReportsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {report.product_name || 'Product Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Brand</h3>
              <p className="mt-1 text-gray-900">{report.brand_name || 'Not specified'}</p>
            </div>
            
            {report.registration_number && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
                <p className="mt-1 text-gray-900">{report.registration_number}</p>
              </div>
            )}

            {report.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-gray-900">{report.location}</p>
              </div>
            )}

            {report.store_name && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Store</h3>
                <p className="mt-1 text-gray-900">{report.store_name}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
              <p className="mt-1 text-gray-900">{report.reporter_name || 'Anonymous'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Report Date</h3>
              <p className="mt-1 text-gray-900">
                {new Date(report.report_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-line">
              {report.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
