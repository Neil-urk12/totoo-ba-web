/**
 * Pop-up Error Modal Component
 * 
 * A modal dialog that displays error messages to users. Can be configured
 * to auto-close after a specified delay or remain open until manually closed.
 * 
 * Features:
 * - Modal overlay with backdrop blur
 * - Alert triangle icon
 * - Customizable title and message
 * - Auto-close functionality with configurable delay
 * - Close button (X) in top-right corner
 * - OK button to dismiss
 * - Prevents body scroll when open
 * - Accessible ARIA attributes
 * 
 * @component
 * @param {PopUpErrorProps} props - Component props
 * @returns {JSX.Element | null} Error modal or null if not open
 * 
 * @example
 * <PopUpError
 *   isOpen={isErrorOpen}
 *   onClose={() => setIsErrorOpen(false)}
 *   message="Failed to load data"
 *   autoClose={true}
 *   autoCloseDelay={5000}
 * />
 */
import { useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

/**
 * Props interface for PopUpError component
 * @interface PopUpErrorProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {Function} onClose - Callback to close the modal
 * @property {string} [title] - Optional custom error title (default: "Error")
 * @property {string} message - The error message to display
 * @property {boolean} [autoClose] - Whether to auto-close the modal (default: false)
 * @property {number} [autoCloseDelay] - Delay in ms before auto-closing (default: 5000)
 */
interface PopUpErrorProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message: string
    autoClose?: boolean
    autoCloseDelay?: number
}

export default function PopUpError({
    isOpen,
    onClose,
    title = "Error",
    message,
    autoClose = false,
    autoCloseDelay = 5000
}: PopUpErrorProps) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose()
            }, autoCloseDelay)

            return () => clearTimeout(timer)
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            return () => {
                document.body.style.overflow = 'unset'
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="popup-error-title" aria-describedby="popup-error-message">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 border border-red-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close error popup"
                >
                    <X size={20} aria-hidden="true" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center" aria-hidden="true">
                        <AlertTriangle className="text-red-600" size={20} />
                    </div>
                    <h3 id="popup-error-title" className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                </div>

                <div id="popup-error-message" className="mb-6">
                    <p className="text-gray-700 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}
