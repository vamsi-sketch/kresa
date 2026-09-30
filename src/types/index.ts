export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  details?: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sizes: string[];
  colors: ProductColor[];
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Address {
  id?: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'ONLINE_UPI' | 'CARD';
  paymentStatus: 'Pending' | 'Paid' | 'Cash On Delivery';
  status: OrderStatus;
  createdAt: string;
  timeline: OrderTimeline[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: Address[];
  createdAt: string;
  ordersCount?: number;
  totalSpend?: number;
}

export interface AdminStats {
  totalOrders: number;
  newOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalSales: number;
  pendingOrders: number;
  deliveredOrders: number;
  recentOrders: Order[];
  salesByMonth: { month: string; amount: number; orders: number }[];
  categoryDistribution: { category: string; count: number; sales: number }[];
}
