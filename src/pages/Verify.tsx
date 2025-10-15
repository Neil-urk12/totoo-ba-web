import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useGetProductVerifyQuery } from '../query/get/useGetProductVerifyQuery'
import ProductDetailsModal from '../components/ProductDetailsModal'
import FoodIndustryVerification from '../components/FoodIndustryVerification'
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Verify() {
    const [params] = useSearchParams()
    const q = (params.get('q') || '').trim()

    const options = useGetProductVerifyQuery(q)
    const { data, isLoading, isError, error } = useQuery(options)

    const verified = data?.is_verified === true
    const info = data?.details?.product_info
    const [showDetails, setShowDetails] = useState(false)

    return (
        <div className="max-w-5xl mx-auto px-4 py-8" style={{ color: 'var(--fg)' }}>
            <div className="mb-6">
                <button
                    onClick={() => history.back()}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-app hover:border-app transition-colors text-sm opacity-90 hover:opacity-100"
                >
                    <span className="-ml-0.5"><FaArrowLeftLong /></span>
                    <span>New search</span>
                </button>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 bg-card border border-app shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verification</h1>
                        <p className="text-muted mt-1">Search: {q || '—'}</p>
                    </div>
                    {q && (
                        <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${data ? (verified ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-red-500/10 text-red-600 border-red-500/30') : 'bg-app/40 text-muted border-app'
                                }`}
                        >
                            {data ? (verified ? <label className='flex flex-row justify-center items-center gap-1.5'><FaCheck /> Verified</label> : <label className='flex flex-row justify-center items-center gap-1.5'><RxCross2 /> Not Verified</label>) : 'Pending'}
                        </div>
                    )}
                </div>

                {!q && (
                    <div className="mt-8 rounded-xl border border-dashed border-app/70 p-8 text-center">
                        <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-app/40 flex items-center justify-center"><FaSearch /></div>
                        <div className="font-semibold">No query provided</div>
                        <div className="text-sm text-muted mt-1">Use the search to verify a product.</div>
                    </div>
                )}

                {q && isLoading && (
                    <div className="mt-8 animate-pulse space-y-4">
                        <div className="h-10 rounded-lg bg-app/40" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="h-20 rounded-lg bg-app/30" />
                            <div className="h-20 rounded-lg bg-app/30" />
                            <div className="h-20 rounded-lg bg-app/30" />
                            <div className="h-20 rounded-lg bg-app/30" />
                        </div>
                    </div>
                )}

                {q && isError && (
                    <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 p-4">
                        {(error as Error)?.message || 'Something went wrong.'}
                    </div>
                )}

                {q && data && (
                    <div className="mt-8 space-y-6">
                        {/* Check if it's a food industry verification */}
                        {data.details?.verified_product?.type === 'food_industry' ? (
                            <FoodIndustryVerification data={data} />
                        ) : (
                            <>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${verified ? 'text-green-700 bg-green-500/10' : 'text-red-700 bg-red-500/10'}`}>
                                    {verified ? <label className='flex flex-row justify-center items-center gap-1.5'><FaCheck /> Verified</label> : <label className='flex flex-row justify-center items-center gap-1.5'><RxCross2 /> Not Verified</label>}
                                </div>

                                <div className="rounded-xl border border-app p-5 sm:p-6 bg-app/30">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Product name</div>
                                            <div className="mt-1 font-medium">{info?.product_name || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Category</div>
                                            <div className="mt-1 font-medium">{info?.type || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Registration number</div>
                                            <div className="mt-1 font-mono">{info?.registration_number || data?.product_id || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Manufacturer</div>
                                            <div className="mt-1 font-medium">{info?.company_name || 'N/A'}</div>
                                        </div>

                                        {/* Drug-specific fields */}
                                        {data?.details?.verified_product && (
                                            <>
                                                {data.details.verified_product.generic_name && (
                                                    <div>
                                                        <div className="text-[11px] uppercase tracking-wide opacity-70">Generic name</div>
                                                        <div className="mt-1 font-medium">{data.details.verified_product.generic_name}</div>
                                                    </div>
                                                )}
                                                {data.details.verified_product.brand_name && data.details.verified_product.brand_name !== data.details.verified_product.generic_name && (
                                                    <div>
                                                        <div className="text-[11px] uppercase tracking-wide opacity-70">Brand name</div>
                                                        <div className="mt-1 font-medium">{data.details.verified_product.brand_name}</div>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Confidence score</div>
                                                    <div className="mt-1">{data.details.confidence_score || '—'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Exact match</div>
                                                    <div className="mt-1">{data.details.exact_match ? 'Yes' : 'No'}</div>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Registration date</div>
                                            <div className="mt-1">{data?.registrationDate || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Expiry date</div>
                                            <div className="mt-1">{data?.expiryDate || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Message</div>
                                            <div className="mt-1">{data?.message || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Verification method</div>
                                            <div className="mt-1">{data?.details?.verification_method || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Total matches</div>
                                            <div className="mt-1">{data?.details?.total_matches ?? '—'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Relevance score</div>
                                            <div className="mt-1">{info?.relevance_score ?? '—'}</div>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="text-[11px] uppercase tracking-wide opacity-70">Matched fields</div>
                                            <div className="mt-1 font-mono text-sm break-words">{Array.isArray(info?.matched_fields) && info?.matched_fields.length > 0 ? info?.matched_fields.join(', ') : '—'}</div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowDetails(true)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-semibold h-11 px-4 border border-app/70 hover:border-app transition-colors btn-invert"
                                        >
                                            View full product details
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <ProductDetailsModal open={showDetails} onClose={() => setShowDetails(false)} data={data} />
        </div>
    )
}


