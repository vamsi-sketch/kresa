import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryCards } from './components/CategoryCards';
import { FeaturedCollection } from './components/FeaturedCollection';
import { BrandStory } from './components/BrandStory';
import { ShopPage } from './components/ShopPage';
import { ProductPage } from './components/ProductPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { CustomerAccountPage } from './components/CustomerAccountPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toast, hideToast } = useShop();

  // If in dedicated admin mode, render the AdminDashboard
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F5F0]">
        <AdminDashboard />
        {/* Global Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1C1917] text-[#FAF8F5] border border-[#C9A86A] px-4 py-3 shadow-2xl rounded text-xs animate-in fade-in slide-in-from-bottom-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#C9A86A] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-stone-300 shrink-0" />
            )}
            <span className="font-medium tracking-wide">{toast.message}</span>
            <button onClick={hideToast} className="ml-2 text-stone-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Customer Storefront Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1F1C18]">
      <Header />

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero />
            <CategoryCards />
            <FeaturedCollection />
            <BrandStory />
          </>
        )}

        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product' && <ProductPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'account' && <CustomerAccountPage />}
      </main>

      <Footer />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1C1917] text-[#FAF8F5] border border-[#C9A86A] px-4 py-3 shadow-2xl rounded text-xs animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#C9A86A] shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-stone-300 shrink-0" />
          )}
          <span className="font-medium tracking-wide">{toast.message}</span>
          <button onClick={hideToast} className="ml-2 text-stone-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
