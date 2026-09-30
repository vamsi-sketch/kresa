import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Star,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { AdminStats, Order, Product, Category, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../utils/format';
import { INITIAL_CATEGORIES } from '../../data/initialData';

export const AdminDashboard: React.FC = () => {
  const { isAdmin, adminData, loginAdmin, logoutAdmin, showToast, setCurrentView } = useShop();

  // Admin Login State
  const [loginEmail, setLoginEmail] = useState('admin@kresa.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Section
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'orders' | 'products' | 'categories' | 'customers' | 'settings'
  >('dashboard');

  // Stats & Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals & Forms
  const [orderModal, setOrderModal] = useState<Order | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  
  // Product Add/Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Add/Edit Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Filters & Search
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');

  // Load Admin Data
  const loadDashboardData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, categoriesRes, customersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getProducts(),
        api.getCategories(),
        api.getAdminCustomers(),
      ]);

      setStats(statsRes);
      setOrders(ordersRes.orders || []);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || INITIAL_CATEGORIES);
      setCustomers(customersRes.customers || []);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  // Handle Admin Login Submission
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginAdmin({ email: loginEmail, password: loginPassword });
    } catch (err: any) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Image Upload directly from device
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCategory: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const uploadRes = await api.uploadImage(base64, file.name.split('.')[0]);
        if (uploadRes.success) {
          showToast('Image uploaded successfully from device!');
          if (isCategory) {
            setEditingCategory((prev) => ({ ...prev, image: uploadRes.url }));
          } else {
            setEditingProduct((prev) => ({
              ...prev,
              images: [...(prev?.images || []), uploadRes.url],
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast('Image upload failed: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Status Update Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, statusUpdateNote);
      if (res.success) {
        showToast(`Order ${orderId} status updated to ${newStatus}`);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
        if (orderModal?.id === orderId) {
          setOrderModal(res.order);
        }
        setStatusUpdateNote('');
        loadDashboardData();
      }
    } catch (err: any) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  // Product Save (Add / Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category || !editingProduct?.price) {
      showToast('Name, category, and price are required', 'error');
      return;
    }

    try {
      if (editingProduct.id) {
        // Update existing
        const res = await api.updateProduct(editingProduct.id, editingProduct);
        if (res.success) {
          showToast(`Product "${res.product.name}" updated!`);
          setProducts((prev) => prev.map((p) => (p.id === res.product.id ? res.product : p)));
        }
      } else {
        // Create new
        const res = await api.createProduct(editingProduct);
        if (res.success) {
          showToast(`New product "${res.product.name}" added to boutique!`);
          setProducts((prev) => [res.product, ...prev]);
        }
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to save product: ' + err.message, 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast(`Product "${name}" deleted`, 'info');
        setProducts((prev) => prev.filter((p) => p.id !== id));
        loadDashboardData();
      }
    } catch (err: any) {
      showToast('Failed to delete product: ' + err.message, 'error');
    }
  };

  // Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    try {
      if (editingCategory.id) {
        const res = await api.updateCategory(editingCategory.id, editingCategory);
        if (res.success) {
          showToast(`Category "${res.category.name}" updated`);
          setCategories((prev) => prev.map((c) => (c.id === res.category.id ? res.category : c)));
        }
      } else {
        const res = await api.createCategory(editingCategory);
        if (res.success) {
          showToast(`Category "${res.category.name}" created`);
          setCategories((prev) => [...prev, res.category]);
        }
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      showToast('Failed to save category: ' + err.message, 'error');
    }
  };

  // If Admin is NOT logged in, show secure Owner Authentication Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FAF8F5] p-8 shadow-2xl border-t-4 border-[#C9A86A]">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#9E7B36] font-semibold">
              KRESA Boutique Administration
            </span>
            <h1 className="text-2xl font-serif text-stone-900 mt-1">Authorized Owner Access</h1>
            <p className="text-xs text-stone-500 mt-1">
              Restricted portal. Client data and inventory management.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-white border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? 'Verifying Authorization...' : 'Unlock Owner Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-200 text-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-stone-500 hover:text-stone-900 underline"
            >
              Return to Customer Storefront
            </button>
            <p className="text-[10px] text-stone-400 font-mono mt-2">
              Default credentials: <code className="text-stone-700">admin@kresa.com</code> / <code className="text-stone-700">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Orders & Products
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderFilterStatus === 'All' || o.status === orderFilterStatus;
    const matchSearch =
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchStatus && matchSearch;
  });

  const filteredProducts = products.filter((p) => {
    return (
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col lg:flex-row text-stone-900">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#1C1917] text-[#EFE7DA] flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-xl font-serif tracking-[0.25em] text-[#D4AF37] uppercase font-medium">
                KRESA
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-mono">
                Owner Atelier Suite
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs uppercase tracking-wider font-medium">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left px-3.5 py-3 rounded flex items-center gap-3 transition-colors cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-[#C9A86A] text-[#1C1917] font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full text-left px-3.5 py-3 rounded flex items-center justify-between transition-colors cursor-pointer ${
                activeSection === 'orders'
                  ? 'bg-[#C9A86A] text-[#1C1917] font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </span>
              {stats?.newOrders ? (
                <span className="bg-[#9E7B36] text-white px-2 py-0.5 text-[10px] rounded-full font-mono">
                  {stats.newOrders}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveSection('products')}
              className={`w-full text-left px-3.5 py-3 rounded flex items-center gap-3 transition-colors cursor-pointer ${
                activeSection === 'products'
                  ? 'bg-[#C9A86A] text-[#1C1917] font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveSection('categories')}
              className={`w-full text-left px-3.5 py-3 rounded flex items-center gap-3 transition-colors cursor-pointer ${
                activeSection === 'categories'
                  ? 'bg-[#C9A86A] text-[#1C1917] font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveSection('customers')}
              className={`w-full text-left px-3.5 py-3 rounded flex items-center gap-3 transition-colors cursor-pointer ${
                activeSection === 'customers'
                  ? 'bg-[#C9A86A] text-[#1C1917] font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full text-left px-3.5 py-3 rounded flex items-center gap-3 transition-colors cursor-pointer ${
                activeSection === 'settings'
                  ? 'bg-[#C9A86A] text-[#1C1917] font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer with Storefront link & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={() => setCurrentView('home')}
            className="w-full text-left px-3 py-2 text-xs text-stone-300 hover:text-white hover:bg-stone-800 rounded flex items-center justify-between"
          >
            <span>View Client Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logoutAdmin}
            className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-stone-800 rounded flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D7C9] mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] uppercase tracking-wide capitalize">
              {activeSection} Management
            </h1>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Live updates reflect directly onto customer storefront and checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSection === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'Fashion Jewellery',
                    price: 4999,
                    discountPrice: undefined,
                    description: '',
                    stock: 15,
                    sizes: ['Free Size'],
                    colors: [{ name: 'Gold', hex: '#D4AF37' }],
                    images: [],
                    isFeatured: true,
                    isNewArrival: true,
                  });
                  setProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 rounded shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Add New Product</span>
              </button>
            )}

            {activeSection === 'categories' && (
              <button
                onClick={() => {
                  setEditingCategory({
                    name: '',
                    description: '',
                    image: '',
                  });
                  setCategoryModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#9E7B36] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 rounded shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Add Category</span>
              </button>
            )}

            <button
              onClick={loadDashboardData}
              className="px-3 py-2 bg-white border border-stone-300 text-stone-700 hover:text-stone-900 text-xs rounded"
              title="Refresh Data"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* 1. DASHBOARD OVERVIEW SECTION */}
        {activeSection === 'dashboard' && stats && (
          <div className="space-y-8">
            
            {/* 7 Core KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Total Sales</span>
                <p className="text-xl font-bold text-[#1C1917] font-mono tabular-nums mt-1">
                  {formatPrice(stats.totalSales)}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">↑ +18.4% mo</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Total Orders</span>
                <p className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                  {stats.totalOrders}
                </p>
                <span className="text-[10px] text-stone-400">All time</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">New Orders</span>
                <p className="text-xl font-bold text-[#9E7B36] font-mono tabular-nums mt-1">
                  {stats.newOrders}
                </p>
                <span className="text-[10px] text-amber-700 font-medium">Requires action</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Pending Orders</span>
                <p className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                  {stats.pendingOrders}
                </p>
                <span className="text-[10px] text-stone-500">In fulfillment</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Delivered</span>
                <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                  {stats.deliveredOrders}
                </p>
                <span className="text-[10px] text-stone-400">Completed</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Total Products</span>
                <p className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                  {stats.totalProducts}
                </p>
                <span className="text-[10px] text-stone-400">In catalog</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">Customers</span>
                <p className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-1">
                  {stats.totalCustomers}
                </p>
                <span className="text-[10px] text-stone-400">Active accounts</span>
              </div>
            </div>

            {/* Performance Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sales Overview Bar Chart (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#EAE3D6] p-6 rounded shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-stone-900">
                      Sales & Revenue Performance
                    </h3>
                    <p className="text-xs text-stone-500">Monthly billing overview (INR)</p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#9E7B36]">
                    Total: {formatPrice(stats.totalSales)}
                  </span>
                </div>

                {/* Visual Chart Bars */}
                <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2">
                  {stats.salesByMonth.map((item, idx) => {
                    const maxVal = Math.max(...stats.salesByMonth.map((s) => s.amount));
                    const heightPercent = Math.max(15, Math.round((item.amount / maxVal) * 100));

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono font-medium text-stone-500 group-hover:text-stone-900 tabular-nums">
                          {formatPrice(item.amount)}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[48px] rounded-t transition-all ${
                            idx === stats.salesByMonth.length - 1
                              ? 'bg-[#C9A86A] shadow-sm'
                              : 'bg-stone-300 group-hover:bg-[#1C1917]'
                          }`}
                        />
                        <span className="text-xs font-mono font-semibold text-stone-700">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#EAE3D6] p-6 rounded shadow-xs">
                <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">
                  Category Distribution
                </h3>
                <p className="text-xs text-stone-500 mb-6">Product inventory & volume</p>

                <div className="space-y-4">
                  {stats.categoryDistribution.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-stone-800">{cat.category}</span>
                        <span className="font-mono text-stone-500 tabular-nums">{cat.count} items</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#9E7B36] rounded-full"
                          style={{ width: `${Math.min(100, cat.count * 15)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent Orders Quick Table */}
            <div className="bg-white border border-[#EAE3D6] p-6 rounded shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveSection('orders')}
                  className="text-xs text-[#9E7B36] hover:underline font-medium"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-stone-600 font-mono uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-light">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-mono font-bold text-stone-900">{ord.id}</td>
                        <td className="py-3 px-3 font-medium text-stone-800">{ord.customerName}</td>
                        <td className="py-3 px-3">{ord.items.length} items</td>
                        <td className="py-3 px-3 font-mono font-semibold tabular-nums">{formatPrice(ord.total)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-stone-100 text-stone-800">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-500 font-mono text-[11px]">{formatDate(ord.createdAt)}</td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => setOrderModal(ord)}
                            className="text-[#9E7B36] hover:underline font-medium"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. ORDERS MANAGEMENT SECTION */}
        {activeSection === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white border border-[#EAE3D6] p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 text-xs pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-[#9E7B36] rounded"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs uppercase font-medium text-stone-500">Filter Status:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="bg-white border border-stone-300 text-xs px-3 py-2 rounded focus:outline-none"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#EAE3D6] rounded shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-stone-700 font-mono uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Ordered Products</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4">Order Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-stone-400">
                          No orders match the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-stone-900">{ord.id}</td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-stone-900">{ord.customerName}</p>
                            <p className="text-[11px] text-stone-500 font-mono">{ord.phone}</p>
                            <p className="text-[10px] text-stone-400 truncate max-w-[150px]">{ord.address.city}, {ord.address.state}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {ord.items.map((it, i) => (
                                <p key={i} className="line-clamp-1 max-w-[200px] text-stone-800">
                                  {it.quantity}x {it.name}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-stone-900 tabular-nums">
                            {formatPrice(ord.total)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono text-[11px] block">{ord.paymentMethod}</span>
                            <span className={`text-[10px] uppercase font-bold ${
                              ord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="text-xs font-semibold px-2 py-1 border border-stone-300 rounded bg-[#FAF8F5] cursor-pointer"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                            {formatDate(ord.createdAt)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setOrderModal(ord)}
                              className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#9E7B36] text-white text-[11px] rounded uppercase tracking-wider font-medium transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 3. PRODUCT MANAGEMENT SECTION */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            
            {/* Search and Count */}
            <div className="bg-white border border-[#EAE3D6] p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 text-xs pl-9 pr-3 py-2 text-stone-900 focus:outline-none rounded"
                />
              </div>

              <span className="text-xs font-mono text-stone-500">
                Total Products: <strong>{products.length}</strong>
              </span>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-[#EAE3D6] rounded shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-stone-700 font-mono uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Title & Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / Discount</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Flags</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((p) => {
                      const img = p.images?.[0] || '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg';

                      return (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="py-3 px-4">
                            <div className="w-12 h-14 bg-stone-100 border border-stone-200 overflow-hidden rounded shrink-0">
                              <img src={img} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <h4 className="font-serif font-semibold text-stone-900 text-sm">{p.name}</h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">{p.description}</p>
                            <span className="text-[10px] text-stone-400 font-mono">{p.images?.length || 1} image(s)</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-stone-700">{p.category}</td>
                          <td className="py-3 px-4 font-mono tabular-nums">
                            <span className="font-bold text-stone-900 block">{formatPrice(p.discountPrice || p.price)}</span>
                            {p.discountPrice && (
                              <span className="text-[11px] text-stone-400 line-through">{formatPrice(p.price)}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-mono font-semibold ${p.stock > 5 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-4 space-x-1">
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#9E7B36] text-[#9E7B36] text-[10px] font-mono rounded">
                                Featured
                              </span>
                            )}
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-mono rounded">
                                New
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct({ ...p });
                                setProductModalOpen(true);
                              }}
                              className="p-1.5 text-stone-600 hover:text-stone-950 border border-stone-300 rounded hover:bg-stone-100"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-rose-600 hover:text-rose-900 border border-rose-200 rounded hover:bg-rose-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 4. CATEGORIES MANAGEMENT SECTION */}
        {activeSection === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.id || cat.name} className="bg-white border border-[#EAE3D6] rounded overflow-hidden shadow-xs">
                  <div className="h-40 bg-stone-100 relative">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-stone-900">{cat.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-stone-400">
                        {products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length} products
                      </span>
                      <button
                        onClick={() => {
                          setEditingCategory({ ...cat });
                          setCategoryModalOpen(true);
                        }}
                        className="text-xs text-[#9E7B36] font-medium hover:underline"
                      >
                        Edit Category
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CUSTOMERS MANAGEMENT SECTION */}
        {activeSection === 'customers' && (
          <div className="bg-white border border-[#EAE3D6] rounded shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Registered Boutique Clientèle ({customers.length})
              </h3>
              <span className="text-xs text-stone-500 font-light">Client privacy protected</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-700 font-mono uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Orders Placed</th>
                    <th className="py-3 px-4">Total Spending</th>
                    <th className="py-3 px-4">Account Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-semibold text-stone-900">{c.name}</td>
                      <td className="py-3 px-4 font-mono text-stone-600">{c.email}</td>
                      <td className="py-3 px-4 font-mono text-stone-600">{c.phone || 'N/A'}</td>
                      <td className="py-3 px-4 font-mono font-medium">{c.ordersCount} orders</td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                        {formatPrice(c.totalSpend)}
                      </td>
                      <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. SETTINGS SECTION */}
        {activeSection === 'settings' && (
          <div className="bg-white border border-[#EAE3D6] p-8 rounded max-w-2xl shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-900 mb-1">
                Boutique Configuration
              </h2>
              <p className="text-xs text-stone-500">Manage owner contact and checkout rules</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1 uppercase tracking-wider">
                  Store Name
                </label>
                <input
                  type="text"
                  disabled
                  value="KRESA - Style Meets Life"
                  className="w-full bg-stone-100 border border-stone-300 p-2.5 rounded font-mono text-stone-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1 uppercase tracking-wider">
                  Complimentary Shipping Threshold (INR)
                </label>
                <input
                  type="number"
                  defaultValue={1999}
                  className="w-full bg-white border border-stone-300 p-2.5 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1 uppercase tracking-wider">
                  Owner Admin Email
                </label>
                <input
                  type="email"
                  disabled
                  value={adminData?.email || 'admin@kresa.com'}
                  className="w-full bg-stone-100 border border-stone-300 p-2.5 rounded font-mono text-stone-600"
                />
              </div>

              <button
                onClick={() => showToast('Settings saved successfully!')}
                className="px-6 py-2.5 bg-[#1C1917] text-white uppercase tracking-wider font-semibold text-xs rounded hover:bg-[#9E7B36] transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: ORDER INSPECTION & STATUS UPDATE */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-stone-400">Order Management</span>
                <h3 className="text-xl font-serif font-bold text-stone-900">{orderModal.id}</h3>
                <p className="text-xs text-stone-500 font-mono">Date: {formatDate(orderModal.createdAt)}</p>
              </div>
              <button onClick={() => setOrderModal(null)} className="text-stone-400 hover:text-stone-800 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Update Actions */}
            <div className="bg-[#FAF8F5] border border-stone-200 p-4 rounded space-y-3">
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-800">
                Update Order Progression:
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Order Placed',
                    'Confirmed',
                    'Processing',
                    'Packed',
                    'Shipped',
                    'Out for Delivery',
                    'Delivered',
                    'Cancelled',
                  ] as OrderStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(orderModal.id, st)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                      orderModal.status === st
                        ? 'bg-[#1C1917] text-[#D4AF37]'
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Optional internal dispatch note (e.g. BlueDart AWB #99214)"
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-300 p-2 rounded"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b border-stone-200 pb-4">
              <div>
                <h4 className="font-semibold text-stone-900 uppercase">Customer Details</h4>
                <p className="text-stone-800 font-medium mt-1">{orderModal.customerName}</p>
                <p className="text-stone-500 font-mono">{orderModal.phone}</p>
                <p className="text-stone-500 font-mono">{orderModal.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 uppercase">Shipping Destination</h4>
                <p className="text-stone-700 mt-1">{orderModal.address.street}</p>
                <p className="text-stone-700">{orderModal.address.city}, {orderModal.address.state} - {orderModal.address.pincode}</p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-semibold text-stone-900 uppercase text-xs mb-3">Items in Parcel</h4>
              <div className="space-y-2">
                {orderModal.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium text-stone-900">{it.name}</p>
                        <p className="text-stone-500 text-[11px]">
                          Qty: {it.quantity} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''} {it.selectedColor ? `· Color: ${it.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold tabular-nums">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 font-mono font-bold text-base text-stone-900">
              <span>Total Value:</span>
              <span>{formatPrice(orderModal.total)}</span>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PRODUCT WITH IMAGE MANAGEMENT SYSTEM */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded shadow-2xl">
            <div className="flex justify-between items-start border-b border-stone-200 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#9E7B36] font-semibold">
                  Atelier Catalog Management
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Add New Boutique Creation'}
                </h3>
              </div>
              <button onClick={() => setProductModalOpen(false)} className="text-stone-400 hover:text-stone-800 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Product Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Royal Emerald Polki Choker"
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#9E7B36] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'Fashion Jewellery'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 text-xs text-stone-900 rounded"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">
                    Stock Units Available *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 text-xs text-stone-900 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 text-xs text-stone-900 font-mono rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">
                    Discount / Special Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.discountPrice ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Optional discount price"
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 text-xs text-stone-900 font-mono rounded"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase font-semibold text-stone-700 mb-1">
                  Product Description & Heritage Story *
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detail the materials, provenance, crafting techniques..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 text-xs text-stone-900 rounded"
                />
              </div>

              {/* IMAGE MANAGEMENT SYSTEM: Direct device upload, delete, replace, add */}
              <div className="bg-[#FAF8F5] border border-[#EAE3D6] p-4 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-stone-900">
                      Product Images Gallery
                    </h4>
                    <p className="text-[11px] text-stone-500 font-light">
                      Upload high-resolution images directly from your device.
                    </p>
                  </div>

                  <label className="px-3 py-1.5 bg-[#C9A86A] hover:bg-[#B39356] text-stone-950 font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image From Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, false)}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Thumbnails of current images */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {editingProduct.images?.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-[4/5] bg-stone-200 border border-stone-300 rounded overflow-hidden group">
                      <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#1C1917] text-[#D4AF37] text-[9px] px-1 font-mono uppercase font-bold">
                          Cover
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingProduct.images?.filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, images: updated });
                        }}
                        className="absolute top-1 right-1 p-1 bg-rose-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {(!editingProduct.images || editingProduct.images.length === 0) && (
                    <div className="col-span-3 sm:col-span-6 p-4 text-center border-2 border-dashed border-stone-300 rounded text-stone-400 text-xs">
                      No images uploaded yet. Click "Upload Image From Device" above to add photos.
                    </div>
                  )}
                </div>
              </div>

              {/* Badges Toggle */}
              <div className="flex gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="accent-[#9E7B36]"
                  />
                  <span className="font-medium text-stone-800">Featured On Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="accent-[#9E7B36]"
                  />
                  <span className="font-medium text-stone-800">Mark As New Arrival</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-xs uppercase tracking-wider font-medium text-stone-700 rounded hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1C1917] hover:bg-[#9E7B36] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded transition-colors"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT CATEGORY */}
      {categoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full p-6 rounded shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3 mb-4">
              <h3 className="font-serif font-bold text-stone-900">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Royal Footwear"
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 rounded"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Short tagline for category card"
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 rounded"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-stone-700 mb-1">Category Image</label>
                <div className="flex items-center gap-3">
                  {editingCategory.image && (
                    <img src={editingCategory.image} alt="Cat preview" className="w-16 h-12 object-cover rounded" />
                  )}
                  <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium cursor-pointer">
                    <span>Upload Device Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1C1917] text-white rounded font-medium uppercase tracking-wider"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
