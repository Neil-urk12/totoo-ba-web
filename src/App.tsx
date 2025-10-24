/**
 * Main Application Component
 * 
 * This is the root component of the FDA Product Checker application.
 * It provides the main layout structure including navigation, content area,
 * and footer. It also handles conditional rendering of homepage components
 * and implements lazy loading for performance optimization.
 */

import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import GenericErrorFallback from './components/GenericErrorFallback'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load homepage components to reduce initial bundle size
const Hero = lazy(() => import('./components/Hero'))
const SearchForm = lazy(() => import('./components/SearchForm'))
const Features = lazy(() => import('./components/Features'))
const Notice = lazy(() => import('./components/Notice'))

/**
 * App Component
 * 
 * The main application component that serves as the layout wrapper for all pages.
 * It conditionally renders homepage-specific components when on the root path
 * and uses React Router's Outlet for nested routes.
 * 
 * Features:
 * - Responsive layout with flexbox
 * - Dark mode support via CSS variables
 * - Lazy loading of homepage components
 * - Error boundaries for graceful error handling
 * - Suspense boundaries for loading states
 * - Accessibility attributes (ARIA roles)
 * 
 * @component
 * @returns {JSX.Element} The main application layout
 * 
 * @example
 * // Used in main.tsx as the root route component
 * <Route path="/" element={<App />}>
 *   <Route path="products" element={<Products />} />
 *   <Route path="verify" element={<Verify />} />
 * </Route>
 */
function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white dark:text-slate-100 dark:bg-slate-800" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }} role="document">
      <Navbar />
      {isHomePage && (
        <main className="px-4" role="main">
          <Suspense fallback={<LoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Hero />
            </ErrorBoundary>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <SearchForm />
            </ErrorBoundary>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Features />
            </ErrorBoundary>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Notice />
            </ErrorBoundary>
          </Suspense>
        </main>
      )}
      <main role="main">
        <ErrorBoundary fallback={GenericErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

export default App
