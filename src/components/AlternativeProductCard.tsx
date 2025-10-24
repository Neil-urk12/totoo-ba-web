import { useState } from "react";
import { Eye } from "lucide-react";
import AlternativeProductDetailsModal from "./AlternativeProductDetailsModal";
import { formatCategoryText } from "../utils/formatters";

interface AlternativeProductCardProps {
    product: {
        product_name: string;
        type?: string;
        company_name: string;
        registration_number: string;
        relevance_score?: number | null;
        brand_name?: string | null;
        issuance_date?: string | null;
        expiry_date?: string | null;
    };
}

export default function AlternativeProductCard({ product }: AlternativeProductCardProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="rounded-xl shadow-sm border p-4 sm:p-5 hover:shadow-md transition-shadow bg-card border-app flex flex-col h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="font-semibold text-sm line-clamp-2 flex-1 break-words">{product.product_name}</h4>
                    <button
                        onClick={() => setShowModal(true)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                        aria-label="View product details"
                    >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
                
                {product.brand_name && (
                    <div className="text-xs text-muted mb-2">
                        <span className="font-medium">Brand:</span> {product.brand_name}
                    </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border border-app/70 bg-app/40 shrink-0">
                        {formatCategoryText(product.type)}
                    </span>
                </div>
                
                <div className="text-xs text-muted mb-3 line-clamp-1">{product.company_name}</div>
                
                <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="opacity-70 shrink-0">Reg. No.</span>
                        <span className="font-mono text-xs truncate text-right">{product.registration_number}</span>
                    </div>
                    {product.expiry_date && (
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="opacity-70">Expiry</span>
                            <span className="text-xs">{product.expiry_date}</span>
                        </div>
                    )}
                    {typeof product.relevance_score === 'number' && (
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="opacity-70">Match</span>
                            <span className="font-semibold text-blue-600">{Math.round(product.relevance_score * 100)}%</span>
                        </div>
                    )}
                </div>
            </div>

            <AlternativeProductDetailsModal
                open={showModal}
                onClose={() => setShowModal(false)}
                product={product}
            />
        </>
    );
}
