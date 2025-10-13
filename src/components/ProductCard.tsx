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
}

export default function ProductCard({ product }: ProductCardProps) {
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

    return (
        <div className="rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow bg-card border-app">
            <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                    {getStatusIcon()}
                    {product.status === 'verified' ? 'VERIFIED' : 'NOT VERIFIED'}
                </div>
            </div>

            <div className="mb-4">
                <span className="text-sm text-muted">{product.category}</span>
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
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor()}`} >
                    {product.compliance === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor()}`} >
                    {getActionIcon()}
                    {product.action === 'active' ? 'Active' : 'Suspended'}
                </div>
            </div>
        </div>
    );
}
