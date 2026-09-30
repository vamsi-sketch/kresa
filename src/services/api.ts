import { Category, Product, Order, User, AdminStats, OrderStatus } from '../types';

const ADMIN_TOKEN_KEY = 'kresa_admin_token';
const CUSTOMER_TOKEN_KEY = 'kresa_customer_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getCustomerToken(): string | null {
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setCustomerToken(token: string | null) {
  if (token) localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  else localStorage.removeItem(CUSTOMER_TOKEN_KEY);
}

// Universal fetch wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject Customer or Admin Auth headers if available
  const adminToken = getAdminToken();
  const customerToken = getCustomerToken();

  if (adminToken && endpoint.includes('/admin')) {
    headers.set('Authorization', `Bearer ${adminToken}`);
    headers.set('x-admin-token', adminToken);
  } else if (customerToken) {
    headers.set('Authorization', `Bearer ${customerToken}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    newArrival?: boolean;
  }): Promise<{ products: Product[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params?.featured) query.set('featured', 'true');
    if (params?.newArrival) query.set('newArrival', 'true');

    return request(`/api/products?${query.toString()}`);
  },

  async getProductById(id: string): Promise<{ product: Product; related: Product[] }> {
    return request(`/api/products/${id}`);
  },

  async createProduct(data: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    return request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    return request('/api/categories');
  },

  async createCategory(data: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    return request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    return request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async createOrder(orderData: any): Promise<{ success: boolean; order: Order }> {
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getMyOrders(): Promise<{ orders: Order[] }> {
    return request('/api/orders/my');
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    return request(`/api/orders/${id}`);
  },

  async getAdminOrders(params?: { status?: string; search?: string }): Promise<{ orders: Order[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    return request(`/api/admin/orders?${query.toString()}`);
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    note?: string
  ): Promise<{ success: boolean; order: Order }> {
    return request(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },

  // Customer Auth
  async registerCustomer(data: { name: string; email: string; phone?: string; password: string }): Promise<{
    success: boolean;
    token: string;
    user: User;
  }> {
    const res = await request<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setCustomerToken(res.token);
    return res;
  },

  async loginCustomer(data: { email: string; password: string }): Promise<{
    success: boolean;
    token: string;
    user: User;
  }> {
    const res = await request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setCustomerToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request('/api/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    return request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logoutCustomer() {
    setCustomerToken(null);
  },

  // Admin Auth & Stats
  async loginAdmin(credentials: { email: string; password: string }): Promise<{
    success: boolean;
    token: string;
    admin: { email: string; name: string; role: string };
  }> {
    const res = await request<{
      success: boolean;
      token: string;
      admin: { email: string; name: string; role: string };
    }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAdminToken(res.token);
    return res;
  },

  async logoutAdmin(): Promise<void> {
    try {
      await request('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setAdminToken(null);
    }
  },

  async verifyAdmin(): Promise<{ valid: boolean }> {
    return request('/api/admin/verify');
  },

  async getAdminStats(): Promise<AdminStats> {
    return request('/api/admin/stats');
  },

  async getAdminCustomers(): Promise<{ customers: any[] }> {
    return request('/api/admin/customers');
  },

  // Image Upload
  async uploadImage(base64DataUrl: string, filename?: string): Promise<{ success: boolean; url: string; filename: string }> {
    return request('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ data: base64DataUrl, filename }),
    });
  },
};
