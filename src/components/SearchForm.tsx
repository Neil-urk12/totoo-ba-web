/**
 * Search Form Component
 * 
 * The main product verification form on the homepage. Supports two verification
 * methods: text search (by registration number or product name) and image upload
 * (AI-powered image verification).
 * 
 * Features:
 * - Dual verification methods (text search and image upload)
 * - Category filtering for text search
 * - Image file upload with preview
 * - Loading states for both methods
 * - Error handling with popup notifications
 * - Form validation
 * - Navigation to verification results page
 * - Accessible ARIA attributes
 * 
 * @component
 * @returns {JSX.Element} The product verification search form
 * 
 * @example
 * <SearchForm />
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostVerifyImage } from '../query/post/usePostVerifyImage'
import { Camera, Search } from "lucide-react";
import PopUpError from './PopUpError';
import ImageVerificationLoader from './ImageVerificationLoader';

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

    /**
     * Shows an error popup with the specified message
     * @param {string} message - The error message to display
     * @returns {void}
     */
    const showError = (message: string) => {
        setErrorPopup({ isOpen: true, message })
    }

    /**
     * Closes the error popup
     * @returns {void}
     */
    const closeError = () => {
        setErrorPopup({ isOpen: false, message: '' })
    }

    /**
     * Handles file input change event
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     * @returns {void}
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    /**
     * Handles form submission for both text and image verification
     * Routes to appropriate verification endpoint with search parameters
     * @param {React.FormEvent} e - The form submit event
     * @returns {Promise<void>}
     */
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
                
                await new Promise(resolve => setTimeout(resolve, 100))
                
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
            {/* Loading Visualizer */}
            {isUploading && <ImageVerificationLoader />}

            <form onSubmit={onSubmit} className="w-full max-w-3xl border rounded-xl shadow-sm p-5 my-6 bg-card border-app" role="search" aria-label="Product verification search">
                {/* Method Toggle */}
                <div className="mb-6">
                    <h2 id="search-form-title" className="text-sm font-semibold mb-3 block">Verification Method</h2>
                    <div className="flex w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800" role="tablist" aria-label="Verification method options">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchMethod('text')
                                setSelectedFile(null)
                            }}
                            className={`flex-1 py-2.5 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 ${searchMethod === 'text'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            role="tab"
                            aria-selected={searchMethod === 'text'}
                            aria-controls="text-search-panel"
                        >
                            <Search size={18} aria-hidden="true" /> Text Search
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchMethod('image')
                                setQuery('')
                            }}
                            className={`flex-1 py-2.5 px-6 text-sm font-medium transition-all flex items-center justify-center gap-2 border-l border-gray-300 dark:border-gray-600 ${searchMethod === 'image'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            role="tab"
                            aria-selected={searchMethod === 'image'}
                            aria-controls="image-upload-panel"
                        >
                            <Camera size={18} aria-hidden="true" /> Image Upload
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
                                <div className="text-4xl mb-2 flex justify-center items-center" aria-hidden="true"><Camera /></div>
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
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 flex justify-center items-center" aria-hidden="true"><Search /></span>
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


