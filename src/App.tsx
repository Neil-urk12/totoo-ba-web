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
