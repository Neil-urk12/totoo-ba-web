import { Package, Building2, BarChart3, Clock, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

// Mock data for analytics
const mockAnalyticsData = {
    totalProducts: 240000,
    verifiedToday: 1234,
    complianceRate: 94.5,
    activeBusinesses: 8901,
    activeRecalls: 12,
    expiringSoon: 156,
    productsByCategory: [
        { name: 'Food Supplements', count: 18234, trend: 'up' },
        { name: 'Cosmetics', count: 13701, trend: 'up' },
        { name: 'Drugs', count: 9135, trend: 'neutral' },
        { name: 'Medical Devices', count: 4608, trend: 'down' },
    ],
    recentActivity: [
        { type: 'New Registration', product: 'Vitamin D3 5000IU', time: '2 hours ago', status: 'success' },
        { type: 'Recall Alert', product: 'Whitening Cream Brand X', time: '5 hours ago', status: 'warning' },
        { type: 'Registration Expired', product: 'Herbal Supplement Y', time: '1 day ago', status: 'error' },
        { type: 'Status Update', product: 'Collagen Peptides', time: '1 day ago', status: 'success' },
        { type: 'Status Update', product: 'Omega-3 Fish Oil', time: '2 days ago', status: 'success' },
    ],
    topManufacturers: [
        { rank: 1, name: 'PharmaCorp Philippines', products: 234, complianceRate: 98 },
        { rank: 2, name: 'Natural Health Inc.', products: 189, complianceRate: 96 },
        { rank: 3, name: 'Beauty Solutions Ltd.', products: 156, complianceRate: 94 },
        { rank: 4, name: 'Wellness Products Co.', products: 142, complianceRate: 92 },
        { rank: 5, name: 'Herbal Remedies PH', products: 128, complianceRate: 90 },
    ]
};

type MetricCardProps = {
    title: string;
    value: string | number;
    trend?: string;
    trendValue?: string;
    icon: React.ReactNode;
    trendType?: 'positive' | 'negative' | 'neutral';
}

function MetricCard({ title, value, trend, trendValue, icon, trendType = 'positive' }: MetricCardProps) {
    const getTrendColor = () => {
        switch (trendType) {
            case 'positive': return 'text-green-600';
            case 'negative': return 'text-red-600';
            default: return 'text-orange-600';
        }
    };

    const getTrendIcon = () => {
        if (trendType === 'positive') return <TrendingUp aria-hidden="true" />;
        if (trendType === 'negative') return <TrendingDown aria-hidden="true" />;
        return '';
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200" style={{ backgroundColor: "var(--card)", border: "var(--border)" }} role="region" aria-label={`Metric: ${title}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1" style={{ color: "var(--fg)" }}>{title}</p>
                    <p className="text-2xl font-bold text-gray-900" style={{ color: "var(--muted)" }}>{value}</p>
                    {trend && trendValue && (
                        <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`} role="status">
                            <span className="mr-1" aria-hidden="true">{getTrendIcon()}</span>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                <div className="text-gray-400 dark:text-gray-500" aria-hidden="true">
                    {icon}
                </div>
            </div>
        </div >
    );
}

function CategoryBar({ name, count, trend }: { name: string; count: number; trend: string }) {
    const maxCount = Math.max(...mockAnalyticsData.productsByCategory.map(c => c.count));
    const percentage = (count / maxCount) * 100;

    const getTrendIcon = () => {
        if (trend === 'up') return <span className="text-green-600"><TrendingUp /></span>;
        if (trend === 'down') return <span className="text-red-600"><TrendingDown /></span>;
        return null;
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-600 last:border-b-0">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900" style={{ color: "var(--fg)" }}>{name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{count.toLocaleString()}</span>
                        {getTrendIcon()}
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: "var(--bg)" }}>
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ type, product, time, status }: { type: string; product: string; time: string; status: string }) {
    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-900 last:border-b-0">
            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor()}`} />
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900" style={{ color: "var(--fg)" }}>{type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{time}</p>
            </div>
        </div>
    );
}

function ComplianceBar({ rate }: { rate: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 rounded-full h-2" style={{ backgroundColor: "var(--bg)" }}>
                <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${rate}%` }}
                />
            </div>
            <span className="text-sm text-gray-600" style={{ color: "var(--muted)" }}>{rate}%</span>
        </div>
    );
}

export default function Analytics() {

    return (
        <div className="min-h-screen bg-gray-50" style={{ backgroundColor: "var(--bg)" }} role="main" aria-label="Analytics Dashboard">
            {/* Header */}
            <header className="bg-white " style={{ backgroundColor: "var(--bg)" }}>
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900" style={{ color: "var(--fg)" }}>Analytics Dashboard</h1>
                            <p className="text-gray-700  mt-1" style={{ color: "var(--fg)" }}>
                                Real-time insights and statistics on FDA-registered products and compliance trends.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" role="region" aria-label="Key Metrics">
                    <MetricCard
                        title="Total Products"
                        value={mockAnalyticsData.totalProducts.toLocaleString()}
                        trend="+12% from last month"
                        icon={<Package className="text-xl" />}
                        trendType="positive"
                    />
                    <MetricCard
                        title="Verified Today"
                        value={mockAnalyticsData.verifiedToday.toLocaleString()}
                        trend="+8% from yesterday"
                        icon={<Clock className="text-xl" />}
                        trendType="positive"
                    />
                    <MetricCard
                        title="Compliance Rate"
                        value={`${mockAnalyticsData.complianceRate}%`}
                        trend="+2.3% from last quarter"
                        icon={<BarChart3 className="text-xl" />}
                        trendType="positive"
                    />
                    <MetricCard
                        title="Active Businesses"
                        value={mockAnalyticsData.activeBusinesses.toLocaleString()}
                        trend="+5% from last month"
                        icon={<Building2 className="text-xl" />}
                        trendType="positive"
                    />
                    <MetricCard
                        title="Active Recalls"
                        value={mockAnalyticsData.activeRecalls}
                        trend="+3 from last week"
                        icon={<AlertTriangle className="text-xl" />}
                        trendType="negative"
                    />
                    <MetricCard
                        title="Expiring Soon"
                        value={mockAnalyticsData.expiringSoon}
                        trend="Within 30 days"
                        icon={<AlertTriangle className="text-xl" />}
                        trendType="neutral"
                    />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Products by Category */}
                    <div className=" bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200" style={{ backgroundColor: "var(--card)", border: "var(--border)" }} role="region" aria-labelledby="products-by-category">
                        <h2 id="products-by-category" className="text-lg font-semibold text-gray-900 mb-4" style={{ color: "var(--fg)" }}>Products by Category</h2>
                        <div className="space-y-0">
                            {mockAnalyticsData.productsByCategory.map((category, index) => (
                                <CategoryBar
                                    key={index}
                                    name={category.name}
                                    count={category.count}
                                    trend={category.trend}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200" style={{ backgroundColor: "var(--card)", border: "var(--border)" }} role="region" aria-labelledby="recent-activity">
                        <h2 id="recent-activity" className="text-lg font-semibold text-gray-900 mb-4" style={{ color: "var(--fg)" }}>Recent Activity</h2>
                        <div className="space-y-0">
                            {mockAnalyticsData.recentActivity.map((activity, index) => (
                                <ActivityItem
                                    key={index}
                                    type={activity.type}
                                    product={activity.product}
                                    time={activity.time}
                                    status={activity.status}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Manufacturers Table */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200" style={{ backgroundColor: "var(--card)", border: "var(--border)" }} role="region" aria-labelledby="top-manufacturers">
                    <div className="p-6">
                        <h2 id="top-manufacturers" className="text-lg font-semibold text-gray-900" style={{ color: "var(--fg)" }}>Top Manufacturers</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full" role="table" aria-label="Top Manufacturers List">
                            <thead className="bg-gray-50" style={{ backgroundColor: "var(--card)", borderTop: "var(--border)" }}>
                                <tr role="row">
                                    <th role="columnheader" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: "var(--fg)" }}>Rank</th>
                                    <th role="columnheader" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: "var(--fg)" }}>Manufacturer</th>
                                    <th role="columnheader" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: "var(--fg)" }}>Products</th>
                                    <th role="columnheader" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: "var(--fg)" }}>Compliance Rate</th>
                                    <th role="columnheader" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ color: "var(--fg)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {mockAnalyticsData.topManufacturers.map((manufacturer, index) => (
                                    <tr key={index} role="row">
                                        <td role="cell" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ color: "var(--muted)" }}>
                                            {manufacturer.rank}
                                        </td>
                                        <td role="cell" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ color: "var(--muted)" }}>
                                            {manufacturer.name}
                                        </td>
                                        <td role="cell" className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" style={{ color: "var(--muted)" }}>
                                            {manufacturer.products}
                                        </td>
                                        <td role="cell" className="px-6 py-4 whitespace-nowrap" style={{ color: "var(--muted)" }}>
                                            <ComplianceBar rate={manufacturer.complianceRate} />
                                        </td>
                                        <td role="cell" className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "var(--muted)" }}>
                                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium" aria-label={`View details for ${manufacturer.name}`}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
