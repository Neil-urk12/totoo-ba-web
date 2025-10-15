import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Products from './pages/Products.tsx'
import About from './pages/About.tsx'
import Analytics from './pages/Analytics.tsx'
import { ThemeProvider } from 'next-themes'
import Verify from './pages/Verify.tsx'

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
      { path: 'report', element: <div className='text-center'>Coming soon</div> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} storageKey="theme" disableTransitionOnChange>
        <RouterProvider router={routes} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)