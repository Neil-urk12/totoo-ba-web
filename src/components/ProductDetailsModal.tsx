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
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[760px] max-h-[85vh]">
                <div className="m-0 sm:m-0 rounded-t-2xl sm:rounded-2xl border border-app bg-card shadow-xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-app">
                        <div className="font-semibold">Full product details</div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="h-8 px-3 rounded-md border border-app hover:border-app text-sm"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 overflow-auto space-y-6">
                        <section className="rounded-xl border border-app p-4 bg-app/20">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <section className="rounded-xl border border-app p-4 bg-app/20">
                                <div className="text-sm opacity-80 mb-3">Identifiers</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="text-[11px] uppercase tracking-wide opacity-70">{label}</div>
            <div className={
                `mt-1 ${mono ? 'font-mono' : 'font-medium'} ${wrap ? 'break-words' : ''} ${emphasize ? 'text-green-700' : ''}`
            }>
                {value}
            </div>
        </div>
    )
}

