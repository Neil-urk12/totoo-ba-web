import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchTracking } from '../hooks/useSearchTracking'

export default function SearchForm() {
    const [query, setQuery] = useState('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [category, setCategory] = useState('All Categories')
    const navigate = useNavigate()
    const { incrementSearchCount } = useSearchTracking()

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            const q = query.trim()
            if (!q) return

            // Increment search count when user submits a search
            incrementSearchCount()

            // Build search URL with query and category parameters
            const searchParams = new URLSearchParams()
            searchParams.set('q', q)

            // Only add category if it's not "All Categories"
            if (category && category !== 'All Categories') {
                searchParams.set('category', category)
            }

            navigate(`/verify?${searchParams.toString()}`)
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="flex justify-center">
            <form onSubmit={onSubmit} className="w-full max-w-3xl border rounded-xl shadow-sm p-5 my-6 bg-card border-app">
                <label className="text-sm font-semibold mb-2 block">Search Product or Registration Number</label>
                <div className="relative mb-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔎</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter FDA registration number..."
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
                        <option value="All Categories">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Cosmetics">Cosmetics</option>
                        <option value="Drugs">Drugs</option>
                    </select>
                </div>
                {query.length == 0 ? <button type="submit" disabled className="w-full h-12 inline-flex items-center justify-center gap-2 border rounded-lg font-semibold cursor-pointer transition-all duration-300 btn-invert border-app">
                    Verify Product
                </button> : <button type="submit" className="w-full h-12 inline-flex items-center justify-center gap-2 border rounded-lg font-semibold cursor-pointer transition-all duration-300 btn-invert border-app">
                    {isSubmitting ? "Verifying..." : "Verify Product"}
                </button>
                }

                <p className="text-center text-muted text-sm mt-4">Our system checks against official FDA Philippines and Business Registry databases</p>
            </form>
        </section>
    )
}


