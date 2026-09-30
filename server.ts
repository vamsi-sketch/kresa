import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { INITIAL_CATEGORIES, INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PRODUCTS } from './src/data/initialData.ts';
import { Category, Order, Product, User, OrderStatus } from './src/types/index.ts';

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Store Schema Interface
interface DBStore {
  categories: Category[];
  products: Product[];
  orders: Order[];
  users: (User & { passwordHash?: string })[];
  adminSessionToken?: string;
  adminCredentials: { email: string; passwordHash: string };
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial DB State
function getInitialStore(): DBStore {
  const adminPasswordHash = hashPassword('admin123');
  return {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    users: [
      ...INITIAL_CUSTOMERS.map((c) => ({
        ...c,
        passwordHash: hashPassword('customer123'),
      })),
    ],
    adminCredentials: {
      email: 'admin@kresa.com',
      passwordHash: adminPasswordHash,
    },
  };
}

let db: DBStore;
if (fs.existsSync(STORE_FILE)) {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    db = JSON.parse(raw);
    // Merge any missing fields if updated
    if (!db.categories?.length) db.categories = INITIAL_CATEGORIES;
    if (!db.products?.length) db.products = INITIAL_PRODUCTS;
    if (!db.orders) db.orders = INITIAL_ORDERS;
    if (!db.users) db.users = INITIAL_CUSTOMERS;
    if (!db.adminCredentials) {
      db.adminCredentials = {
        email: 'admin@kresa.com',
        passwordHash: hashPassword('admin123'),
      };
    }
  } catch (err) {
    console.error('Failed reading store.json, reinitializing:', err);
    db = getInitialStore();
    fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2));
  }
} else {
  db = getInitialStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2));
}

function saveStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

// Express middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Session tokens store in memory
const adminTokens = new Set<string>();
const userSessions = new Map<string, string>(); // token -> userId

// Admin Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || (req.headers['x-admin-token'] as string);
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
  next();
}

// Optional / Required Customer Auth Middleware
function getAuthUser(req: Request): User | null {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const userId = userSessions.get(token);
  if (!userId) return null;
  return db.users.find((u) => u.id === userId) || null;
}

// ----------------- ADMIN AUTH API ----------------- //
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashed = hashPassword(password);
  if (
    email.trim().toLowerCase() === db.adminCredentials.email.toLowerCase() &&
    hashed === db.adminCredentials.passwordHash
  ) {
    const token = 'kresa_adm_' + crypto.randomBytes(24).toString('hex');
    adminTokens.add(token);
    return res.json({
      success: true,
      token,
      admin: {
        email: db.adminCredentials.email,
        name: 'KRESA Boutique Owner',
        role: 'admin',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || (req.headers['x-admin-token'] as string);
  if (token) adminTokens.delete(token);
  res.json({ success: true });
});

app.get('/api/admin/verify', requireAdmin, (_req, res) => {
  res.json({ valid: true, admin: { email: db.adminCredentials.email, role: 'admin' } });
});

// ----------------- CUSTOMER AUTH API ----------------- //
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User & { passwordHash?: string } = {
    id: 'user-' + crypto.randomBytes(6).toString('hex'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || '').trim(),
    role: 'customer',
    createdAt: new Date().toISOString(),
    ordersCount: 0,
    totalSpend: 0,
    savedAddresses: [],
    passwordHash: hashPassword(password),
  };

  db.users.push(newUser);
  saveStore();

  const token = 'kresa_usr_' + crypto.randomBytes(24).toString('hex');
  userSessions.set(token, newUser.id);

  const { passwordHash, ...userClean } = newUser;
  res.status(201).json({ success: true, token, user: userClean });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = 'kresa_usr_' + crypto.randomBytes(24).toString('hex');
  userSessions.set(token, user.id);

  const { passwordHash, ...userClean } = user;
  res.json({ success: true, token, user: userClean });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { passwordHash, ...userClean } = user as any;
  res.json({ user: userClean });
});

app.put('/api/auth/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { name, phone, savedAddresses } = req.body;
  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (savedAddresses && Array.isArray(savedAddresses)) {
    user.savedAddresses = savedAddresses;
  }
  saveStore();
  const { passwordHash, ...userClean } = user as any;
  res.json({ success: true, user: userClean });
});

