// أنواع البيانات
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  images: string;
  categoryId: string;
  stock: number;
  rating: number;
  reviewCount: number;
  ingredients?: string | null;
  usage?: string | null;
  benefits?: string | null;
  weight?: string | null;
  brand?: string | null;
  sku?: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    description?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  items: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface HomepageSettings {
  id: string;
  featuredProductsCount: number;
  bestSellersCount: number;
  newProductsCount: number;
  showOffers: boolean;
  showBestSellers: boolean;
  showNewProducts: boolean;
  showQuickCategories: boolean;
  showFeatures: boolean;
  updatedAt: string;
}

export interface HomepageProduct {
  id: string;
  productId: string;
  section: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

// دوال API
const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

// جلب جميع المنتجات
export async function getProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Product[]>> {
  const searchParams = new URLSearchParams();
  
  if (params?.category) searchParams.append('category', params.category);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/api/products?${searchParams}`);
  return response.json();
}

// جلب منتج واحد
export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  return response.json();
}

// جلب جميع الفئات
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  return response.json();
}

// جلب المنتجات الأكثر مبيعاً
export async function getBestSellers(): Promise<Product[]> {
  const response = await getProducts({ limit: 8 });
  if (response.success) {
    return response.data.filter(product => product.isBestSeller);
  }
  return [];
}

// جلب المنتجات الجديدة
export async function getNewProducts(): Promise<Product[]> {
  const response = await getProducts({ limit: 8 });
  if (response.success) {
    return response.data.filter(product => product.isNew);
  }
  return [];
}

// جلب المنتجات حسب الفئة
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const response = await getProducts({ category: categoryId });
  if (response.success) {
    return response.data;
  }
  return [];
}

// جلب جميع الطلبات
export async function getOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Order[]>> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append('status', params.status);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/api/orders?${searchParams}`);
  return response.json();
}

// جلب طلب واحد
export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`);
  return response.json();
}

// تحديث حالة الطلب
export async function updateOrderStatus(id: string, status: string, notes?: string): Promise<ApiResponse<Order>> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, notes }),
  });
  return response.json();
}

// إرسال طلب جديد
export async function submitOrder(orderData: {
  customerName: string;
  customerEmail?: string;
  phone: string;
  shippingAddress: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}): Promise<ApiResponse<Order>> {
  const response = await fetch(`${API_BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return response.json();
}

// جلب جميع العملاء
export async function getCustomers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Customer[]>> {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/api/customers?${searchParams}`);
  return response.json();
}

// جلب عميل واحد
export async function getCustomer(id: string): Promise<ApiResponse<Customer>> {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
  return response.json();
} 

// جلب المنتجات المميزة للصفحة الرئيسية
export async function getHomepageProducts(section?: string): Promise<ApiResponse<HomepageProduct[]>> {
  const searchParams = new URLSearchParams();
  if (section) searchParams.append('section', section);

  const response = await fetch(`${API_BASE_URL}/api/homepage-products?${searchParams}`);
  return response.json();
}

// إضافة منتج مميز
export async function addHomepageProduct(data: {
  productId: string;
  section: string;
  order?: number;
  isActive?: boolean;
}): Promise<ApiResponse<HomepageProduct>> {
  const response = await fetch(`${API_BASE_URL}/api/homepage-products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// حذف منتج مميز
export async function deleteHomepageProduct(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const response = await fetch(`${API_BASE_URL}/api/homepage-products/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// تحديث منتج مميز
export async function updateHomepageProduct(id: string, data: {
  order?: number;
  isActive?: boolean;
}): Promise<ApiResponse<HomepageProduct>> {
  const response = await fetch(`${API_BASE_URL}/api/homepage-products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
} 