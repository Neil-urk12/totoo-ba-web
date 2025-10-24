/**
 * Hero Component
 * 
 * The main hero section displayed on the homepage. Features a large
 * headline, descriptive text, and key feature badges. Memoized for
 * performance optimization.
 * 
 * Features:
 * - Large, attention-grabbing headline
 * - Descriptive subtitle
 * - Three feature badges with status indicators
 * - Responsive typography (scales on mobile/desktop)
 * - Memoized to prevent unnecessary re-renders
 * 
 * @component
 * @returns {JSX.Element} The hero section of the homepage
 * 
 * @example
 * <Hero />
 */
import { memo } from 'react'

const Hero = memo(function Hero() {
    return (
        <section className="max-w-5xl mx-auto text-center mt-10" role="banner" aria-label="Hero section">
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
});

export default Hero


