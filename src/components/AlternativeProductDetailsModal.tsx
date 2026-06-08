import Modal from "./Modal";
import { formatCategoryText } from "../utils/formatters";

interface AlternativeProductDetailsModalProps {
    open: boolean;
    onClose: () => void;
    product: {
        product_name: string;
        type?: string;
        company_name: string;
        registration_number: string;
        relevance_score?: number | null;
        brand_name?: string | null;
        issuance_date?: string | null;
        expiry_date?: string | null;
    } | null;
}

export default function AlternativeProductDetailsModal({ open, onClose, product }: AlternativeProductDetailsModalProps) {
    if (!product) return null;

    return (
        <Modal open={open} onClose={onClose} title="Alternative Product Details">
            <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 break-words">{product.product_name}</h3>
                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-app/70 bg-app/40">
                        <span>{formatCategoryText(product.type)}</span>
                    </div>
                    {typeof product.relevance_score === 'number' && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            <span>{Math.round(product.relevance_score * 100)}% Match</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-app p-4 bg-app/20 space-y-4">
                <DetailRow label="Product Name" value={product.product_name} />
                {product.brand_name && (
                    <DetailRow label="Brand Name" value={product.brand_name} />
                )}
                <DetailRow label="Category" value={formatCategoryText(product.type)} />
                <DetailRow label="Manufacturer/Company" value={product.company_name} />
                <DetailRow label="Registration Number" value={product.registration_number} />
                {product.issuance_date && (
                    <DetailRow label="Issuance Date" value={product.issuance_date} />
                )}
                {product.expiry_date && (
                    <DetailRow label="Expiry Date" value={product.expiry_date} />
                )}
                {typeof product.relevance_score === 'number' && (
                    <DetailRow label="Relevance Score" value={`${Math.round(product.relevance_score * 100)}%`} />
                )}
            </div>
        </Modal>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
            <span className="text-sm text-muted font-medium min-w-[120px] shrink-0">{label}</span>
            <span className="text-sm font-semibold text-left break-words overflow-wrap-anywhere">{value}</span>
        </div>
    );
}
