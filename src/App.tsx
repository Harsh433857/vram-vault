import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPanel } from './components/AdminPanel';
import { useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryTabs } from './components/CategoryTabs';
import { FilterBar } from './components/FilterBar';
import { GPUCard } from './components/GPUCard';
import { GPUDetailModal } from './components/GPUDetailModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DeskShowcaseModal } from './components/DeskShowcaseModal';
import { PSUCalculatorModal } from './components/PSUCalculatorModal';
import { AuthModal } from './components/AuthModal';
import { OrdersModal } from './components/OrdersModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';
import { Layers, RotateCcw, Sparkles } from 'lucide-react';
import { CATEGORY_METADATA } from './data/metadata';

export const App: React.FC = () => {
  const { filteredProducts, filters, resetFilters } = useShop();

  const currentCategoryInfo =
    CATEGORY_METADATA[filters.category] || CATEGORY_METADATA['all'];

  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
            MAIN STOREFRONT ROUTE
        ========================================= */}
        <Route path="/" element={
          <div className="relative min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300 overflow-hidden">
            
            {/* --- GLOBAL ANIMATED BACKGROUND MESH --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] bg-cyan-500/20 rounded-full blur-[90px] animate-mesh-drift" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-purple-600/20 rounded-full blur-[90px] animate-mesh-drift-slow" />
              <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-blue-600/15 rounded-full blur-[80px] animate-mesh-drift" style={{ animationDelay: '5s' }} />
            </div>

            {/* --- INTERACTIVE PARTICLE CANVAS --- */}
            <ParticleBackground />

            {/* --- CONTENT WRAPPER --- */}
            <div className="relative z-10 flex flex-col min-h-screen">
              
              {/* Top Navigation */}
              <Navbar />

              {/* Hero Showcase */}
              <HeroBanner />

              {/* Main Catalog Section */}
              <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                
                {/* Category Header & Info */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold tracking-wider mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>{currentCategoryInfo.tag}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {currentCategoryInfo.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {currentCategoryInfo.subtitle}
                    </p>
                  </div>
                </div>

                {/* Category Selection Tabs */}
                <CategoryTabs />

                {/* Filter Controls */}
                <FilterBar />

                {/* Product Cards Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="py-20 text-center bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
                      <Layers className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">No Matching Graphics Cards</h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        No cards match your current combination of filters and search keywords.
                      </p>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-cyan-400 rounded-xl border border-slate-700 inline-flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <GPUCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

              </main>

              {/* Global Modals & Drawers */}
              <GPUDetailModal />
              <CompareModal />
              <CartDrawer />
              <CheckoutModal />
              <DeskShowcaseModal />
              <PSUCalculatorModal />
              <AuthModal />
              <OrdersModal />

              {/* Toast Notification Container */}
              <ToastContainer />

              {/* Footer */}
              <Footer />
              
            </div>
          </div>
        } />

        {/* =========================================
            ADMIN ROUTE
        ========================================= */}
        <Route path="/admin" element={<AdminPanel />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;