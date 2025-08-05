'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getProducts, getCategories, getOrders, getCustomers, Product } from '@/lib/api';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentProducts from '@/components/admin/RecentProducts';

export default function AdminDashboard() {
  const { admin, loading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    bestSellers: 0,
    newProducts: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    activeCustomers: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, ordersResponse, customersResponse, bestSellersResponse] = await Promise.all([
          getProducts({ limit: 100 }),
          getCategories(),
          getOrders({ limit: 100 }),
          getCustomers({ limit: 100 }),
          fetch('/api/products/best-sellers?limit=50'),
        ]);

        const products = productsResponse.success ? productsResponse.data : [];
        const categories = categoriesResponse.success ? categoriesResponse.data : [];
        const orders = ordersResponse.success ? ordersResponse.data : [];
        const customers = customersResponse.success ? customersResponse.data : [];
        const bestSellersData = await bestSellersResponse.json();
        const bestSellers = bestSellersData.success ? bestSellersData.data : [];

        setProducts(products);

        // حساب الإحصائيات
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          activeProducts: products.filter(p => p.isActive).length,
          lowStockProducts: products.filter(p => p.stock < 10).length,
          bestSellers: bestSellers.length, // عدد المنتجات الأكثر مبيعاً بناءً على الطلبيات المكتملة
          newProducts: products.filter(p => p.isNew).length,
          pendingOrders: orders.filter(o => o.status === 'PENDING').length,
          confirmedOrders: orders.filter(o => o.status === 'CONFIRMED').length,
          deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
          activeCustomers: customers.filter(c => c.totalOrders > 0).length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // عرض شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مسجل دخول، توجيه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">غير مسموح بالوصول</h2>
          <p className="text-gray-600 mb-4">يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  // عرض شاشة تحميل البيانات
  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل البيانات...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة التحكم
            </h1>
            <p className="text-gray-600">
              مرحباً {admin?.name || admin?.username}، إليك نظرة عامة على متجرك
            </p>
          </div>

          <DashboardStats stats={stats} />
          <RecentProducts products={products.slice(0, 5)} />
        </main>
      </div>
    </div>
  );
} 