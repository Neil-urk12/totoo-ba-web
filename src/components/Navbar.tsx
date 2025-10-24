import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "../hooks/ThemeToggle";

const NavData = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: "Analytics", link: "/analytics" },
    { label: "About", link: "/about" },
    { label: "Report", link: "/report" }
];

export default function Navbar() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 font-bold">
                    <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: "var(--fg)" }}>
                        <ShieldCheck className="text-sm" style={{ color: "var(--bg)" }} />
                    </div>
                    <NavLink to={NavData[0].link} className="text-lg" style={{ color: "var(--fg)" }}>Totoo ba ito?</NavLink>
                </div>
                <nav className="hidden lg:flex items-center gap-6" style={{ color: "var(--muted)" }}>
                    {NavData.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.link}
                            className={({ isActive }) =>
                                `${isActive ? "text-app" : ""} hover:[color:var(--fg)] transition-colors`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        className="inline-flex items-center justify-center lg:hidden w-9 h-9 rounded-md border"
                        style={{ borderColor: "var(--muted)" }}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-20">
                    {/* Backdrop behind the panel */}
                    <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setIsMobileMenuOpen(false)} />
                    {/* Panel */}
                    <div className="absolute inset-x-0 top-0 z-10" style={{ backgroundColor: "var(--bg)" }}>
                        <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 font-bold" style={{ color: "var(--fg)" }}>
                                    <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: "var(--fg)" }}>
                                        <ShieldCheck className="text-sm" style={{ color: "var(--bg)" }} />
                                    </div>
                                    <span className="text-lg">Totoo ba ito?</span>
                                </div>
                                <button
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-md border"
                                    style={{ borderColor: "var(--muted)", color: "var(--fg)" }}
                                    aria-label="Close menu"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <X />
                                </button>
                            </div>
                            <nav className="mt-6 flex flex-col gap-4" style={{ color: "var(--muted)" }}>
                                {NavData.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `text-xl py-2 ${isActive ? "text-app" : ""} hover:[color:var(--fg)] transition-colors`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}


