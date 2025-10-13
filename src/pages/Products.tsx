import { useMemo, useState } from 'react';
import { FaSearch, FaList } from 'react-icons/fa';
import { CiGrid41 } from "react-icons/ci";
import ProductCard from '../components/ProductCard';

// Mock Data
const sampleProducts = [
    {
        id: '1',
        name: 'Acne Treatment Gel',
        status: 'not-verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000055443322',
        manufacturer: 'Beauty Essentials Corp.',
        registered: '2022-09-15',
        expires: '2025-09-14',
        compliance: 'non-compliant' as const,
        action: 'suspended' as const,
    },
    {
        id: '2',
        name: 'Anti-Aging Serum',
        status: 'verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000099887766',
        manufacturer: 'Premium Skincare Co.',
        registered: '2023-02-14',
        expires: '2026-02-13',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '3',
        name: 'Calcium + Vitamin D Tablets',
        status: 'verified' as const,
        category: 'Food Supplement',
        registrationNo: 'FR-4000022110099',
        manufacturer: 'HealthCare Philippines Inc.',
        registered: '2022-12-05',
        expires: '2025-12-04',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '4',
        name: 'Collagen Drink Mix',
        status: 'not-verified' as const,
        category: 'Food Supplement',
        registrationNo: 'FR-4000044332211',
        manufacturer: 'HealthCare Philippines Inc.',
        registered: '2023-01-20',
        expires: '2026-01-19',
        compliance: 'non-compliant' as const,
        action: 'suspended' as const,
    },
    {
        id: '5',
        name: 'Herbal Shampoo',
        status: 'verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000077665544',
        manufacturer: 'Natural Beauty Products',
        registered: '2023-03-10',
        expires: '2026-03-09',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '6',
        name: 'Multivitamin Complex',
        status: 'verified' as const,
        category: 'Food Supplement',
        registrationNo: 'FR-4000055667788',
        manufacturer: 'Wellness Labs Inc.',
        registered: '2022-11-30',
        expires: '2025-11-29',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '7',
        name: 'Moisturizing Cream',
        status: 'verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000033221100',
        manufacturer: 'Skin Care Solutions',
        registered: '2023-04-15',
        expires: '2026-04-14',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '8',
        name: 'Protein Powder',
        status: 'not-verified' as const,
        category: 'Food Supplement',
        registrationNo: 'FR-4000066778899',
        manufacturer: 'Fitness Nutrition Co.',
        registered: '2023-02-28',
        expires: '2026-02-27',
        compliance: 'non-compliant' as const,
        action: 'suspended' as const,
    },
    {
        id: '9',
        name: 'Hair Growth Serum',
        status: 'verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000088990011',
        manufacturer: 'Hair Care Innovations',
        registered: '2023-01-10',
        expires: '2026-01-09',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '10',
        name: 'Omega-3 Capsules',
        status: 'verified' as const,
        category: 'Food Supplement',
        registrationNo: 'FR-4000011223344',
        manufacturer: 'Vital Health Corp.',
        registered: '2022-10-20',
        expires: '2025-10-19',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
    {
        id: '11',
        name: 'Sunscreen Lotion',
        status: 'not-verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000099887766',
        manufacturer: 'Sun Protection Ltd.',
        registered: '2023-05-01',
        expires: '2026-04-30',
        compliance: 'non-compliant' as const,
        action: 'suspended' as const,
    },
    {
        id: '12',
        name: 'Vitamin C Serum',
        status: 'verified' as const,
        category: 'Cosmetic',
        registrationNo: 'NC-4000044556677',
        manufacturer: 'Bright Skin Co.',
        registered: '2023-03-25',
        expires: '2026-03-24',
        compliance: 'compliant' as const,
        action: 'active' as const,
    },
];

export default function Products() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [sortBy, setSortBy] = useState('Name');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const categories = ['All Categories', 'Cosmetic', 'Food Supplement', 'Medical Device', 'Pharmaceutical'];
    const statuses = ['All Status', 'Verified', 'Not Verified'];
    const sortOptions = ['Name', 'Registration Date', 'Expiry Date', 'Manufacturer'];

    const filteredProducts = useMemo(() => sampleProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.registrationNo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;

        const matchesStatus = selectedStatus === 'All Status' ||
            (selectedStatus === 'Verified' && product.status === 'verified') ||
            (selectedStatus === 'Not Verified' && product.status === 'not-verified');

        return matchesSearch && matchesCategory && matchesStatus;
    }), [searchTerm, selectedStatus, selectedCategory]);

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
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }} />
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

                {/* Results Count */}
                <p className="text-sm dark:text-slate-800" style={{ color: "var(--fg)" }}>
                    Showing {filteredProducts.length} of {sampleProducts.length} products
                </p>
            </section>

            {/* Products Grid */}
            <section className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </section>

            {/* No Results */}
            {filteredProducts.length === 0 && (
                <section className="text-center py-12">
                    <p className="text-gray-500 dark:text-slate-400 text-lg">No products found matching your criteria.</p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Try adjusting your search terms or filters.</p>
                </section>
            )}
        </main>
    );
}
