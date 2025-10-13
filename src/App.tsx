import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SearchForm from './components/SearchForm'
import Features from './components/Features'
import Notice from './components/Notice'
import Footer from './components/Footer'
import { Outlet, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation();
  const isProductsPage = location.pathname === '/products';
  const isBatchVerify = location.pathname === '/batch-verify';
  const isAnalytics = location.pathname === '/analytics';
  const isAboutPage = location.pathname === '/about';
  const isReport = location.pathname === '/report';

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white dark:text-slate-100 dark:bg-slate-800" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
      <Navbar />
      {!isProductsPage && !isBatchVerify && !isAboutPage && !isAnalytics && !isReport && (
        <main className="px-4">
          <Hero />
          <SearchForm />
          <Features />
          <Notice />
        </main>
      )}
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
