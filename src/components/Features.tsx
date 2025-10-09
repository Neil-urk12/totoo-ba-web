import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";
import { PiLightning } from "react-icons/pi";
import { IoIosWarning } from "react-icons/io";

const items = [
    {
        title: 'FDA Registration Verification',
        desc: 'Instantly verify if products are registered with FDA Philippines and check registration validity.',
        icon: <IoShieldCheckmarkOutline />,
    },
    {
        title: 'Business Legitimacy Check',
        desc: 'Cross-reference with the official Business Name Registry to confirm manufacturer legitimacy.',
        icon: <FaRegBuilding />,
    },
    {
        title: 'AI-Powered Matching',
        desc: 'Advanced AI algorithms match and normalize data across multiple databases for accurate results.',
        icon: <PiLightning />,
    },
    {
        title: 'Counterfeit Detection',
        desc: 'Get instant warnings about unregistered products and suspicious business entities.',
        icon: <IoIosWarning />,
    },
]

export default function Features() {
    return (
        <section className="px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold mt-6 mb-2">Comprehensive Product Verification</h2>
            <p className="text-center text-slate-600 max-w-3xl mx-auto mb-6">
                Protect yourself and your family with real-time verification against official government databases
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
                {items.map((i) => (
                    <div key={i.title} className="flex gap-4 border rounded-xl p-5 bg-white shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">{i.icon}</div>
                        <div>
                            <h3 className="m-0 mb-1 text-lg font-semibold">{i.title}</h3>
                            <p className="m-0 text-slate-600">{i.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}


