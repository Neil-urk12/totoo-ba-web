export default function Hero() {
    return (
        <section className="max-w-5xl mx-auto text-center mt-10" role="banner" aria-label="Hero section">
            <div className="inline-flex items-center gap-2 px-3 py-1 border rounded-full bg-card shadow-sm text-sm border-app" style={{ color: "var(--muted)" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--muted)" }}></span>
                Class A FDA Philippines Verification
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mt-4 whitespace-pre-line">
                {`Verify Product\nSafety in Seconds`}
            </h1>
            <p className="text-muted max-w-3xl mx-auto text-lg mt-3">
                Instantly check if food and beauty products are FDA-registered and verify business legitimacy.
                Protect yourself from counterfeit and unregistered products.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <li className="px-3 py-2 rounded-full border bg-card text-sm border-app" style={{ color: "var(--muted)" }}>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    Real-time FDA Database
                </li>
                <li className="px-3 py-2 rounded-full border bg-card text-sm border-app" style={{ color: "var(--muted)" }}>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    Business Registry Check
                </li>
                <li className="px-3 py-2 rounded-full border bg-card text-sm border-app" style={{ color: "var(--muted)" }}>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    AI-Powered Matching
                </li>
            </ul>
        </section>
    )
}


