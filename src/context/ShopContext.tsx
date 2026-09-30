import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, User, Order } from '../types';
import { api, getAdminToken, getCustomerToken, setAdminToken, setCustomerToken } from '../services/api';

interface ShopContextType {
  // Navigation & Routing state
  currentView: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'account' | 'admin';
  setCurrentView: (view: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'account' | 'admin') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Customer Auth
  customer: User | null;
  isCustomerLoading: boolean;
  loginCustomer: (data: { email: string; password: string }) => Promise<void>;
  registerCustomer: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logoutCustomer: () => void;
  refreshCustomer: () => Promise<void>;

  // Admin Auth
  isAdmin: boolean;
  adminData: { email: string; name: string } | null;
  loginAdmin: (data: { email: string; password: string }) => Promise<void>;
  logoutAdmin: () => Promise<void>;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Quick Open product helper
  openProduct: (id: string) => void;
  openCategory: (catName: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'account' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Cart from local storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kresa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist from local storage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kresa_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer state
  const [customer, setCustomer] = useState<User | null>(null);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);

  // Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => !!getAdminToken());
  const [adminData, setAdminData] = useState<{ email: string; name: string } | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const hideToast = () => setToast(null);

  // Save cart
  useEffect(() => {
    localStorage.setItem('kresa_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('kresa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Check customer session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsCustomerLoading(true);
      if (getCustomerToken()) {
        try {
          const res = await api.getMe();
          setCustomer(res.user);
        } catch {
          setCustomerToken(null);
        }
      }
      if (getAdminToken()) {
        try {
          const verify = await api.verifyAdmin();
          if (verify.valid) {
            setIsAdmin(true);
            setAdminData({ email: 'admin@kresa.com', name: 'KRESA Boutique Owner' });
          } else {
            setIsAdmin(false);
            setAdminToken(null);
          }
        } catch {
          setIsAdmin(false);
          setAdminToken(null);
        }
      }
      setIsCustomerLoading(false);
    };
    initAuth();
  }, []);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const chosenSize = size || (product.sizes?.length ? product.sizes[0] : 'Standard');
    const chosenColor = color || (product.colors?.length ? product.colors[0].name : 'Default');

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to bag`);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index].quantity = quantity;
      }
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart totals calculation
  const cartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotal = cart.reduce((acc, it) => {
    const unitPrice = it.product.discountPrice || it.product.price;
    return acc + unitPrice * it.quantity;
  }, 0);
  const deliveryFee = cartSubtotal >= 1999 || cartSubtotal === 0 ? 0 : 150;
  const cartTotal = cartSubtotal + deliveryFee;

  // Customer actions
  const loginCustomer = async (data: { email: string; password: string }) => {
    const res = await api.loginCustomer(data);
    setCustomer(res.user);
    showToast(`Welcome back, ${res.user.name}`);
  };

  const registerCustomer = async (data: { name: string; email: string; phone?: string; password: string }) => {
    const res = await api.registerCustomer(data);
    setCustomer(res.user);
    showToast(`Account created! Welcome to KRESA, ${res.user.name}`);
  };

  const logoutCustomer = () => {
    api.logoutCustomer();
    setCustomer(null);
    showToast('Signed out successfully', 'info');
  };

  const refreshCustomer = async () => {
    try {
      const res = await api.getMe();
      setCustomer(res.user);
    } catch {
      //
    }
  };

  // Admin actions
  const loginAdmin = async (data: { email: string; password: string }) => {
    const res = await api.loginAdmin(data);
    setIsAdmin(true);
    setAdminData(res.admin);
    showToast('Admin authenticated successfully');
  };

  const logoutAdmin = async () => {
    await api.logoutAdmin();
    setIsAdmin(false);
    setAdminData(null);
    showToast('Logged out of Admin Console', 'info');
    setCurrentView('home');
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (catName: string) => {
    setSelectedCategoryFilter(catName);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        lastCompletedOrder,
        setLastCompletedOrder,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        customer,
        isCustomerLoading,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        refreshCustomer,
        isAdmin,
        adminData,
        loginAdmin,
        logoutAdmin,
        toast,
        showToast,
        hideToast,
        openProduct,
        openCategory,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
