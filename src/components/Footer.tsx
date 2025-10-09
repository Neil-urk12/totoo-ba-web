export default function Footer() {
    return (
        <footer className="border-t mt-10">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm">
                <p className="text-slate-600">&copy; 2025 FDA Product Checker. Data sourced from official government databases.</p>
                <nav className="flex gap-4">
                    <a href="#" className="hover:underline">FDA Philippines</a>
                    <a href="#" className="hover:underline">Business Registry</a>
                </nav>
            </div>
        </footer>
    )
}


