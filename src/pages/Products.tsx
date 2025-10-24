import { useMemo, useState, useEffect, useRef } from 'react';
import { Search, List, Grid2X2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { useGetUnifiedProductsInfiniteQuery } from "../query/get/useGetUnifiedProductsQuery";
import type { UnifiedProduct, UnifiedProductsResponse } from '../types/UnifiedProduct';
import ErrorBoundary from '../components/ErrorBoundary';
import GenericErrorFallback from '../components/GenericErrorFallback';

const transformProduct = (product: UnifiedProduct) => {
    return {
        id: product.id || product.registration_number,
        name: product.name || 'Unknown Product',
        status: 'verified' as const,
        category: product.category || product.source_category,
        registrationNo: product.registration_number,
        manufacturer: product.manufacturer || 'Unknown Manufacturer',
        registered: product.issuance_date || 'Unknown',
        expires: product.expiry_date || 'Unknown',
        compliance: 'compliant' as const,
        action: 'active' as const,
    };
};

export default function Products() {
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [appliedCategory, setAppliedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [sortBy, setSortBy] = useState('Name');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Load initial products on mount
    useEffect(() => {
        setAppliedCategory('All Categories');
    }, []);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error,
        isError
    } = useGetUnifiedProductsInfiniteQuery(appliedCategory, appliedSearch || undefined);

    const categories = ['All Categories', 'Food', 'Food Supplement', 'Drugs', 'Cosmetic', 'Medical Device', 'Pharmaceutical'];
    const statuses = ['All Status', 'Verified', 'Not Verified'];
    const sortOptions = ['Name', 'Registration Date', 'Expiry Date', 'Manufacturer'];

    // Apply search only on click/Enter
    const handleSearchSubmit = () => {
        setAppliedSearch(searchTerm.trim());
        setAppliedCategory(selectedCategory);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        setAppliedSearch('');
        setSelectedCategory('All Categories');
        setAppliedCategory('All Categories');
    };

    const allProducts = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page: UnifiedProductsResponse) => page.data);
    }, [data]);

    const filteredProducts = useMemo(() => {
        if (!allProducts.length) return [];

        const transformedProducts = allProducts.map(transformProduct);

        // Filter by status
        const statusFilteredProducts = transformedProducts.filter(product => {
            const matchesStatus = selectedStatus === 'All Status' ||
                (selectedStatus === 'Verified' && product.status === 'verified');

            return matchesStatus;
        });

        // Sort products based on selected sort option
        const sortedProducts = [...statusFilteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'Name':
                    return a.name.localeCompare(b.name);
                case 'Registration Date': {
                    const dateA = a.registered === 'Unknown' ? new Date(0) : new Date(a.registered);
                    const dateB = b.registered === 'Unknown' ? new Date(0) : new Date(b.registered);
                    return dateB.getTime() - dateA.getTime();
                }
                case 'Expiry Date': {
                    const expiryA = a.expires === 'Unknown' ? new Date(0) : new Date(a.expires);
                    const expiryB = b.expires === 'Unknown' ? new Date(0) : new Date(b.expires);
                    return expiryA.getTime() - expiryB.getTime();
                }
                case 'Manufacturer':
                    return a.manufacturer.localeCompare(b.manufacturer);
                default:
                    return 0;
            }
        });

        return sortedProducts;
    }, [allProducts, selectedStatus, sortBy]);

    // Get total count from the first page
    const totalCount = (data?.pages?.[0] as UnifiedProductsResponse)?.totalCount || 0;

    // Intersection observer for automatic loading
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ color: "var(--fg)" }}>All Registered Products</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300" style={{ color: "var(--fg)" }}>Browse all FDA-registered products in the Philippines database</p>
            </header>

            {/* Search and Filter Bar */}
            <section className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-4 mb-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products, manufacturers, or registration numbers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                            className="w-full pl-10 pr-20 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base"
                            style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }} />
                        <button
                            onClick={handleSearchSubmit}
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filter Dropdowns and View Toggle */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Filter Dropdowns */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm sm:text-base" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm sm:text-base" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm sm:text-base" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
                            >
                                {sortOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2 self-start sm:self-auto">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 sm:p-3 border rounded-lg ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Grid2X2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 sm:p-3 border rounded-lg ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count and Clear Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <p className="text-xs sm:text-sm dark:text-slate-800" style={{ color: "var(--fg)" }}>
                        {isLoading ? 'Loading products...' :
                            appliedSearch.trim() ?
                                `Showing ${filteredProducts.length} of ${totalCount} products for "${appliedSearch.trim()}"${allProducts.length < totalCount ? ` (${allProducts.length} loaded)` : ''}` :
                                `Showing ${filteredProducts.length} of ${totalCount} products${allProducts.length < totalCount ? ` (${allProducts.length} loaded)` : ''}`}
                    </p>
                    {appliedSearch.trim() && (
                        <button
                            onClick={handleClearSearch}
                            className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 underline self-start sm:self-auto"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            </section>


            {/* Error State */}
            {isError && (
                <section className="text-center py-8 sm:py-12">
                    <p className="text-red-500 dark:text-red-400 text-base sm:text-lg">Error loading products</p>
                    <p className="text-gray-400 dark:text-slate-500 text-xs sm:text-sm mt-2">{error?.message}</p>
                </section>
            )}

            {/* Products Grid */}
            {!isError && (
                <section className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {/* Show skeleton loaders while loading initial data */}
                    {isLoading && filteredProducts.length === 0 && (
                        <>
                            {Array.from({ length: viewMode === 'grid' ? 6 : 8 }, (_, index) => (
                                <ProductCardSkeleton key={`skeleton-${index}`} viewMode={viewMode} />
                            ))}
                        </>
                    )}
                    
                    {/* Show actual products */}
                    {filteredProducts.map(product => (
                        <ErrorBoundary key={product.id} fallback={GenericErrorFallback}>
                            <ProductCard product={product} viewMode={viewMode} />
                        </ErrorBoundary>
                    ))}
                </section>
            )}

            {/* Loading More Products */}
            {!isError && isFetchingNextPage && filteredProducts.length > 0 && (
                <section className="text-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-blue-600/30 border-t-gray-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base">Loading more products...</p>
                </section>
            )}

            {/* Load More Products */}
            {!isError && hasNextPage && filteredProducts.length > 0 && (
                <div ref={loadMoreRef} className="h-4"></div>
            )}

            {/* No More Products */}
            {!isError && !hasNextPage && allProducts.length > 0 && filteredProducts.length > 0 && (
                <section className="text-center py-6 sm:py-8">
                    <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base">All products loaded</p>
                </section>
            )}

            {/* No Results */}
            {!isError && filteredProducts.length === 0 && !isLoading && (
                <section className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg">No products found matching your criteria.</p>
                    <p className="text-gray-400 dark:text-slate-500 text-xs sm:text-sm mt-2">Try adjusting your search terms or filters.</p>
                </section>
            )}
        </main>
    );
}
