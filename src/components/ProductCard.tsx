import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import ProductCardDetailsModal from "./ProductCardDetailsModal";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        status: 'verified' | 'not-verified';
        category: string;
        registrationNo: string;
        manufacturer: string;
        registered: string;
        expires: string;
        compliance: 'compliant' | 'non-compliant';
        action: 'active' | 'suspended';
    };
    viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
    const [showModal, setShowModal] = useState(false);

    const getStatusIcon = () => {
        if (product.status === 'verified') {
            return <Check className="w-3 h-3" />;
        }
        return <X className="w-3 h-3" />;
    };

    const getStatusColor = () => {
        return product.status === 'verified' ? 'bg-verified text-verified' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    };

    if (viewMode === 'list') {
        return (
            <>
                <div className="rounded-lg shadow-sm border p-3 sm:p-4 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`product-name-${product.id}`}>
                    <div className="flex items-start justify-between gap-4">
                        {/* Left side: Product info stacked vertically */}
                        <div className="flex-1 min-w-0">
                            <h3 id={`product-name-${product.id}`} className="font-semibold text-sm sm:text-base mb-1">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-muted mb-1">{product.manufacturer}</p>
                            <p className="text-xs text-muted">{product.category}</p>
                        </div>

                        {/* Right side: Badges and button stacked vertically and fixed to the right */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted whitespace-nowrap">{product.category}</span>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getStatusColor()}`} aria-label={`Status: ${product.status === 'verified' ? 'Verified' : 'Not Verified'}`}>
                                    {getStatusIcon()}
                                    <span className="sr-only">{product.status === 'verified' ? 'Verified' : 'Not Verified'}</span>
                                    <span>{product.status === 'verified' ? 'Verified' : 'Not Verified'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted whitespace-nowrap">{product.expires}</span>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="View product details"
                                >
                                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ProductCardDetailsModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    product={product}
                />
            </>
        );
    }

    // Grid view (default)
    return (
        <>
            <div className="rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`product-name-${product.id}`}>
                {/* Header with name, status, and eye icon */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 id={`product-name-${product.id}`} className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`} aria-label={`Status: ${product.status === 'verified' ? 'Verified' : 'Not Verified'}`}>
                            {getStatusIcon()}
                            <span className="sr-only">{product.status === 'verified' ? 'Verified' : 'Not Verified'}</span>
                            {product.status === 'verified' ? 'VERIFIED' : 'NOT VERIFIED'}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                        aria-label="View product details"
                    >
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Category */}
                <div className="text-sm text-muted">
                    <span className="font-medium">Category:</span> {product.category}
                </div>
            </div>

            <ProductCardDetailsModal
                open={showModal}
                onClose={() => setShowModal(false)}
                product={product}
            />
        </>
    );
}
