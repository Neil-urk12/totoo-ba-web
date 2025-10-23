import { FaShieldAlt, FaSearch, FaDatabase, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaExternalLinkAlt } from "react-icons/fa";

export default function About() {
    return (
        <section className="min-h-screen" role="main" aria-label="About FDA Product Checker">
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* About Section */}
                <header className="text-center mb-12" role="banner">
                    <div className="flex justify-center mb-6" aria-hidden="true">
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--fg)" }}>
                            <FaShieldAlt className="text-2xl" style={{ color: "var(--bg)" }} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">About FDA Product Checker</h1>
                    <p className="text-lg max-w-3xl mx-auto">
                        Your trusted tool for verifying food and beauty products against official Philippine FDA and business registry databases.
                    </p>
                </header>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-12" aria-hidden="true"></div>

                {/* Mission Section */}
                <section className="mb-16" aria-labelledby="mission-heading">
                    <h2 id="mission-heading" className="text-2xl font-bold mb-6">Our Mission</h2>
                    <div className="space-y-4">
                        <p>
                            FDA Product Checker was created to empower Filipino consumers with the ability to verify the authenticity and compliance of food and beauty products. In an era where counterfeit and unregistered products pose serious health risks, we provide instant access to official government databases.
                        </p>
                        <p>
                            Our platform bridges the gap between consumers and regulatory information, making it easy to check if a product is properly registered with the Food and Drug Administration of the Philippines and if the manufacturer is a legitimate, registered business entity.
                        </p>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="mb-16" aria-labelledby="how-it-works-heading">
                    <h2 id="how-it-works-heading" className="text-2xl font-bold mb-8 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
                        <div className="rounded-xl p-6 text-center bg-card border border-app" role="listitem">
                            <div className="flex justify-center mb-4" aria-hidden="true">
                                <FaSearch className="text-3xl" style={{ color: "var(--muted)" }} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--fg)" }}>1. Search</h3>
                            <p className="text-muted">Enter the product name, brand, or registration number you want to verify.</p>
                        </div>
                        <div className="rounded-xl p-6 text-center bg-card border border-app" role="listitem">
                            <div className="flex justify-center mb-4" aria-hidden="true">
                                <FaDatabase className="text-3xl" style={{ color: "var(--muted)" }} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--fg)" }}>2. Verify</h3>
                            <p className="text-muted">Our AI queries official FDA and business registry databases in real-time.</p>
                        </div>
                        <div className="rounded-xl p-6 text-center bg-card border border-app" role="listitem">
                            <div className="flex justify-center mb-4" aria-hidden="true">
                                <FaCheckCircle className="text-3xl" style={{ color: "var(--muted)" }} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--fg)" }}>3. Analyze</h3>
                            <p className="text-muted">AI matches and normalizes data to provide comprehensive verification results.</p>
                        </div>
                        <div className="rounded-xl p-6 text-center bg-card border border-app" role="listitem">
                            <div className="flex justify-center mb-4" aria-hidden="true">
                                <FaShieldAlt className="text-3xl" style={{ color: "var(--muted)" }} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ color: "var(--fg)" }}>4. Results</h3>
                            <p className="text-muted">Get instant compliance status with detailed registration and business information.</p>
                        </div>
                    </div>
                </section>

                {/* Compliance Badges Section */}
                <section className="mb-16" aria-labelledby="compliance-badges-heading">
                    <h2 id="compliance-badges-heading" className="text-2xl font-bold mb-8">Understanding Compliance Badges</h2>
                    <div className="space-y-4" role="list">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4" role="listitem">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                <FaCheckCircle className="text-white text-sm" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Fully Compliant</h3>
                                <p className="text-gray-700">Product is registered with FDA, registration is current and valid, and the manufacturer is a registered business entity in good standing.</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4" role="listitem">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                <FaExclamationTriangle className="text-white text-sm" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Warning</h3>
                                <p className="text-gray-700">Product may have expired registration, pending renewal, or minor compliance issues. Exercise caution and verify with the manufacturer.</p>
                            </div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4" role="listitem">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                <FaTimesCircle className="text-white text-sm" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Non-Compliant</h3>
                                <p className="text-gray-700">Product is not registered with FDA or manufacturer is not a registered business. Avoid purchasing and report to authorities if suspected counterfeit.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Official Data Sources Section */}
                <section className="mb-16" aria-labelledby="data-sources-heading">
                    <h2 id="data-sources-heading" className="text-2xl font-bold mb-8">Official Data Sources</h2>
                    <div className="rounded-xl p-6 mb-6 bg-card border border-app" role="region" aria-labelledby="fda-portal-heading">
                        <h3 id="fda-portal-heading" className="text-lg font-bold text-gray-900 mb-4" style={{ color: "var(--fg)" }}>FDA Philippines Verification Portal</h3>
                        <p className="text-muted mb-4">
                            We query the official Food and Drug Administration verification portal to check product registration status, registration numbers, expiry dates, and manufacturer information.
                        </p>
                        <a
                            href="https://verification.fda.gov.ph/Home.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            aria-label="Visit FDA Philippines verification portal (opens in new tab)">
                            verification.fda.gov.ph/Businesses <FaExternalLinkAlt className="ml-1 text-xs" />
                        </a>
                    </div>
                    <div className="rounded-xl p-6 bg-card border border-app" role="region" aria-labelledby="business-registry-heading">
                        <h3 id="business-registry-heading" className="text-lg font-bold text-gray-900 mb-4" style={{ color: "var(--fg)" }}>Philippine Business Registry</h3>
                        <p className="text-muted mb-4">
                            We cross-reference manufacturer information with the official Philippine business registry to verify that companies are legitimate, registered business entities.
                        </p>
                        <a
                            href="https://databank.business.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            aria-label="Visit Philippine Business Registry (opens in new tab)"
                        >
                            databank.business.gov.ph <FaExternalLinkAlt className="ml-1 text-xs" />
                        </a>
                    </div>
                </section>

                {/* Important Disclaimer Section */}
                <section className="rounded-xl p-8" style={{ backgroundColor: "#0f172a", color: "#ffffff" }} aria-labelledby="disclaimer-heading">
                    <h2 id="disclaimer-heading" className="text-2xl font-bold mb-6">Important Disclaimer</h2>
                    <div className="space-y-4" style={{ color: "#cbd5e1" }}>
                        <p>
                            FDA Product Checker is an independent verification tool and is not affiliated with or endorsed by the Food and Drug Administration of the Philippines or any government agency.
                        </p>
                        <p>
                            While we strive to provide accurate and up-to-date information by querying official databases, we cannot guarantee the completeness or accuracy of all data. Always verify critical information directly with the FDA Philippines or the manufacturer.
                        </p>
                        <p>
                            This tool is provided for informational purposes only and should not be considered as professional advice. Users are responsible for their own purchasing decisions.
                        </p>
                    </div>
                </section>
            </main>
        </section>
    );
}
