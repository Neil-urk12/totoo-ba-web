import { useEffect } from 'react'
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa'

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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 border border-red-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes size={20} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FaExclamationTriangle className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                </div>

                <div className="mb-6">
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
