/**
 * Application Entry Point
 * 
 * This is the main entry file for the FDA Product Checker application.
 * It configures the React application with routing, state management,
 * theming, and error handling. All route components are lazy-loaded
 * for optimal performance.
 */

import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import LoadingSpinner from './components/LoadingSpinner'
import RouteLoadingSpinner from './components/RouteLoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import GenericErrorFallback from './components/GenericErrorFallback'

// Lazy load route components for code splitting and improved initial load time
const Products = lazy(() => import('./pages/Products.tsx'))
const About = lazy(() => import('./pages/About.tsx'))
const Analytics = lazy(() => import('./pages/Analytics.tsx'))
const Verify = lazy(() => import('./pages/Verify.tsx'))
const Report = lazy(() => import('./pages/Report.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))
const CommunityReports = lazy(() => import('./pages/CommunityReports.tsx'))

/**
 * React Query Client Configuration
 * 
 * Configures the global React Query client with optimized settings for
 * data fetching, caching, and refetching behavior.
 * 
 * Settings:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - gcTime: 10 minutes - Cached data is kept for 10 minutes before garbage collection
 * - refetchOnWindowFocus: false - Prevents automatic refetch when window regains focus
 * - retry: 1 - Only retry failed requests once for faster error feedback
 * 
 * @constant {QueryClient}
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce unnecessary refetches
      gcTime: 1000 * 60 * 10, // 10 minutes - cache data longer (renamed from cacheTime)
      refetchOnWindowFocus: false, // Disable automatic refetch on window focus
      retry: 1, // Reduce retry attempts for faster failures
    },
  },
})

/**
 * Application Routes Configuration
 * 
 * Defines all application routes using React Router v6.
 * Each route is wrapped with:
 * - Suspense: Shows loading spinner while lazy component loads
 * - ErrorBoundary: Catches and displays errors gracefully
 * 
 * Routes:
 * - / : Homepage with hero, search form, and features
 * - /products : Browse all FDA-registered products
 * - /analytics : View database statistics and analytics
 * - /verify : Verify specific products by registration number or image
 * - /about : Information about the application
 * - /community-reports : View community-submitted reports
 * - /report : Submit a report about a product
 * - * : 404 Not Found page for invalid routes
 * 
 * @constant {Router}
 */
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        path: 'products', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Products />
            </ErrorBoundary>
          </Suspense>
        )
      },
      { 
        path: 'analytics', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Analytics />
            </ErrorBoundary>
          </Suspense>
        )
      },
      { 
        path: 'verify', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Verify />
            </ErrorBoundary>
          </Suspense>
        )
      },
      { 
        path: 'about', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <About />
            </ErrorBoundary>
          </Suspense>
        )
      },
      { 
        path: 'community-reports', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <CommunityReports />
            </ErrorBoundary>
          </Suspense>
        )
      },
      { 
        path: 'report', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <Report />
            </ErrorBoundary>
          </Suspense>
        )
      },
      { 
        path: '*', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <ErrorBoundary fallback={GenericErrorFallback}>
              <NotFound />
            </ErrorBoundary>
          </Suspense>
        )
      },
    ],
  },
])

/**
 * Application Render
 * 
 * Mounts the React application to the DOM with all necessary providers:
 * - StrictMode: Enables additional development checks
 * - QueryClientProvider: Provides React Query functionality
 * - ThemeProvider: Manages light/dark theme switching
 * - ErrorBoundary: Top-level error handling
 * - Suspense: Handles loading states for lazy-loaded components
 * - RouterProvider: Provides routing functionality
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} storageKey="theme" disableTransitionOnChange>
        <ErrorBoundary fallback={GenericErrorFallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={routes} />
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
