import { useMemo, useState, useEffect, useRef } from 'react';
import { FaSearch, FaList } from 'react-icons/fa';
import { CiGrid41 } from "react-icons/ci";
import ProductCard from '../components/ProductCard';
import { useGetProductsInfiniteQuery } from '../query/get/useGetFoodProductsQuery';
import type { Product, ProductsResponse } from '../query/get/useGetFoodProductsQuery';

const transformProduct = (product: Product) => {
    // Check if it's a drug product by looking for drug-specific fields
    if ('brand_name' in product || 'generic_name' in product) {
        const drugProduct = product as import('../query/get/useGetFoodProductsQuery').DrugProduct;
        return {
            id: drugProduct.id || drugProduct.registration_number,
            name: drugProduct.brand_name || drugProduct.generic_name || 'Unknown Drug',
            status: 'verified' as const,
            category: 'Pharmaceutical' as const,
            registrationNo: drugProduct.registration_number,
            manufacturer: drugProduct.manufacturer || drugProduct.company_name || 'Unknown Manufacturer',
            registered: drugProduct.issuance_date || 'Unknown',
            expires: drugProduct.expiry_date || 'Unknown',
            compliance: 'compliant' as const,
            action: 'active' as const,
        };
    }

    // It's a food product
    const foodProduct = product as import('../query/get/useGetFoodProductsQuery').FoodProduct;
    return {
        id: foodProduct.id || foodProduct.registration_number,
        name: foodProduct.product_name || 'Unknown Product',
        status: 'verified' as const,
        category: foodProduct.type_of_product || 'Food',
        registrationNo: foodProduct.registration_number,
        manufacturer: foodProduct.company_name || 'Unknown Manufacturer',
        registered: foodProduct.issuance_date || 'Unknown',
        expires: foodProduct.expiry_date || 'Unknown',
        compliance: 'compliant' as const,
        action: 'active' as const,
    };
};

export default function Products() {
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [sortBy, setSortBy] = useState('Name');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error,
        isError
    } = useGetProductsInfiniteQuery(undefined);

    const categories = ['All Categories', 'Food', 'Food Supplement', 'Drugs', 'Cosmetic', 'Medical Device', 'Pharmaceutical'];
    const statuses = ['All Status', 'Verified', 'Not Verified'];
    const sortOptions = ['Name', 'Registration Date', 'Expiry Date', 'Manufacturer'];

    // Apply search only on click/Enter
    const handleSearchSubmit = () => {
        setAppliedSearch(searchTerm.trim().toLowerCase());
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        setAppliedSearch('');
    };

    const allProducts = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page: ProductsResponse) => page.data);
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

        // Client-side search filter (applied via Search button/Enter)
        const query = appliedSearch.trim().toLowerCase();
        const searchFilteredProducts = query
            ? statusFilteredProducts.filter((product) => {
                const name = product.name?.toLowerCase() || '';
                const manufacturer = product.manufacturer?.toLowerCase() || '';
                const registrationNo = product.registrationNo?.toLowerCase() || '';
                const category = product.category?.toString().toLowerCase() || '';
                return (
                    name.includes(query) ||
                    manufacturer.includes(query) ||
                    registrationNo.includes(query) ||
                    category.includes(query)
                );
            })
            : statusFilteredProducts;

        // Sort products based on selected sort option
        const sortedProducts = [...searchFilteredProducts].sort((a, b) => {
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
    }, [allProducts, selectedStatus, sortBy, appliedSearch]);

    // Get total count from the first page
    const totalCount = (data?.pages?.[0] as ProductsResponse)?.totalCount || 0;

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
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ color: "var(--fg)" }}>All Registered Products</h1>
                <p className="text-gray-600 dark:text-slate-300" style={{ color: "var(--fg)" }}>Browse all FDA-registered products in the Philippines database</p>
            </header>

            {/* Search and Filter Bar */}
            <section className="mb-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products, manufacturers, or registration numbers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }} />
                        <button
                            onClick={handleSearchSubmit}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
                        >
                            {sortOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 border rounded-lg ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white  text-gray-600 hover:bg-gray-50'}`}
                        >
                            <CiGrid41 className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 border rounded-lg ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FaList className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Results Count and Clear Search */}
                <div className="flex justify-between items-center">
                    <p className="text-sm dark:text-slate-800" style={{ color: "var(--fg)" }}>
                        {isLoading ? 'Loading products...' :
                            isError ? 'Error loading products' :
                                appliedSearch.trim() ?
                                    `Showing ${filteredProducts.length} of ${totalCount} products for "${appliedSearch.trim()}"${allProducts.length < totalCount ? ` (${allProducts.length} loaded)` : ''}` :
                                    `Showing ${filteredProducts.length} of ${totalCount} products${allProducts.length < totalCount ? ` (${allProducts.length} loaded)` : ''}`}
                    </p>
                    {appliedSearch.trim() && (
                        <button
                            onClick={handleClearSearch}
                            className="text-sm text-blue-500 hover:text-blue-600 underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            </section>

            {/* Loading State */}
            {isLoading && (
                <section className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/30 border-t-gray-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-slate-400 text-lg">Loading products...</p>
                </section>
            )}

            {/* Error State */}
            {isError && (
                <section className="text-center py-12">
                    <p className="text-red-500 dark:text-red-400 text-lg">Error loading products</p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">{error?.message}</p>
                </section>
            )}

            {/* Products Grid */}
            {!isLoading && !isError && (
                <section className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </section>
            )}

            {/* Loading More Products */}
            {!isLoading && !isError && isFetchingNextPage && (
                <section className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600/30 border-t-gray-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-slate-400">Loading more products...</p>
                </section>
            )}

            {/* Load More Products */}
            {!isLoading && !isError && hasNextPage && (
                <div ref={loadMoreRef} className="h-4"></div>
            )}

            {/* No More Products */}
            {!isLoading && !isError && !hasNextPage && allProducts.length > 0 && (
                <section className="text-center py-8">
                    <p className="text-gray-500 dark:text-slate-400">All products loaded</p>
                </section>
            )}

            {/* No Results */}
            {!isLoading && !isError && filteredProducts.length === 0 && (
                <section className="text-center py-12">
                    <p className="text-gray-500 dark:text-slate-400 text-lg">No products found matching your criteria.</p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Try adjusting your search terms or filters.</p>
                </section>
            )}
        </main>
    );
}
