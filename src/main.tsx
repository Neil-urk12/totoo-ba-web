import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import LoadingSpinner from './components/LoadingSpinner'
import RouteLoadingSpinner from './components/RouteLoadingSpinner'

// Lazy load route components
const Products = lazy(() => import('./pages/Products.tsx'))
const About = lazy(() => import('./pages/About.tsx'))
const Analytics = lazy(() => import('./pages/Analytics.tsx'))
const Verify = lazy(() => import('./pages/Verify.tsx'))
const Report = lazy(() => import('./pages/Report.tsx'))
const NotFound = lazy(() => import('./pages/NotFound.tsx'))

const queryClient = new QueryClient()

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        path: 'products', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Products />
          </Suspense>
        )
      },
      { 
        path: 'analytics', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Analytics />
          </Suspense>
        )
      },
      { 
        path: 'verify', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Verify />
          </Suspense>
        )
      },
      { 
        path: 'about', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <About />
          </Suspense>
        )
      },
      { 
        path: 'report', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <Report />
          </Suspense>
        )
      },
      { 
        path: '*', 
        element: (
          <Suspense fallback={<RouteLoadingSpinner />}>
            <NotFound />
          </Suspense>
        )
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} storageKey="theme" disableTransitionOnChange>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={routes} />
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
