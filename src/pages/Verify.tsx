import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useGetProductVerifyQuery, type VerifyResponse } from '../query/get/useGetProductVerifyQuery'
import ProductDetailsModal from '../components/ProductDetailsModal'
import FoodIndustryVerification from '../components/FoodIndustryVerification'
import ImageVerificationResult from '../components/ImageVerificationResult'
import AlternativeProductCard from '../components/AlternativeProductCard'
import { Search, Check, X, ArrowLeft } from "lucide-react";
import ErrorBoundary from '../components/ErrorBoundary';
import GenericErrorFallback from '../components/GenericErrorFallback';
import { formatCategoryText } from '../utils/formatters';

export default function Verify() {
    const [params] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const q = (params.get('q') || '').trim()
    const category = (params.get('category') || '').trim() || undefined
    const imageVerificationResult = location.state?.imageVerificationResult

    const options = useGetProductVerifyQuery(q, category)
    const { data, isLoading, isError, error, isFetching } = useQuery({
        ...options,
        enabled: !!q && !imageVerificationResult
    })

    const verified = data?.is_verified === true
    const info = data?.details?.product_info
    const [showDetails, setShowDetails] = useState(false)

    return (
        <div className="max-w-7xl mx-auto px-4 py-8" style={{ color: 'var(--fg)' }}>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-app hover:border-app transition-colors text-sm opacity-90 hover:opacity-100"
                >
                    <span className="-ml-0.5"><ArrowLeft /></span>
                    <span>New search</span>
                </button>
            </div>

            <div className="rounded-2xl p-6 sm:p-7 bg-card border border-app shadow-sm">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verification</h1>
                    <p className="text-muted mt-1">
                        {imageVerificationResult ? 'Image Analysis' : `Search: ${q || '—'}`}
                    </p>
                </div>

                {!q && !imageVerificationResult && (
                    <div className="mt-6 rounded-xl border border-dashed border-app/70 p-8 text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-app/40 flex items-center justify-center"><Search /></div>
                        <div className="font-semibold">No query provided</div>
                        <div className="text-sm text-muted mt-1">Use the search to verify a product.</div>
                    </div>
                )}

                {imageVerificationResult && (
                    <div className="mt-6">
                        <ErrorBoundary fallback={GenericErrorFallback}>
                            <ImageVerificationResult data={imageVerificationResult} />
                        </ErrorBoundary>
                    </div>
                )}

                {q && !imageVerificationResult && (isLoading || isFetching) && (
                    <div className="mt-6 flex flex-col justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/30 border-t-gray-600"></div>
                    </div>
                )}

                {q && !imageVerificationResult && isError && (
                    <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 p-4">
                        {(error as Error)?.message || 'Something went wrong.'}
                    </div>
                )}

                {q && !imageVerificationResult && data && data.message && data.message.includes("not found in FDA database") && (
                    <div className="mt-6">
                        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-8 text-center">
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <X className="text-2xl text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-orange-700 mb-2">Product Not Found</h3>
                            <p className="text-orange-600 mb-4">
                                {data.message}
                            </p>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left">
                                <h4 className="font-semibold text-orange-800 mb-2">Suggestions:</h4>
                                <ul className="text-sm text-orange-700 space-y-1">
                                    {data.details?.suggestions?.map((suggestion: string, index: number) => (
                                        <li key={index}>• {suggestion}</li>
                                    ))}
                                </ul>
                                <div className="mt-3 pt-3 border-t border-orange-200">
                                    <div className="text-xs text-orange-600">
                                        <strong>Search Results:</strong> {data.details?.search_results_count || 0} matches found
                                    </div>
                                    <div className="text-xs text-orange-600">
                                        <strong>Verification Method:</strong> {data.details?.verification_method || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {q && !imageVerificationResult && data && (!data.message || !data.message.includes("not found in FDA database")) && (
                    <div className="mt-6">
                        {/* Check if it's a food industry verification */}
                        {data.details?.verified_product?.type === 'food_industry' ? (
                            <ErrorBoundary fallback={GenericErrorFallback}>
                                <FoodIndustryVerification data={data} />
                            </ErrorBoundary>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {/* Left Column - Main Result */}
                                <div className="lg:col-span-2">
                                    <div className="rounded-xl border border-app bg-app/30 p-6 h-full flex flex-col">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold mb-6 self-start ${verified ? 'text-green-700 bg-green-500/10' : 'text-red-700 bg-red-500/10'}`}>
                                            {verified ? <label className='flex flex-row justify-center items-center gap-1.5'><Check /> Verified</label> : <label className='flex flex-row justify-center items-center gap-1.5'><X /> Not Verified</label>}
                                        </div>

                                        <div className="space-y-5 flex-1">
                                            <div>
                                                <div className="text-[11px] uppercase tracking-wide opacity-70">Product name</div>
                                                <div className="mt-1 font-semibold text-lg">{info?.product_name || 'N/A'}</div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Category</div>
                                                    <div className="mt-1 font-medium">{formatCategoryText(info?.type)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Registration number</div>
                                                    <div className="mt-1 font-mono text-sm">{info?.registration_number || data?.product_id || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Manufacturer</div>
                                                    <div className="mt-1 font-medium">{info?.company_name || 'N/A'}</div>
                                                </div>
                                                
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Verification method</div>
                                                    <div className="mt-1 text-sm">{data?.details?.verification_method || '—'}</div>
                                                </div>
                                                
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Message</div>
                                                    <div className="mt-1 text-sm">{data?.message || '—'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-app">
                                            <button
                                                type="button"
                                                onClick={() => setShowDetails(true)}
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-semibold h-11 px-4 border border-app/70 hover:border-app transition-colors btn-invert"
                                            >
                                                View full product details
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Alternative Matches */}
                                <div className="lg:col-span-3">
                                    {Array.isArray(data.details?.alternative_matches) && data.details.alternative_matches.length > 0 ? (
                                        <div className="h-full">
                                            <h3 className="text-lg font-semibold mb-4">Alternative Products</h3>
                                            {/* Mobile: Horizontal scrolling, Desktop: Grid layout */}
                                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-x-visible lg:snap-none lg:auto-rows-fr">
                                                {(data.details.alternative_matches as NonNullable<VerifyResponse['details']['alternative_matches']>).map((alt, idx: number) => (
                                                    <ErrorBoundary key={idx} fallback={GenericErrorFallback}>
                                                        <div className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start lg:w-auto">
                                                            <AlternativeProductCard product={alt} />
                                                        </div>
                                                    </ErrorBoundary>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center rounded-xl border border-dashed border-app/70 bg-app/20 p-8">
                                            <div className="text-center">
                                                <div className="text-sm text-muted">No alternative products found</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <ProductDetailsModal open={showDetails} onClose={() => setShowDetails(false)} data={data} />
        </div>
    )
}


