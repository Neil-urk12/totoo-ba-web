import { createPortal } from "react-dom";
import { Check, X as CloseIcon } from "lucide-react";
import type { DisplayProduct } from "../types";

interface ProductCardDetailsModalProps {
    open: boolean;
    onClose: () => void;
    product: DisplayProduct | null;
}

export default function ProductCardDetailsModal({ open, onClose, product }: ProductCardDetailsModalProps) {
    if (!open || !product) return null;

    return createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

            <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[600px] max-h-[85vh]">
                <div className="m-0 sm:m-0 rounded-t-2xl sm:rounded-2xl border border-app bg-card shadow-xl overflow-hidden flex flex-col" role="document">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-app">
                        <h2 id="modal-title" className="font-semibold text-lg">Product Details</h2>
                        <button
                            type="button"
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 sm:p-6 overflow-auto space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-verified text-verified">
                                    <Check className="w-4 h-4" />
                                    <span>VERIFIED</span>
                                </div>
                                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <span>Compliant</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <Check className="w-4 h-4" />
                                    <span>Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-app p-4 bg-app/20 space-y-4">
                            <DetailRow label="Category" value={product.category} />
                            <DetailRow label="Registration Number" value={product.registrationNo} />
                            <DetailRow label="Manufacturer" value={product.manufacturer} />
                            <DetailRow label="Registered Date" value={product.registered} />
                            <DetailRow label="Expiry Date" value={product.expires} />
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
            <span className="text-sm text-muted font-medium">{label}</span>
            <span className="text-sm font-semibold">{value}</span>
        </div>
    );
}
