import { FaShieldAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const NavData = [
    { label: "Home", link: "/" },
    { label: "Products", link: "products" },
    { label: "Batch Verify", link: "batch-verify" },
    { label: "Analytics", link: "analytics" },
    { label: "About", link: "about" },
    { label: "Report", link: "report" },
]

export default function Navbar() {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 font-bold">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-900 rounded">
                        <FaShieldAlt className="text-white text-sm" />
                    </div>
                    <span className="text-lg">FDA Product Checker</span>
                </div>
                <nav className="hidden lg:flex items-center gap-6 text-slate-700">
                    {NavData.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.link}
                            className={({ isActive }) =>
                                `${isActive ? "text-blue-600 font-medium" : "text-gray-400"} hover:text-gray-900 transition-colors`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <button className="hidden sm:inline-flex items-center bg-gray-900 text-white rounded-lg h-9 px-4 text-sm font-medium hover:bg-gray-800 transition-colors">
                    My Bookmarks
                </button>
            </div>
        </header>
    )
}


