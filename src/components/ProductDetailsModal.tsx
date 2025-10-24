import React from 'react'
import type { VerifyResponse } from '../query/get/useGetProductVerifyQuery'

interface ProductDetailsModalProps {
    open: boolean
    onClose: () => void
    data?: VerifyResponse | null
}

export default function ProductDetailsModal({ open, onClose, data }: ProductDetailsModalProps) {
    if (!open || !data) return null

    const info = data.details?.product_info

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-[90vw] sm:w-[760px] max-h-[90vh] sm:max-h-[85vh]">
                <div className="m-0 sm:m-0 rounded-t-2xl sm:rounded-2xl border border-app bg-card shadow-xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]" role="document">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-app shrink-0">
                        <h2 id="modal-title" className="font-semibold text-base sm:text-lg">Full product details</h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="h-8 px-3 rounded-md border border-app hover:border-app text-sm transition-colors"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden space-y-4 sm:space-y-6 flex-1">
                        <section className="rounded-xl border border-app p-3 sm:p-4 bg-app/20" aria-labelledby="product-details-title">
                            <h3 id="product-details-title" className="sr-only">Product Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Field label="Status" value={data.is_verified ? 'Verified' : 'Not verified'} emphasize={true} />
                                <Field label="Message" value={data.message || '—'} />
                                <Field label="Product ID" value={data.product_id || '—'} mono />
                                <Field label="Registration number" value={info?.registration_number || data.product_id || '—'} mono />
                                <Field label="Product name" value={info?.product_name ?? 'N/A'} />
                                <Field label="Category" value={info?.type || '—'} />
                                <Field label="Manufacturer" value={info?.company_name || '—'} />

                                {/* Drug-specific fields */}
                                {data.details?.verified_product && (
                                    <>
                                        {data.details.verified_product.generic_name && (
                                            <Field label="Generic name" value={data.details.verified_product.generic_name} />
                                        )}
                                        {data.details.verified_product.brand_name && data.details.verified_product.brand_name !== data.details.verified_product.generic_name && (
                                            <Field label="Brand name" value={data.details.verified_product.brand_name} />
                                        )}
                                        <Field label="Confidence score" value={String(data.details.confidence_score ?? '—')} />
                                        <Field label="Exact match" value={data.details.exact_match ? 'Yes' : 'No'} />
                                    </>
                                )}

                                <Field label="Verification method" value={data.details?.verification_method || '—'} />
                                <Field label="Total matches" value={String(data.details?.total_matches ?? '—')} />
                                <Field label="Relevance score" value={String(info?.relevance_score ?? '—')} />
                                <Field label="Registration date" value={data.registrationDate || '—'} />
                                <Field label="Expiry date" value={data.expiryDate || '—'} />
                                <Field label="Matched fields" value={Array.isArray(info?.matched_fields) && info?.matched_fields.length ? info?.matched_fields.join(', ') : '—'} mono wrap />
                            </div>
                        </section>

                        {info?.id && (
                            <section className="rounded-xl border border-app p-3 sm:p-4 bg-app/20" aria-labelledby="identifiers-title">
                                <h3 id="identifiers-title" className="text-sm opacity-80 mb-2 sm:mb-3">Identifiers</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <Field label="Repository ID" value={info.id} mono />
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Field({ label, value, mono, wrap, emphasize }: { label: string, value: React.ReactNode, mono?: boolean, wrap?: boolean, emphasize?: boolean }) {
    return (
        <div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide opacity-70">{label}</div>
            <div className={
                `mt-1 text-sm sm:text-base ${mono ? 'font-mono text-xs sm:text-sm' : 'font-medium'} ${wrap ? 'break-words' : ''} ${emphasize ? 'text-green-700 dark:text-green-500' : ''}`
            }>
                {value}
            </div>
        </div>
    )
}

