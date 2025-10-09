export default function Hero() {
    return (
        <section className="max-w-5xl mx-auto text-center mt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 border rounded-full bg-white shadow-sm text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Official FDA Philippines Verification
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mt-4 whitespace-pre-line">
                {`Verify Product\nSafety in Seconds`}
            </h1>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg mt-3">
                Instantly check if food and beauty products are FDA-registered and verify business legitimacy.
                Protect yourself from counterfeit and unregistered products.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <li className="px-3 py-2 rounded-full border bg-slate-50 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    Real-time FDA Database
                </li>
                <li className="px-3 py-2 rounded-full border bg-slate-50 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    Business Registry Check
                </li>
                <li className="px-3 py-2 rounded-full border bg-slate-50 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                    AI-Powered Matching
                </li>
            </ul>
        </section>
    )
}


