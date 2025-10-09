import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Products from './pages/Products.tsx'

const queryClinet = new QueryClient()

const routes = createBrowserRouter([
  {
    path: "/", element: <App />,
    children: [
      { path: "products", element: <Products /> },
      { path: "batch-verify", element: "" },
      { path: "analytics", element: "" },
      { path: "about", element: "" },
      { path: "report", element: "" },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClinet}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  </StrictMode>,
)