// ----------------- IMAGE UPLOAD API ----------------- //
app.post('/api/upload', (req, res) => {
  try {
    const { data, filename } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Match base64 data url e.g. "data:image/png;base64,..."
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('svg')) ext = 'svg';

    const safeName = (filename || 'kresa_image').replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalFilename = `${safeName}_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;
    res.json({ success: true, url: publicUrl, filename: finalFilename });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: 'Image processing failed: ' + err.message });
  }
});

// ----------------- PRODUCTS API ----------------- //
app.get('/api/products', (req, res) => {
  let list = [...db.products];
  const { category, search, sort, minPrice, maxPrice, featured, newArrival } = req.query;

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) list = list.filter((p) => (p.discountPrice || p.price) >= min);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) list = list.filter((p) => (p.discountPrice || p.price) <= max);
  }

  if (featured === 'true') {
    list = list.filter((p) => p.isFeatured);
  }

  if (newArrival === 'true') {
    list = list.filter((p) => p.isNewArrival);
  }

  // Sorting
  if (sort === 'price-low') {
    list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === 'price-high') {
    list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === 'popular') {
    list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
  } else {
    // Newest default
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ products: list, total: list.length });
});

app.get('/api/products/:id', (req, res) => {
  const prod = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });

  // Related products from same category
  const related = db.products
    .filter((p) => p.category === prod.category && p.id !== prod.id)
    .slice(0, 4);

  res.json({ product: prod, related });
});

app.post('/api/products', requireAdmin, (req, res) => {
  const {
    name,
    category,
    price,
    discountPrice,
    description,
    details,
    images,
    stock,
    sizes,
    colors,
    isFeatured,
    isNewArrival,
  } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newProduct: Product = {
    id: 'prod-' + crypto.randomBytes(5).toString('hex'),
    name: name.trim(),
    slug: `${slug}-${Date.now().toString().slice(-4)}`,
    category,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    description: description || '',
    details: Array.isArray(details) ? details : [],
    images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/cat_fashion_jewellery_1790689927066.jpg'],
    rating: 5.0,
    reviewCount: 1,
    stock: stock !== undefined ? Number(stock) : 10,
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['Free Size'],
    colors: Array.isArray(colors) && colors.length > 0 ? colors : [{ name: 'Default', hex: '#D4AF37' }],
    isFeatured: Boolean(isFeatured),
    isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  saveStore();
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const existing = db.products[index];
  const {
    name,
    category,
    price,
    discountPrice,
    description,
    details,
    images,
    stock,
    sizes,
    colors,
    isFeatured,
    isNewArrival,
  } = req.body;

  db.products[index] = {
    ...existing,
    name: name !== undefined ? name.trim() : existing.name,
    category: category !== undefined ? category : existing.category,
    price: price !== undefined ? Number(price) : existing.price,
    discountPrice: discountPrice !== undefined ? (discountPrice ? Number(discountPrice) : undefined) : existing.discountPrice,
    description: description !== undefined ? description : existing.description,
    details: details !== undefined ? details : existing.details,
    images: images !== undefined && Array.isArray(images) ? images : existing.images,
    stock: stock !== undefined ? Number(stock) : existing.stock,
    sizes: sizes !== undefined && Array.isArray(sizes) ? sizes : existing.sizes,
    colors: colors !== undefined && Array.isArray(colors) ? colors : existing.colors,
    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
    isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : existing.isNewArrival,
  };

  saveStore();
  res.json({ success: true, product: db.products[index] });
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const removed = db.products.splice(index, 1);
  saveStore();
  res.json({ success: true, deleted: removed[0] });
});

// ----------------- CATEGORIES API ----------------- //
app.get('/api/categories', (_req, res) => {
  // Compute real-time item counts
  const list = db.categories.map((cat) => {
    const count = db.products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
    return { ...cat, itemCount: count };
  });
  res.json({ categories: list });
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const { name, description, image } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat: Category = {
    id: 'cat-' + crypto.randomBytes(4).toString('hex'),
    name: name.trim(),
    slug,
    description: description || '',
    image: image || '/src/assets/images/cat_fashion_jewellery_1790689927066.jpg',
  };

  db.categories.push(newCat);
  saveStore();
  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  const cat = db.categories.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: 'Category not found' });

  const { name, description, image } = req.body;
  if (name) {
    const oldName = cat.name;
    cat.name = name.trim();
    cat.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    // Also sync products if renamed
    db.products.forEach((p) => {
      if (p.category === oldName) p.category = cat.name;
    });
  }
  if (description !== undefined) cat.description = description;
  if (image !== undefined) cat.image = image;

  saveStore();
  res.json({ success: true, category: cat });
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });

  const removed = db.categories.splice(index, 1);
  saveStore();
  res.json({ success: true, deleted: removed[0] });
});

// ----------------- ORDERS API ----------------- //
app.post('/api/orders', (req, res) => {
  const { customerName, email, phone, address, items, paymentMethod, discount = 0 } = req.body;

  if (!customerName || !email || !phone || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  const user = getAuthUser(req);
  const subtotal = items.reduce((acc: number, it: any) => acc + it.price * it.quantity, 0);
  const deliveryFee = subtotal >= 1999 ? 0 : 150;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const orderId = 'KRE-' + Math.floor(10000 + Math.random() * 90000);
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    userId: user?.id,
    customerName: customerName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address,
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    paymentMethod: paymentMethod || 'ONLINE_UPI',
    paymentStatus: paymentMethod === 'COD' ? 'Cash On Delivery' : 'Paid',
    status: 'Order Placed',
    createdAt: now,
    timeline: [
      {
        status: 'Order Placed',
        timestamp: now,
        note: `Order placed successfully via ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}.`,
      },
    ],
  };

  db.orders.unshift(newOrder);

  // Decrement stock for products
  items.forEach((item: any) => {
    const prod = db.products.find((p) => p.id === item.productId);
    if (prod && prod.stock > 0) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  // Update customer stats if logged in
  if (user) {
    user.ordersCount = (user.ordersCount || 0) + 1;
    user.totalSpend = (user.totalSpend || 0) + total;
  }

  saveStore();
  res.status(201).json({ success: true, order: newOrder });
});

app.get('/api/orders/my', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const myOrders = db.orders.filter(
    (o) => o.userId === user.id || o.email.toLowerCase() === user.email.toLowerCase()
  );
  res.json({ orders: myOrders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

// Admin Orders
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let list = [...db.orders];

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter((o) => o.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.includes(q)
    );
  }

  res.json({ orders: list, total: list.length });
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { status, note } = req.body;
  const validStatuses: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  order.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status} by admin.`,
  });

  if (status === 'Delivered' && order.paymentMethod === 'COD') {
    order.paymentStatus = 'Paid';
  }

  saveStore();
  res.json({ success: true, order });
});

