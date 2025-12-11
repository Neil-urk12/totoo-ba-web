import { useState, lazy, Suspense } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useGetReportsQuery, type CommunityReport } from "../query/get/useGetReportsQuery";
import { Info, ShieldAlert, User, MapPin, Building } from "lucide-react";
const PopUpCommunityReports = lazy(() => import('../components/PopUpCommunityReports'));
import CommunityReportSkeleton from '../components/CommunityReportSkeleton';

export default function CommunityReports() {
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const { data, isLoading, isError, error } = useQuery(useGetReportsQuery());

  const handleViewDetails = (report: CommunityReport) => {
    setSelectedReport(report);
  };

  const handleClosePopup = () => {
    setSelectedReport(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CommunityReportSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Info className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading reports</h3>
          <p className="mt-2 text-sm text-gray-500">
            {(error as Error)?.message || 'Failed to load community reports. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  const reports = data || [];

  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4" style={{ color: "var(--fg)" }}>
            Community Reports
          </h1>
          <p className="text-lg text-gray-600" style={{ color: "var(--muted)" }}>
            See what the community is reporting about products in the market. Help keep everyone informed and safe.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-gray-300" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900" style={{ color: "var(--fg)" }}>No reports yet</h3>
            <p className="mt-2 text-sm text-gray-500" style={{ color: "var(--muted)" }}>
              Be the first to report an issue with a product.
            </p>
            <div className="mt-6">
              <a
                href="/report"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Report a Product
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ color: "var(--fg)" }}>
                  {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
                </h2>
                <p className="text-sm text-gray-500" style={{ color: "var(--muted)" }}>
                  Showing all community reports
                </p>
              </div>
              <a
                href="/report"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Report
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}>
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/30 bg-white hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900" style={{ color: "var(--fg)" }}>
                          {report.reporter_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500" style={{ color: "var(--muted)" }}>
                          {new Date(report.report_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2" style={{ color: "var(--fg)" }}>
                      {report.product_name || 'Unnamed Product'}
                    </h3>

                    {report.brand_name && (
                      <p className="text-sm text-gray-600 mb-3" style={{ color: "var(--muted)" }}>
                        <span className="font-medium">Brand:</span> {report.brand_name}
                      </p>
                    )}

                    <p className="mb-4 text-sm text-gray-600 line-clamp-3" style={{ color: "var(--muted)" }}>
                      {report.description || 'No description provided.'}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2" style={{ color: "var(--muted)" }}>
                      {report.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          <MapPin className='w-4 h-4' />
                          {report.location}
                        </span>
                      )}

                      {report.store_name && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          <Building className='w-4 h-4' />
                          {report.store_name}
                        </span>
                      )}

                      {report.registration_number && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                          <ShieldAlert className="h-3 w-3" />
                          {report.registration_number}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-3" style={{ color: "var(--muted)" }}>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleViewDetails(report)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View details →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedReport && (
        <Suspense fallback={null}>
          <PopUpCommunityReports
            report={selectedReport}
            onClose={handleClosePopup}
          />
        </Suspense>
      )}
    </div>
  );
}
