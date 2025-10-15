import { FaCheck, FaBuilding, FaIdCard, FaCertificate, FaSearch } from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';

interface FoodIndustryVerificationProps {
    data: {
        is_verified: boolean;
        message: string;
        product_id: string;
        details: {
            confidence_score: number;
            exact_match: boolean;
            matched_field: string;
            search_results_count: number;
            verification_method: string;
            verified_product: {
                id: string;
                license_number: string;
                matched_fields: string[];
                name_of_establishment: string;
                relevance_score: number;
                type: string;
            };
        };
    };
}

export default function FoodIndustryVerification({ data }: FoodIndustryVerificationProps) {
    const { details } = data;
    const { verified_product } = details;

    return (
        <div className="mt-8 space-y-6">
            {/* Verification Status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-green-700 bg-green-500/10">
                <FaCheck />
                Food Industry Verified
            </div>

            {/* Main Verification Card */}
            <div className="rounded-xl border border-app p-5 sm:p-6 bg-app/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Establishment Information */}
                    <div className="sm:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <FaBuilding className="text-blue-600" />
                            <div className="text-[11px] uppercase tracking-wide opacity-70">Establishment Name</div>
                        </div>
                        <div className="text-lg font-semibold text-blue-700">
                            {verified_product.name_of_establishment}
                        </div>
                    </div>

                    {/* License Information */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FaIdCard className="text-green-600" />
                            <div className="text-[11px] uppercase tracking-wide opacity-70">License Number</div>
                        </div>
                        <div className="font-mono text-sm bg-green-50 p-2 rounded" style={{ backgroundColor: "var(--bg)" }}>
                            {verified_product.license_number}
                        </div>
                    </div>

                    {/* Product ID */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FaCertificate className="text-purple-600" />
                            <div className="text-[11px] uppercase tracking-wide opacity-70">Product ID</div>
                        </div>
                        <div className="font-mono text-sm bg-purple-50 p-2 rounded" style={{ backgroundColor: "var(--bg)" }}>
                            {data.product_id}
                        </div>
                    </div>

                    {/* Verification Method */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FaSearch className="text-orange-600" />
                            <div className="text-[11px] uppercase tracking-wide opacity-70">Verification Method</div>
                        </div>
                        <div className="font-medium capitalize">
                            {details.verification_method.replace(/_/g, ' ')}
                        </div>
                    </div>

                    {/* Confidence Score */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FaShield className="text-indigo-600" />
                            <div className="text-[11px] uppercase tracking-wide opacity-70">Confidence Score</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-indigo-600">
                                {details.confidence_score}%
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${details.confidence_score}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Exact Match */}
                    <div>
                        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">Exact Match</div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${details.exact_match
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}>
                            {details.exact_match ? <FaCheck className="text-xs" /> : '~'}
                            {details.exact_match ? 'Yes' : 'Partial'}
                        </div>
                    </div>

                    {/* Search Results Count */}
                    <div>
                        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">Search Results</div>
                        <div className="font-medium">
                            {details.search_results_count} result{details.search_results_count !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Relevance Score */}
                    <div>
                        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">Relevance Score</div>
                        <div className="font-medium">
                            {verified_product.relevance_score.toFixed(2)}
                        </div>
                    </div>

                    {/* Matched Fields */}
                    <div className="sm:col-span-2">
                        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">Matched Fields</div>
                        <div className="flex flex-wrap gap-2">
                            {verified_product.matched_fields.map((field, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                                >
                                    {field.replace(/_/g, ' ')}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Industry Type */}
                    <div className="sm:col-span-2">
                        <div className="text-[11px] uppercase tracking-wide opacity-70 mb-2">Industry Type</div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">
                            <FaBuilding className="text-xs" />
                            {verified_product.type.replace(/_/g, ' ').toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                        <FaCheck />
                        Verification Success
                    </div>
                    <div className="text-green-600 text-sm mt-1">
                        {data.message}
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                    <FaShield className="text-blue-600 mt-0.5" />
                    <div>
                        <div className="font-semibold text-blue-800 mb-1">Food Industry Verification</div>
                        <div className="text-blue-700 text-sm">
                            This establishment has been verified as a legitimate food industry operation
                            registered with the FDA. The license number and establishment details have been
                            confirmed through official database lookup.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
