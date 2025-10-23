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
        <div className="space-y-6" role="region" aria-labelledby="image-verification-result">
            {/* Verification Status */}
            <div className="flex items-center justify-between">
                <h2 id="image-verification-result" className="text-xl font-bold">Image Verification Result</h2>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(data.verification_status)}`} 
                     aria-label={`Verification status: ${data.verification_status.replace('_', ' ')}`}>
                    {getStatusIcon(data.verification_status)}
                    <span className="sr-only">{data.verification_status.replace('_', ' ')}</span>
                    <span className="capitalize">{data.verification_status.replace('_', ' ')}</span>
                </div>
            </div>

            {/* Confidence Score */}
            <div className="rounded-xl border border-app p-4 bg-app/30" role="region" aria-labelledby="confidence-score-section">
                <h3 id="confidence-score-section" className="sr-only">Confidence Score</h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Confidence Score</span>
                    <span className={`text-lg font-bold ${getConfidenceColor(data.confidence)}`} aria-label={`Confidence: ${data.confidence}%`}>
                        {data.confidence}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={data.confidence} aria-valuemin={0} aria-valuemax={100} aria-label="Confidence score">
                    <div
                        className={`h-2 rounded-full ${data.confidence >= 80 ? 'bg-green-500' : data.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${data.confidence}%` }}
                    ></div>
                </div>
            </div>

            {/* Extracted Fields */}
            <div className="rounded-xl border border-app p-5 bg-app/30" role="region" aria-labelledby="extracted-fields">
                <h3 id="extracted-fields" className="text-lg font-semibold mb-4">Extracted Information</h3>
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
                <div className="rounded-xl border border-app p-5 bg-app/30" role="region" aria-labelledby="best-match">
                    <h3 id="best-match" className="text-lg font-semibold mb-4">Best Match</h3>
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
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded" aria-label={`Matched field: ${field.replace('_', ' ')}`}>
                                        {field.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Reasoning */}
            <div className="rounded-xl border border-app p-5 bg-app/30" role="region" aria-labelledby="ai-analysis">
                <h3 id="ai-analysis" className="text-lg font-semibold mb-3">AI Analysis</h3>
                <p className="text-sm leading-relaxed">{data.ai_reasoning}</p>
            </div>

            {/* Alternative Matches */}
            {data.alternative_matches && data.alternative_matches.length > 0 && (
                <div className="rounded-xl border border-app p-5 bg-app/30" role="region" aria-labelledby="alternative-matches">
                    <h3 id="alternative-matches" className="text-lg font-semibold mb-4">Alternative Matches</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {data.alternative_matches.map((match, index) => (
                            <div key={index} className="rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow bg-card border-app" role="article" aria-labelledby={`alt-match-${index}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <h4 id={`alt-match-${index}`} className="font-semibold text-sm line-clamp-2 pr-2">{match.product_name}</h4>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-app/70 bg-app/40`} aria-label={`Product type: ${match.type || '—'}`}>
                                        {(match.type || '—').toString().toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-xs text-muted mb-2 line-clamp-1">{match.company_name}</div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="opacity-70">Reg. No.</span>
                                    <span className="font-mono">{match.registration_number}</span>
                                </div>
                                <div className="mt-2 text-right text-[11px] text-muted">{(match.relevance_score * 100).toFixed(0)}% match</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
