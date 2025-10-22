import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import LoadingSpinner from './components/LoadingSpinner'

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
      { path: 'products', element: <Products /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'verify', element: <Verify /> },
      { path: 'about', element: <About /> },
      { path: 'report', element: <Report /> },
      { path: '*', element: <NotFound /> },
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
