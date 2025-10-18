export default function Footer() {
    return (
        <footer className="border-t mt-10 border-app">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm">
                <p className="text-muted">&copy; 2025 FDA Product Checker. Data sourced from official government databases.</p>
                <nav className="flex gap-4">
                    <a href="https://verification.fda.gov.ph/Home.php" target="_blank" className="hover:underline">FDA Philippines</a>
                    <a href="https://databank.business.gov.ph/" target="_blank" className="hover:underline">Business Registry</a>
                </nav>
            </div>
        </footer>
    )
}


