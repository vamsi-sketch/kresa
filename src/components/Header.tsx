import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    customer,
    isAdmin,
    openCategory,
    setSearchQuery,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('shop');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', action: () => setCurrentView('home'), active: currentView === 'home' },
    { label: 'Jewellery', action: () => openCategory('Fashion Jewellery'), active: false },
    { label: 'Women Clothes', action: () => openCategory('Women Clothes'), active: false },
    { label: 'Accessories', action: () => openCategory('Accessories'), active: false },
    { label: 'Decoration', action: () => openCategory('Decoration Items'), active: false },
    { label: 'Shop All', action: () => { openCategory('All'); setCurrentView('shop'); }, active: currentView === 'shop' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D6] transition-all">
      {/* Slim Promotional Announcement Banner (<=40px, dismissible) */}
      {announcementVisible && (
        <div className="bg-[#1C1917] text-[#EFE7DA] text-xs py-2 px-4 flex items-center justify-between text-center tracking-wide">
          <div className="flex-1 text-center font-normal">
            <span>Complimentary Express Delivery on orders above ₹1,999</span>
            <span className="hidden md:inline mx-2 text-[#C9A86A]">·</span>
            <span className="hidden md:inline text-[#D4AF37]">Authentic Handcrafted Luxury</span>
          </div>
          <button
            onClick={() => setAnnouncementVisible(false)}
            aria-label="Dismiss banner"
            className="text-stone-400 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-6 text links) - Zone 3 (Primary actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single element wordmark in display face */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-950 focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#1C1917] hover:text-[#9E7B36] transition-colors uppercase font-medium focus:outline-none"
          >
            KRESA
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider text-stone-700">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
              }}
              className={`hover:text-[#9E7B36] transition-colors py-1 relative ${
                item.active ? 'text-[#9E7B36] font-semibold' : ''
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9E7B36]" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions & affordances */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-stone-700">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search collection"
            className="p-1.5 hover:text-[#9E7B36] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setCurrentView('account')}
            aria-label="Wishlist"
            className="p-1.5 hover:text-[#9E7B36] transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9E7B36] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag */}
          <button
            onClick={() => setCurrentView('cart')}
            aria-label="Shopping Cart"
            className="p-1.5 hover:text-[#9E7B36] transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1C1917] text-[#FAF8F5] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Account / Sign In */}
          <button
            onClick={() => setCurrentView('account')}
            aria-label="Account"
            className="p-1.5 hover:text-[#9E7B36] transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <UserIcon className="w-5 h-5" />
            <span className="hidden md:inline">
              {customer ? customer.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Admin Dashboard Entry Point */}
          <button
            onClick={() => setCurrentView('admin')}
            title="Owner & Boutique Admin Panel"
            className={`px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-[#1C1917] text-[#D4AF37] border-[#9E7B36]'
                : 'text-stone-500 border-stone-300 hover:border-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">{isAdmin ? 'Admin' : 'Owner'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="bg-[#FAF8F5] border-t border-[#EAE3D6] px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search jewellery, sarees, accessories, candles..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-sm focus:outline-none border-b border-[#D4AF37] pb-1"
            />
            <button
              type="submit"
              className="bg-[#1C1917] text-[#FAF8F5] px-4 py-1.5 text-xs uppercase tracking-wider font-medium hover:bg-[#9E7B36] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-stone-400 hover:text-stone-700 text-sm px-1"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] p-6 shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE3D6]">
                <span className="text-xl font-serif tracking-[0.2em] font-medium text-stone-900">
                  KRESA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                {navLinks.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-base font-medium text-stone-800 hover:text-[#9E7B36] transition-colors py-2 border-b border-stone-100"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3D6] space-y-3">
              <button
                onClick={() => {
                  setCurrentView('account');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-medium border border-stone-300 text-stone-800 rounded hover:bg-stone-100 transition-colors"
              >
                {customer ? `Signed in as ${customer.name}` : 'Customer Sign In'}
              </button>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-mono tracking-wider text-stone-600 hover:text-stone-900"
              >
                Owner / Admin Console
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
