import { FaCheck, FaExclamationTriangle, FaTimes } from "react-icons/fa";

type ImageVerificationResultProps = {
    data: {
        verification_status: string;
        confidence: number;
        matched_product: {
            id: string;
            relevance_score: number;
            matched_fields: string[];
            type: string;
            registration_number: string;
            product_name: string;
            company_name: string;
        };
        extracted_fields: {
            registration_number: string | null;
            brand_name: string;
            product_description: string;
            manufacturer: string | null;
            expiry_date: string | null;
            batch_number: string | null;
            net_weight: string;
        };
        ai_reasoning: string;
        alternative_matches: Array<{
            id: string;
            relevance_score: number;
            matched_fields: string[];
            type: string;
            registration_number: string;
            product_name: string;
            company_name: string;
        }>;
    };
};

export default function ImageVerificationResult({ data }: ImageVerificationResultProps) {
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return <FaCheck className="text-green-600" />;
            case 'uncertain':
                return <FaExclamationTriangle className="text-yellow-600" />;
            case 'not_verified':
            default:
                return <FaTimes className="text-red-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'bg-green-500/10 text-green-600 border-green-500/30';
            case 'uncertain':
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
            case 'not_verified':
            default:
                return 'bg-red-500/10 text-red-600 border-red-500/30';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-600';
        if (confidence >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Verification Status */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Image Verification Result</h2>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(data.verification_status)}`}>
                    {getStatusIcon(data.verification_status)}
                    <span className="capitalize">{data.verification_status.replace('_', ' ')}</span>
                </div>
            </div>

            {/* Confidence Score */}
            <div className="rounded-xl border border-app p-4 bg-app/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Confidence Score</span>
                    <span className={`text-lg font-bold ${getConfidenceColor(data.confidence)}`}>
                        {data.confidence}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${data.confidence >= 80 ? 'bg-green-500' : data.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${data.confidence}%` }}
                    ></div>
                </div>
            </div>

            {/* Extracted Fields */}
            <div className="rounded-xl border border-app p-5 bg-app/30">
                <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-wide opacity-70">Brand Name</div>
                        <div className="mt-1 font-medium">{data.extracted_fields.brand_name || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-wide opacity-70">Product Description</div>
                        <div className="mt-1 font-medium">{data.extracted_fields.product_description || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-wide opacity-70">Net Weight</div>
                        <div className="mt-1 font-medium">{data.extracted_fields.net_weight || 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-wide opacity-70">Manufacturer</div>
                        <div className="mt-1 font-medium">{data.extracted_fields.manufacturer || 'N/A'}</div>
                    </div>
                    {data.extracted_fields.expiry_date && (
                        <div>
                            <div className="text-xs uppercase tracking-wide opacity-70">Expiry Date</div>
                            <div className="mt-1 font-medium">{data.extracted_fields.expiry_date}</div>
                        </div>
                    )}
                    {data.extracted_fields.batch_number && (
                        <div>
                            <div className="text-xs uppercase tracking-wide opacity-70">Batch Number</div>
                            <div className="mt-1 font-medium">{data.extracted_fields.batch_number}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Matched Product */}
            {data.matched_product && (
                <div className="rounded-xl border border-app p-5 bg-app/30">
                    <h3 className="text-lg font-semibold mb-4">Best Match</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-wide opacity-70">Product Name</div>
                            <div className="mt-1 font-medium">{data.matched_product.product_name}</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wide opacity-70">Company</div>
                            <div className="mt-1 font-medium">{data.matched_product.company_name}</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wide opacity-70">Registration Number</div>
                            <div className="mt-1 font-mono">{data.matched_product.registration_number}</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wide opacity-70">Relevance Score</div>
                            <div className="mt-1">{(data.matched_product.relevance_score * 100).toFixed(1)}%</div>
                        </div>
                        <div className="sm:col-span-2">
                            <div className="text-xs uppercase tracking-wide opacity-70">Matched Fields</div>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {data.matched_product.matched_fields.map((field, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                        {field.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Reasoning */}
            <div className="rounded-xl border border-app p-5 bg-app/30">
                <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
                <p className="text-sm leading-relaxed">{data.ai_reasoning}</p>
            </div>

            {/* Alternative Matches */}
            {data.alternative_matches && data.alternative_matches.length > 0 && (
                <div className="rounded-xl border border-app p-5 bg-app/30">
                    <h3 className="text-lg font-semibold mb-4">Alternative Matches</h3>
                    <div className="space-y-3">
                        {data.alternative_matches.map((match, index) => (
                            <div key={index} className="border border-app/50 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-sm">{match.product_name}</div>
                                    <div className="text-xs text-muted">{(match.relevance_score * 100).toFixed(1)}% match</div>
                                </div>
                                <div className="text-xs text-muted mb-1">{match.company_name}</div>
                                <div className="text-xs font-mono">{match.registration_number}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
