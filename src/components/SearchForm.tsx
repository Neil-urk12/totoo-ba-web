import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostVerifyImage } from '../query/post/usePostVerifyImage'
import { FaCamera, FaSearch } from "react-icons/fa";
import PopUpError from './PopUpError';

export default function SearchForm() {
    const [query, setQuery] = useState('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [category, setCategory] = useState('All Categories')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [searchMethod, setSearchMethod] = useState<'text' | 'image'>('text')
    const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    })
    const navigate = useNavigate()
    const verifyImageMutation = usePostVerifyImage()

    const showError = (message: string) => {
        setErrorPopup({ isOpen: true, message })
    }

    const closeError = () => {
        setErrorPopup({ isOpen: false, message: '' })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Handle image verification
        if (searchMethod === 'image') {
            if (!selectedFile) {
                showError('Please select an image to verify')
                return
            }
            try {
                setIsUploading(true)
                const result = await verifyImageMutation.mutateAsync(selectedFile)
                // Navigate to verify page with image verification results
                navigate('/verify', { state: { imageVerificationResult: result } })
            } catch (error) {
                console.error('Image verification failed:', error)
                const errorMessage = error instanceof Error ? error.message : 'Image verification failed. Please try again.'
                showError(`Image verification failed: ${errorMessage}`)
            } finally {
                setIsUploading(false)
            }
            return
        }

        // Handle text search
        try {
            setIsSubmitting(true)
            const q = query.trim()
            if (!q) {
                showError('Please enter a search query')
                return
            }

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
        <section className="flex justify-center" role="region" aria-labelledby="search-form-title">
            <form onSubmit={onSubmit} className="w-full max-w-3xl border rounded-xl shadow-sm p-5 my-6 bg-card border-app" role="search" aria-label="Product verification search">
                {/* Method Toggle */}
                <div className="mb-6">
                    <h2 id="search-form-title" className="text-sm font-semibold mb-3 block">Verification Method</h2>
                    <div className="flex bg-app rounded-lg p-1" role="tablist" aria-label="Verification method options">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchMethod('text')
                                setSelectedFile(null)
                            }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${searchMethod === 'text'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            role="tab"
                            aria-selected={searchMethod === 'text'}
                            aria-controls="text-search-panel"
                        >
                            <FaSearch aria-hidden="true" /> Text Search
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchMethod('image')
                                setQuery('')
                            }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${searchMethod === 'image'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            role="tab"
                            aria-selected={searchMethod === 'image'}
                            aria-controls="image-upload-panel"
                        >
                            <FaCamera aria-hidden="true" /> Image Upload
                        </button>
                    </div>
                </div>

                {/* Image Upload Section */}
                {searchMethod === 'image' && (
                    <div id="image-upload-panel" className="mb-6" role="tabpanel" aria-labelledby="image-upload-tab">
                        <label htmlFor="image-upload" className="text-sm font-semibold mb-2 block">Upload Product Image</label>
                        <div className="border-2 border-dashed border-app rounded-lg p-6 text-center hover:border-app/70 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <div className="text-4xl mb-2 flex justify-center items-center" aria-hidden="true"><FaCamera /></div>
                                <div className="text-sm font-medium mb-1">
                                    {selectedFile ? selectedFile.name : 'Click to upload product image'}
                                </div>
                                <div className="text-xs text-muted">
                                    Supports WEBP, PNG, JPG formats only
                                </div>
                            </label>
                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                                    aria-label="Remove selected image"
                                >
                                    Remove image
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Text Search Section */}
                {searchMethod === 'text' && (
                    <div id="text-search-panel" role="tabpanel" aria-labelledby="text-search-tab">
                        <label htmlFor="search-input" className="text-sm font-semibold mb-2 block">Search Product or Registration Number</label>
                        <div className="relative mb-4">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 flex justify-center items-center" aria-hidden="true"><FaSearch /></span>
                            <input
                                id="search-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter FDA registration number or product name..."
                                className="w-full h-11 border bg-app text-base rounded-lg pl-9 pr-3 placeholder:text-muted border-app"
                                aria-describedby="search-help-text"
                            />
                        </div>

                        <label htmlFor="category-select" className="text-sm font-semibold mb-2 block">Product Category (Optional)</label>
                        <div className="mb-4">
                            <select
                                id="category-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-56 h-9 border rounded-md bg-app border-app"
                                aria-describedby="category-help-text"
                            >
                                <option value="All Categories">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Cosmetics">Cosmetics</option>
                                <option value="Drugs">Drugs</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={
                        searchMethod === 'text' ? (query.trim().length === 0 || isSubmitting) : (isUploading || !selectedFile)
                    }
                    className="w-full h-12 inline-flex items-center justify-center gap-2 border rounded-lg font-semibold cursor-pointer transition-all duration-300 btn-invert border-app disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={searchMethod === 'image' ? (isUploading ? "Analyzing image" : "Verify product image") : (isSubmitting ? "Verifying product" : "Verify product")}
                >
                    {searchMethod === 'image' ? (
                        isUploading ? "Analyzing Image..." : "Verify Product Image"
                    ) : (
                        isSubmitting ? "Verifying..." : "Verify Product"
                    )}
                </button>

                <p id="search-help-text" className="text-center text-muted text-sm mt-4">
                    {searchMethod === 'image' ? (
                        "Our AI will analyze the product image and match it against FDA databases"
                    ) : (
                        "Our system checks against official FDA Philippines and Business Registry databases"
                    )}
                </p>
            </form>

            {/* Error Popup */}
            <PopUpError
                isOpen={errorPopup.isOpen}
                onClose={closeError}
                message={errorPopup.message}
                autoClose={true}
                autoCloseDelay={5000}
            />
        </section>
    )
}


