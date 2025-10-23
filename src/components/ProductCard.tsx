import { FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";

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
    const getStatusIcon = () => {
        if (product.status === 'verified') {
            return <FaCheck className="w-3 h-3" />;
        }
        return <FaTimes className="w-3 h-3" />;
    };

    const getActionIcon = () => {
        if (product.action === 'active') {
            return <FaCheck className="w-3 h-3" />;
        }
        return <FaExclamationTriangle className="w-3 h-3" />;
    };

    const getStatusColor = () => {
        return product.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getComplianceColor = () => {
        return product.compliance === 'compliant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getActionColor = () => {
        return product.action === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    if (viewMode === 'list') {
        return (
            <div className="rounded-lg shadow-sm border p-3 sm:p-4 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`product-name-${product.id}`}>
                <div className="flex flex-col gap-2">
                    {/* Row 1: Name and badges */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <h3 id={`product-name-${product.id}`} className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor()}`} aria-label={`Status: ${product.status === 'verified' ? 'Verified' : 'Not Verified'}`}>
                                {getStatusIcon()}
                                <span className="sr-only">{product.status === 'verified' ? 'Verified' : 'Not Verified'}</span>
                                {product.status === 'verified' ? 'VERIFIED' : 'NOT VERIFIED'}
                            </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor()}`} aria-label={`Compliance: ${product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}`}>
                                <span className="sr-only">{product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}</span>
                                {product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                            </div>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor()}`} aria-label={`Action: ${product.action === 'active' ? 'Active' : 'Suspended'}`}>
                                {getActionIcon()}
                                <span className="sr-only">{product.action === 'active' ? 'Active' : 'Suspended'}</span>
                                {product.action === 'active' ? 'Active' : 'Suspended'}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Scrollable details with full labels */}
                    <div className="scrollbar-none flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto">
                        <span className="text-muted whitespace-nowrap">Category: {product.category}</span>
                        <span className="text-muted whitespace-nowrap">Reg: {product.registrationNo}</span>
                        <span className="text-muted whitespace-nowrap">Manufacturer: {product.manufacturer}</span>
                        <span className="text-muted whitespace-nowrap">Registered: {product.registered}</span>
                        <span className="text-muted whitespace-nowrap">Expires: {product.expires}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (default)
    return (
        <div className="rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`product-name-${product.id}`}>
            <div className="flex items-start justify-between mb-4">
                <h3 id={`product-name-${product.id}`} className="font-semibold text-lg">{product.name}</h3>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`} aria-label={`Status: ${product.status === 'verified' ? 'Verified' : 'Not Verified'}`}>
                    {getStatusIcon()}
                    <span className="sr-only">{product.status === 'verified' ? 'Verified' : 'Not Verified'}</span>
                    {product.status === 'verified' ? 'VERIFIED' : 'NOT VERIFIED'}
                </div>
            </div>

            <div className="mb-4">
                <span className="text-sm text-muted">Category: {product.category}</span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted">Registration No.</span>
                    <span className="font-medium">{product.registrationNo}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted">Manufacturer</span>
                    <span className="font-medium">{product.manufacturer}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted">Registered</span>
                    <span className="font-medium">{product.registered}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted">Expires</span>
                    <span className="font-medium">{product.expires}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor()}`} aria-label={`Compliance: ${product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}`}>
                    <span className="sr-only">{product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}</span>
                    {product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor()}`} aria-label={`Action: ${product.action === 'active' ? 'Active' : 'Suspended'}`}>
                    {getActionIcon()}
                    <span className="sr-only">{product.action === 'active' ? 'Active' : 'Suspended'}</span>
                    {product.action === 'active' ? 'Active' : 'Suspended'}
                </div>
            </div>
        </div>
    );
}
