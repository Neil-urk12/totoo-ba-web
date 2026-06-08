import type { ReactNode } from 'react';
import Modal from './Modal';
import type { VerifyResponse } from '../types';
import { formatCategoryText } from '../utils/formatters';

interface ProductDetailsModalProps {
    open: boolean;
    onClose: () => void;
    data?: VerifyResponse | null;
}

export default function ProductDetailsModal({ open, onClose, data }: ProductDetailsModalProps) {
    if (!data) return null;

    const info = data.details?.product_info;

    return (
        <Modal open={open} onClose={onClose} title="Full product details" maxWidth="760px">
            <section className="rounded-xl border border-app p-3 sm:p-4 bg-app/20" aria-labelledby="product-details-title">
                <h3 id="product-details-title" className="sr-only">Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Field label="Status" value={data.is_verified ? 'Verified' : 'Not verified'} emphasize />
                    <Field label="Message" value={data.message || '—'} />
                    <Field label="Product ID" value={data.product_id || '—'} mono />
                    <Field label="Registration number" value={info?.registration_number || data.product_id || '—'} mono />
                    <Field label="Product name" value={info?.product_name ?? 'N/A'} />
                    <Field label="Category" value={formatCategoryText(info?.type)} />
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
        </Modal>
    );
}

function Field({ label, value, mono, wrap, emphasize }: { label: string; value: ReactNode; mono?: boolean; wrap?: boolean; emphasize?: boolean }) {
    return (
        <div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide opacity-70">{label}</div>
            <div className={
                `mt-1 text-sm sm:text-base ${mono ? 'font-mono text-xs sm:text-sm' : 'font-medium'} ${wrap ? 'break-words' : ''} ${emphasize ? 'text-green-700 dark:text-green-500' : ''}`
            }>
                {value}
            </div>
        </div>
    );
}
