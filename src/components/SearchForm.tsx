import { useState } from 'react'

export default function SearchForm() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All Categories')

    return (
        <section className="flex justify-center">
            <div className="w-full max-w-3xl border rounded-xl shadow-sm p-5 my-6 bg-card border-app">
                <label className="text-sm font-semibold mb-2 block">Search Product or Registration Number</label>
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔎</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter product name, brand, or FDA registration number..."
                        className="w-full h-11 border bg-app text-base rounded-lg pl-9 pr-3 placeholder:text-muted border-app"
                    />
                </div>

                <label className="text-sm font-semibold mb-2 block">Product Category (Optional)</label>
                <div className="mb-4">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-56 h-9 border rounded-md bg-app border-app"
                    >
                        <option>All Categories</option>
                        <option>Food</option>
                        <option>Cosmetics</option>
                        <option>Drugs</option>
                        <option>Devices</option>
                    </select>
                </div>

                <button className="w-full h-12 inline-flex items-center justify-center gap-2 border rounded-lg font-semibold cursor-pointer transition-all duration-300 btn-invert border-app">
                    Verify Product
                </button>

                <p className="text-center text-muted text-sm mt-4">Our system checks against official FDA Philippines and Business Registry databases</p>
            </div>
        </section>
    )
}


