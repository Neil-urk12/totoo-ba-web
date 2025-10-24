import { Check, AlertTriangle, X } from "lucide-react";
import AlternativeProductCard from "./AlternativeProductCard";

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
                return <Check className="text-green-600" />;
            case 'uncertain':
                return <AlertTriangle className="text-yellow-600" />;
            case 'not_verified':
            default:
                return <X className="text-red-600" />;
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-600';
        if (confidence >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5" role="region" aria-labelledby="image-verification-result">
            {/* Left Column - Main Result */}
            <div className="lg:col-span-2">
                <div className="rounded-xl border border-app bg-app/30 p-5 h-full flex flex-col">
                    {/* Verification Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold mb-4 self-start ${
                        data.verification_status === 'verified' 
                            ? 'text-green-700 bg-green-500/10' 
                            : data.verification_status === 'uncertain'
                            ? 'text-yellow-700 bg-yellow-500/10'
                            : 'text-red-700 bg-red-500/10'
                    }`}>
                        <label className='flex flex-row justify-center items-center gap-1.5'>
                            {getStatusIcon(data.verification_status)}
                            <span className="capitalize">{data.verification_status.replace('_', ' ')}</span>
                        </label>
                    </div>

                    <div className="space-y-3.5 flex-1">
                        {/* Matched Product Info */}
                        {data.matched_product && (
                            <>
                                <div>
                                    <div className="text-[11px] uppercase tracking-wide opacity-70">Product name</div>
                                    <div className="mt-1 font-semibold text-lg">{data.matched_product.product_name || 'N/A'}</div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wide opacity-70">Category</div>
                                        <div className="mt-1 font-medium">{data.matched_product.type || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wide opacity-70">Registration number</div>
                                        <div className="mt-1 font-mono text-sm">{data.matched_product.registration_number || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wide opacity-70">Manufacturer</div>
                                        <div className="mt-1 font-medium">{data.matched_product.company_name || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wide opacity-70">Relevance score</div>
                                        <div className="mt-1 text-sm">{(data.matched_product.relevance_score * 100).toFixed(1)}%</div>
                                    </div>
                                    
                                    {/* Matched Fields */}
                                    <div className="pt-2 border-t border-app">
                                        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">Matched Fields</div>
                                        <div className="flex flex-wrap gap-1">
                                            {data.matched_product.matched_fields.map((field, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded" aria-label={`Matched field: ${field.replace('_', ' ')}`}>
                                                    {field.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Confidence Score */}
                        <div className="pt-3 border-t border-app">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] uppercase tracking-wide opacity-70">Confidence Score</span>
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

                        {/* Extracted Fields Summary */}
                        <div className="pt-3 border-t border-app">
                            <div className="text-[11px] uppercase tracking-wide opacity-70 mb-3">Extracted Information</div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="opacity-70">Brand:</span>
                                    <span className="font-medium">{data.extracted_fields.brand_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-70">Net Weight:</span>
                                    <span className="font-medium">{data.extracted_fields.net_weight || 'N/A'}</span>
                                </div>
                                {data.extracted_fields.expiry_date && (
                                    <div className="flex justify-between">
                                        <span className="opacity-70">Expiry:</span>
                                        <span className="font-medium">{data.extracted_fields.expiry_date}</span>
                                    </div>
                                )}
                                {data.extracted_fields.batch_number && (
                                    <div className="flex justify-between">
                                        <span className="opacity-70">Batch:</span>
                                        <span className="font-mono text-xs">{data.extracted_fields.batch_number}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* AI Reasoning */}
                        <div className="pt-3 border-t border-app">
                            <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">AI Analysis</div>
                            <p className="text-sm leading-relaxed">{data.ai_reasoning}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Alternative Matches */}
            <div className="lg:col-span-3">
                {data.alternative_matches && data.alternative_matches.length > 0 ? (
                    <div className="h-full">
                        <h3 className="text-lg font-semibold mb-3">Alternative Products</h3>
                        {/* Mobile: Horizontal scrolling, Desktop: Grid layout */}
                        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-x-visible lg:snap-none lg:auto-rows-fr">
                            {data.alternative_matches.map((match, idx) => (
                                <div key={idx} className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start lg:w-auto">
                                    <AlternativeProductCard product={{
                                        product_name: match.product_name,
                                        company_name: match.company_name,
                                        type: match.type,
                                        registration_number: match.registration_number,
                                        relevance_score: match.relevance_score
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center rounded-xl border border-dashed border-app/70 bg-app/20 p-6">
                        <div className="text-center">
                            <div className="text-sm text-muted">No alternative products found</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
