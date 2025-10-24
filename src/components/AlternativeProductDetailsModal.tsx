import { X } from "lucide-react";

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
    if (!open || !product) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            
            {/* Modal */}
            <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-[90vw] sm:w-[600px] max-h-[90vh] sm:max-h-[85vh]">
                <div className="m-0 sm:m-0 rounded-t-2xl sm:rounded-2xl border border-app bg-card shadow-xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]" role="document">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-app">
                        <h2 id="modal-title" className="font-semibold text-lg">Alternative Product Details</h2>
                        <button
                            type="button"
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden space-y-6 flex-1">
                        {/* Product Name */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-3 break-words">{product.product_name}</h3>
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-app/70 bg-app/40">
                                    <span>{(product.type || 'N/A').toString().toUpperCase()}</span>
                                </div>
                                {typeof product.relevance_score === 'number' && (
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        <span>{Math.round(product.relevance_score)}% Match</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="rounded-xl border border-app p-4 bg-app/20 space-y-4">
                            <DetailRow label="Product Name" value={product.product_name} />
                            {product.brand_name && (
                                <DetailRow label="Brand Name" value={product.brand_name} />
                            )}
                            <DetailRow label="Category" value={product.type || 'N/A'} />
                            <DetailRow label="Manufacturer/Company" value={product.company_name} />
                            <DetailRow label="Registration Number" value={product.registration_number} />
                            {product.issuance_date && (
                                <DetailRow label="Issuance Date" value={product.issuance_date} />
                            )}
                            {product.expiry_date && (
                                <DetailRow label="Expiry Date" value={product.expiry_date} />
                            )}
                            {typeof product.relevance_score === 'number' && (
                                <DetailRow label="Relevance Score" value={`${Math.round(product.relevance_score)}%`} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
