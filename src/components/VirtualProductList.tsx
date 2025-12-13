/**
 * Virtual Product List Component
 * 
 * Uses @tanstack/react-virtual for efficient rendering of large product lists.
 * Supports both grid and list view modes with responsive column count.
 */
import { useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import ErrorBoundary from './ErrorBoundary';
import GenericErrorFallback from './GenericErrorFallback';

interface Product {
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
}

interface VirtualProductListProps {
    products: Product[];
    viewMode: 'grid' | 'list';
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => void;
}

// Estimated row heights
const LIST_ROW_HEIGHT = 90;
const GRID_ROW_HEIGHT = 180;
const GRID_GAP = 24;

// Calculate column count based on width
function calculateColumnCount(width: number): number {
    if (width < 640) return 1;  // Mobile
    if (width < 1024) return 2; // Tablet
    return 3;                    // Desktop
}

export default function VirtualProductList({
    products,
    viewMode,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
}: VirtualProductListProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    // FIX #2: Add state for responsive column count with resize listener
    const [columnCount, setColumnCount] = useState(() => {
        if (typeof window === 'undefined') return 3;
        return viewMode === 'grid' ? calculateColumnCount(window.innerWidth) : 1;
    });

    // FIX #2: Window resize listener for responsive grid
    useEffect(() => {
        if (viewMode !== 'grid') {
            setColumnCount(1);
            return;
        }

        const handleResize = () => {
            const width = parentRef.current?.clientWidth || window.innerWidth;
            setColumnCount(calculateColumnCount(width));
        };

        // Set initial column count
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewMode]);

    const rowCount = viewMode === 'grid'
        ? Math.ceil(products.length / columnCount)
        : products.length;

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => viewMode === 'list' ? LIST_ROW_HEIGHT : GRID_ROW_HEIGHT,
        overscan: 5,
    });

    // Trigger infinite loading when near the end
    const virtualItems = rowVirtualizer.getVirtualItems();
    useEffect(() => {
        const lastItem = virtualItems.at(-1);
        if (!lastItem) return;

        if (
            lastItem.index >= rowCount - 3 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [virtualItems, rowCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // FIX #4: Show skeletons inside the virtual container during initial load
    // This provides a consistent container even while loading
    const showSkeletons = isLoading && products.length === 0;

    // Common container styles - FIX #1: Use viewport-relative height
    const containerStyle = {
        height: 'calc(100vh - 320px)',
        minHeight: '400px',
        width: '100%',
        overflow: 'auto' as const,
    };

    // If loading with no products, show skeleton grid (not virtualized)
    if (showSkeletons) {
        return (
            <div style={containerStyle}>
                <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {Array.from({ length: viewMode === 'grid' ? 6 : 8 }, (_, index) => (
                        <ProductCardSkeleton key={`skeleton-${index}`} viewMode={viewMode} />
                    ))}
                </div>
            </div>
        );
    }

    // No products and not loading
    if (products.length === 0) {
        return null;
    }

    if (viewMode === 'list') {
        return (
            <div ref={parentRef} style={containerStyle}>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualItems.map((virtualRow) => {
                        const product = products[virtualRow.index];
                        if (!product) return null;

                        return (
                            <div
                                key={virtualRow.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    paddingBottom: '16px',
                                }}
                            >
                                <ErrorBoundary fallback={GenericErrorFallback}>
                                    <ProductCard product={product} viewMode="list" />
                                </ErrorBoundary>
                            </div>
                        );
                    })}
                </div>
                {isFetchingNextPage && (
                    <div className="sticky bottom-0 text-center py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-600/30 border-t-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-slate-400 text-sm">Loading more products...</p>
                    </div>
                )}
            </div>
        );
    }

    // Grid view
    return (
        <div ref={parentRef} style={containerStyle}>
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualItems.map((virtualRow) => {
                    const startIndex = virtualRow.index * columnCount;

                    return (
                        <div
                            key={virtualRow.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                                display: 'grid',
                                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                                gap: `${GRID_GAP}px`,
                                paddingBottom: `${GRID_GAP}px`,
                            }}
                        >
                            {Array.from({ length: columnCount }, (_, colIndex) => {
                                const product = products[startIndex + colIndex];
                                if (!product) return <div key={colIndex} />;

                                return (
                                    <ErrorBoundary key={product.id} fallback={GenericErrorFallback}>
                                        <ProductCard product={product} viewMode="grid" />
                                    </ErrorBoundary>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {isFetchingNextPage && (
                <div className="sticky bottom-0 text-center py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-600/30 border-t-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-slate-400 text-sm">Loading more products...</p>
                </div>
            )}
        </div>
    );
}