// ----------------- ADMIN DASHBOARD STATS ----------------- //
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  const totalOrders = db.orders.length;
  const newOrders = db.orders.filter((o) => o.status === 'Order Placed').length;
  const pendingOrders = db.orders.filter(
    (o) => !['Delivered', 'Cancelled'].includes(o.status)
  ).length;
  const deliveredOrders = db.orders.filter((o) => o.status === 'Delivered').length;
  const totalSales = db.orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const totalProducts = db.products.length;
  const totalCustomers = db.users.filter((u) => u.role === 'customer').length;

  // Monthly sales calculation
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const salesByMonth = months.map((m, idx) => {
    // Generate realistic distribution with current month high
    const mult = idx === 5 ? 1.4 : 0.8 + idx * 0.12;
    return {
      month: m,
      amount: Math.round((totalSales / 4.5) * mult),
      orders: Math.round((totalOrders / 4.5) * mult),
    };
  });

  // Category distribution
  const categoryDistribution = db.categories.map((c) => {
    const prods = db.products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase());
    return {
      category: c.name,
      count: prods.length,
      sales: prods.reduce((sum, p) => sum + p.price * 8, 0),
    };
  });

  res.json({
    totalOrders,
    newOrders,
    totalCustomers,
    totalProducts,
    totalSales,
    pendingOrders,
    deliveredOrders,
    recentOrders: db.orders.slice(0, 5),
    salesByMonth,
    categoryDistribution,
  });
});

app.get('/api/admin/customers', requireAdmin, (_req, res) => {
  const customers = db.users
    .filter((u) => u.role === 'customer')
    .map((c) => {
      const orders = db.orders.filter(
        (o) => o.userId === c.id || o.email.toLowerCase() === c.email.toLowerCase()
      );
      const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        ordersCount: orders.length || c.ordersCount || 0,
        totalSpend: totalSpend || c.totalSpend || 0,
        createdAt: c.createdAt,
        recentOrders: orders.slice(0, 3).map((o) => ({ id: o.id, total: o.total, status: o.status })),
      };
    });

  res.json({ customers });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KRESA Luxury Boutique server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
