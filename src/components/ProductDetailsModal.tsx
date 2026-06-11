import Modal from './Modal';
import DetailRow from './DetailRow';
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
                    <DetailRow label="Status" value={data.is_verified ? 'Verified' : 'Not verified'} emphasize variant="field" />
                    <DetailRow label="Message" value={data.message || '—'} variant="field" />
                    <DetailRow label="Product ID" value={data.product_id || '—'} mono variant="field" />
                    <DetailRow label="Registration number" value={info?.registration_number || data.product_id || '—'} mono variant="field" />
                    <DetailRow label="Product name" value={info?.product_name ?? 'N/A'} variant="field" />
                    <DetailRow label="Category" value={formatCategoryText(info?.type)} variant="field" />
                    <DetailRow label="Manufacturer" value={info?.company_name || '—'} variant="field" />

                    {/* Drug-specific fields */}
                    {data.details?.verified_product && (
                        <>
                            {data.details.verified_product.generic_name && (
                                <DetailRow label="Generic name" value={data.details.verified_product.generic_name} variant="field" />
                            )}
                            {data.details.verified_product.brand_name && data.details.verified_product.brand_name !== data.details.verified_product.generic_name && (
                                <DetailRow label="Brand name" value={data.details.verified_product.brand_name} variant="field" />
                            )}
                            <DetailRow label="Confidence score" value={String(data.details.confidence_score ?? '—')} variant="field" />
                            <DetailRow label="Exact match" value={data.details.exact_match ? 'Yes' : 'No'} variant="field" />
                        </>
                    )}

                    <DetailRow label="Verification method" value={data.details?.verification_method || '—'} variant="field" />
                    <DetailRow label="Total matches" value={String(data.details?.total_matches ?? '—')} variant="field" />
                    <DetailRow label="Relevance score" value={String(info?.relevance_score ?? '—')} variant="field" />
                    <DetailRow label="Registration date" value={data.registrationDate || '—'} variant="field" />
                    <DetailRow label="Expiry date" value={data.expiryDate || '—'} variant="field" />
                    <DetailRow label="Matched fields" value={Array.isArray(info?.matched_fields) && info?.matched_fields.length ? info?.matched_fields.join(', ') : '—'} mono wrap variant="field" />
                </div>
            </section>

            {info?.id && (
                <section className="rounded-xl border border-app p-3 sm:p-4 bg-app/20" aria-labelledby="identifiers-title">
                    <h3 id="identifiers-title" className="text-sm opacity-80 mb-2 sm:mb-3">Identifiers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <DetailRow label="Repository ID" value={info.id} mono variant="field" />
                    </div>
                </section>
            )}
        </Modal>
    );
}

