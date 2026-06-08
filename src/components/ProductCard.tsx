/**
 * Product Card Component
 * 
 * Displays a product in either grid or list view with verification status,
 * category, and basic information. Includes a modal for viewing full details.
 * 
 * Features:
 * - Two view modes: grid and list
 * - Verification status badge with icon
 * - Product information display
 * - "View details" button with eye icon
 * - Modal popup for full product details
 * - Responsive design
 * - Hover effects
 * - Accessible ARIA attributes
 * 
 * @component
 * @param {ProductCardProps} props - Component props
 * @returns {JSX.Element} A product card with optional modal
 * 
 * @example
 * <ProductCard product={productData} viewMode="grid" />
 */
import { useState, lazy, Suspense } from "react";
import { Check, Eye } from "lucide-react";
import type { DisplayProduct } from "../types";
const ProductCardDetailsModal = lazy(() => import("./ProductCardDetailsModal"));

interface ProductCardProps {
    product: DisplayProduct;
    viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
    const [showModal, setShowModal] = useState(false);

    if (viewMode === 'list') {
        return (
            <>
                <div className="rounded-lg shadow-sm border p-3 sm:p-4 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`product-name-${product.id}`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 id={`product-name-${product.id}`} className="font-semibold text-sm sm:text-base mb-1">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-muted mb-1">{product.manufacturer}</p>
                            <p className="text-xs text-muted">{product.category}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted whitespace-nowrap">{product.category}</span>
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium flex-shrink-0 bg-verified text-verified" aria-label="Status: Verified">
                                    <Check className="w-3 h-3" />
                                    <span className="sr-only">Verified</span>
                                    <span>Verified</span>
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

                <Suspense fallback={null}>
                    <ProductCardDetailsModal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        product={product}
                    />
                </Suspense>
            </>
        );
    }

    return (
        <>
            <div className="rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`product-name-${product.id}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 id={`product-name-${product.id}`} className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-verified text-verified" aria-label="Status: Verified">
                            <Check className="w-3 h-3" />
                            <span className="sr-only">Verified</span>
                            VERIFIED
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

                <div className="text-sm text-muted">
                    <span className="font-medium">Category:</span> {product.category}
                </div>
            </div>

            <Suspense fallback={null}>
                <ProductCardDetailsModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    product={product}
                />
            </Suspense>
        </>
    );
}
