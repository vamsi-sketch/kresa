import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, Heart, MapPin, LogOut, ArrowRight, Clock, Star, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, Product } from '../types';
import { api } from '../services/api';
import { formatPrice, formatDate } from '../utils/format';
import { ProductCard } from './ProductCard';
import { INITIAL_PRODUCTS } from '../data/initialData';

export const CustomerAccountPage: React.FC = () => {
  const {
    customer,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    wishlist,
    openProduct,
    setCurrentView,
    setLastCompletedOrder,
  } = useShop();

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard tab state
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>('orders');
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    api.getProducts().then((res) => {
      if (res.products) setAllProducts(res.products);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (customer) {
      setLoadingOrders(true);
      api.getMyOrders()
        .then((res) => {
          setMyOrders(res.orders || []);
        })
        .catch(() => {
          setMyOrders([]);
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [customer]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        await loginCustomer({ email, password });
      } else {
        await registerCustomer({ name, email, phone, password });
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If customer is not authenticated, show elegant Login / Sign Up portal
  if (!customer) {
    return (
      <div className="bg-[#FAF8F5] py-16 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-[#F5EFE6] border border-[#EAE3D6] p-8 shadow-sm">
          
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
              Clientèle Lounge
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mt-1">
              {authMode === 'login' ? 'Customer Sign In' : 'Create KRESA Account'}
            </h1>
            <p className="text-xs text-stone-500 mt-2 font-light">
              Access your bespoke orders, curated wishlist, and VIP invitations.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-[#EAE3D6] mb-6">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-medium text-center transition-colors cursor-pointer ${
                authMode === 'login'
                  ? 'border-b-2 border-[#1C1917] text-[#1C1917] font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-medium text-center transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'border-b-2 border-[#1C1917] text-[#1C1917] font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Register
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maharani Gayatri"
                  className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@kresa.com"
                className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 00000"
                  className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Account' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className="mt-6 pt-4 border-t border-[#EAE3D6] text-center text-[11px] text-stone-500 font-light">
            <p>Demo Customer: <code className="font-mono text-stone-800">ananya.sharma@example.com</code> / <code className="font-mono text-stone-800">customer123</code></p>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Customer Dashboard
  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAF8F5] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Customer Header Banner */}
        <div className="bg-[#F5EFE6] border border-[#EAE3D6] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9E7B36] font-medium">
              Clientèle Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mt-1">
              Welcome, {customer.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1 font-mono">
              {customer.email} {customer.phone ? `· ${customer.phone}` : ''}
            </p>
          </div>

          <button
            onClick={logoutCustomer}
            className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 hover:border-stone-800 text-stone-700 hover:text-stone-900 text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 cols) */}
          <aside className="md:col-span-3 bg-white border border-[#EAE3D6] divide-y divide-[#EAE3D6]">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#F5EFE6] text-[#9E7B36] font-bold border-l-3 border-[#9E7B36]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </span>
              <span className="font-mono text-stone-400 tabular-nums">({myOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'wishlist' ? 'bg-[#F5EFE6] text-[#9E7B36] font-bold border-l-3 border-[#9E7B36]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </span>
              <span className="font-mono text-stone-400 tabular-nums">({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'addresses' ? 'bg-[#F5EFE6] text-[#9E7B36] font-bold border-l-3 border-[#9E7B36]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#F5EFE6] text-[#9E7B36] font-bold border-l-3 border-[#9E7B36]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <UserIcon className="w-4 h-4" />
                <span>Profile Details</span>
              </span>
            </button>
          </aside>

          {/* Tab Content Display (9 cols) */}
          <main className="md:col-span-9 bg-white border border-[#EAE3D6] p-6 sm:p-8 min-h-[400px]">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                  Order History & Status
                </h2>

                {loadingOrders ? (
                  <div className="py-16 text-center text-xs text-stone-500 font-mono">Loading orders...</div>
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="font-serif text-base text-stone-800">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => setCurrentView('shop')}
                      className="mt-4 px-6 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider"
                    >
                      Browse Boutique
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#FAF8F5] border border-[#EAE3D6] p-6 transition-all hover:border-[#9E7B36]/60"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE3D6] gap-2">
                          <div>
                            <span className="text-[11px] font-mono uppercase text-stone-500">Order ID:</span>{' '}
                            <strong className="text-xs font-mono font-bold text-stone-900 tracking-wider">
                              {ord.id}
                            </strong>
                            <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                              Placed on {formatDate(ord.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-[#1C1917] text-[#D4AF37]'
                              }`}
                            >
                              {ord.status}
                            </span>
                            <button
                              onClick={() => {
                                setLastCompletedOrder(ord);
                                setCurrentView('order-confirmation');
                              }}
                              className="text-xs text-stone-800 underline hover:text-[#9E7B36] font-medium"
                            >
                              View Tracker
                            </button>
                          </div>
                        </div>

                        {/* Items in this order */}
                        <div className="py-4 space-y-3">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-12 bg-white border border-stone-200 overflow-hidden shrink-0">
                                  <img
                                    src={it.image}
                                    alt={it.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-serif font-medium text-stone-900">{it.name}</h4>
                                  <p className="text-[10px] text-stone-500">
                                    Qty: {it.quantity} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono font-medium text-stone-800 tabular-nums">
                                {formatPrice(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="pt-3 border-t border-[#EAE3D6] flex justify-between items-center text-xs">
                          <span className="text-stone-500">
                            Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                          </span>
                          <span className="font-bold text-stone-900 text-sm font-sans tabular-nums">
                            Total: {formatPrice(ord.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                  Saved Wishlist ({wishlistedProducts.length})
                </h2>

                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="font-serif text-base text-stone-800">Your wishlist is currently empty.</p>
                    <button
                      onClick={() => setCurrentView('shop')}
                      className="mt-4 px-6 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider"
                    >
                      Explore Boutique
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                  Saved Delivery Addresses
                </h2>

                <div className="space-y-4">
                  {customer.savedAddresses && customer.savedAddresses.length > 0 ? (
                    customer.savedAddresses.map((addr, idx) => (
                      <div key={idx} className="p-4 bg-[#FAF8F5] border border-[#EAE3D6] flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 bg-[#1C1917] text-[#D4AF37] text-[10px] uppercase font-mono tracking-wider">
                            {addr.label || 'Home'}
                          </span>
                          <p className="text-sm font-medium text-stone-900 mt-2">{customer.name}</p>
                          <p className="text-xs text-stone-600 font-light mt-0.5">{addr.street}</p>
                          <p className="text-xs text-stone-600 font-light">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-xs text-stone-500 font-mono mt-1">Phone: {customer.phone}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-stone-500 text-xs py-8 text-center bg-[#FAF8F5] p-6 border border-stone-200">
                      No saved addresses yet. Addresses are automatically saved upon your first checkout.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-[#EAE3D6] mb-6">
                  Personal Information
                </h2>

                <div className="space-y-4 text-xs max-w-md">
                  <div>
                    <span className="text-stone-500 uppercase font-medium">Full Name:</span>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">{customer.name}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 uppercase font-medium">Email:</span>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5 font-mono">{customer.email}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 uppercase font-medium">Contact Phone:</span>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5 font-mono">{customer.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 uppercase font-medium">Account Created:</span>
                    <p className="text-sm text-stone-700 mt-0.5">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
