/**
 * Footer Component
 * 
 * Application footer displaying copyright information and external links
 * to official government resources (FDA Philippines and Business Registry).
 * 
 * Features:
 * - Copyright notice
 * - External links with proper accessibility attributes
 * - Responsive layout
 * - ARIA labels for screen readers
 * 
 * @component
 * @returns {JSX.Element} The application footer
 * 
 * @example
 * <Footer />
 */
export default function Footer() {
    return (
        <footer className="border-t mt-10 border-app" role="contentinfo">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm">
                <p className="text-muted">&copy; 2025 FDA Product Checker. Data sourced from official government databases.</p>
                <nav className="flex gap-4" aria-label="External links">
                    <a href="https://verification.fda.gov.ph/Home.php" target="_blank" className="hover:underline" aria-label="FDA Philippines verification portal (opens in new tab)">FDA Philippines</a>
                    <a href="https://databank.business.gov.ph/" target="_blank" className="hover:underline" aria-label="Philippine Business Registry (opens in new tab)">Business Registry</a>
                </nav>
            </div>
        </footer>
    )
}


