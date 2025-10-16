import { FaShieldAlt } from "react-icons/fa";
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

    return (
        <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 font-bold">
                    <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: "var(--fg)" }}>
                        <FaShieldAlt className="text-sm" style={{ color: "var(--bg)" }} />
                    </div>
                    <NavLink to={NavData[0].link} className="text-lg" style={{ color: "var(--fg)" }}>Totoo ba ito ?</NavLink>
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
                    <button className="hidden sm:inline-flex items-center rounded-lg h-9 px-4 text-sm font-medium transition-colors" style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}>
                        My Bookmarks
                    </button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}


