import { Link } from 'react-router-dom'
import fdaLogo from '../assets/fda_logo.webp'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4" role="main">
            <div className="max-w-2xl w-full">
                {/* Main Content Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden" role="region" aria-labelledby="not-found-title">
                    {/* 404 Animation */}
                    <div className="relative mb-8" aria-hidden="true">
                        <div className="text-8xl md:text-9xl font-black bg-clip-text bg-gradient-to-r text-red-400 mb-4 animate-pulse" aria-label="Error 404">
                            404
                        </div>
                        <div className="w-24 h-1 bg-red-400 mx-auto rounded-full"></div>
                    </div>

                    {/* Title and Description */}
                    <div className="mb-10">
                        <h1 id="not-found-title" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Oops! Page Not Found
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                            The page you're looking for doesn't exist.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Don't worry, even the best checker sometimes lose their way!
                        </p>
                    </div>

                    {/* FDA Branding */}
                    <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl" role="banner">
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={fdaLogo}
                                alt="FDA Logo"
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                            Totoo ba to ?
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            FDA Product Checker
                        </p>
                    </div>

                    {/* Help Message */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Need help? Check our <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Go to About page">About page</Link> or try searching for products.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
