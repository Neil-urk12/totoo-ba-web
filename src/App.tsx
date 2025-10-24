import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SearchForm from './components/SearchForm'
import Features from './components/Features'
import Notice from './components/Notice'
import Footer from './components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import GenericErrorFallback from './components/GenericErrorFallback'

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white dark:text-slate-100 dark:bg-slate-800" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }} role="document">
      <Navbar />
      {isHomePage && (
        <main className="px-4" role="main">
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
