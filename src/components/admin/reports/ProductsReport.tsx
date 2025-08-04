'use client';

import { useState, useEffect } from 'react';
import { getProducts, getOrders } from '@/lib/api';

interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  topSellingProducts: {
    id: string;
    name: string;
    category: string;
    sales: number;
    revenue: number;
    stock: number;
  }[];
  categoryStats: {
    category: string;
    productCount: number;
    totalSales: number;
  }[];
}

export default function ProductsReport() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const [productsResponse, ordersResponse] = await Promise.all([
        getProducts({ limit: 1000 }),
        getOrders({ limit: 1000 })
      ]);
      
      const products = productsResponse.data || [];
      const orders = ordersResponse.data || [];

      // إحصائيات المنتجات
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
      const outOfStockProducts = products.filter(p => p.stock === 0).length;

      // حساب مبيعات المنتجات
      const productSales = new Map<string, { sales: number; revenue: number }>();
      
      orders.forEach(order => {
        order.items.forEach(item => {
          const productId = item.product.id;
          const current = productSales.get(productId) || { sales: 0, revenue: 0 };
          productSales.set(productId, {
            sales: current.sales + item.quantity,
            revenue: current.revenue + (item.price * item.quantity)
          });
        });
      });

      // أفضل المنتجات مبيعاً
      const topSellingProducts = products
        .map(product => {
          const salesData = productSales.get(product.id) || { sales: 0, revenue: 0 };
          return {
            id: product.id,
            name: product.name,
            category: product.category?.name || 'غير محدد',
            sales: salesData.sales,
            revenue: salesData.revenue,
            stock: product.stock
          };
        })
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);

      // إحصائيات الفئات
      const categoryStats = products.reduce((acc, product) => {
        const category = product.category?.name || 'غير محدد';
        const salesData = productSales.get(product.id) || { sales: 0, revenue: 0 };
        
        if (!acc[category]) {
          acc[category] = { productCount: 0, totalSales: 0 };
        }
        
        acc[category].productCount++;
        acc[category].totalSales += salesData.revenue;
        
        return acc;
      }, {} as Record<string, { productCount: number; totalSales: number }>);

      const categoryStatsArray = Object.entries(categoryStats)
        .map(([category, stats]) => ({
          category,
          productCount: stats.productCount,
          totalSales: stats.totalSales
        }))
        .sort((a, b) => b.totalSales - a.totalSales);

      setStats({
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        topSellingProducts,
        categoryStats: categoryStatsArray
      });
    } catch (error) {
      console.error('Error fetching products data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-gray-500">لا توجد بيانات متاحة</div>;
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">إجمالي المنتجات</div>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">منتجات قليلة المخزون</div>
          <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">منتجات نفذت</div>
          <div className="text-2xl font-bold">{stats.outOfStockProducts}</div>
        </div>
      </div>

      {/* أفضل المنتجات مبيعاً */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">أفضل المنتجات مبيعاً</h4>
        <div className="space-y-3">
          {stats.topSellingProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between bg-white rounded-lg p-3">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{product.sales} قطعة</div>
                                 <div className="text-sm text-gray-500">{product.revenue.toFixed(2)} دينار ليبي</div>
                <div className={`text-xs ${product.stock === 0 ? 'text-red-500' : product.stock <= 10 ? 'text-yellow-500' : 'text-green-500'}`}>
                  المخزون: {product.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات الفئات */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">إحصائيات الفئات</h4>
        <div className="space-y-2">
          {stats.categoryStats.map((category) => (
            <div key={category.category} className="flex justify-between items-center bg-white rounded-lg p-3">
              <div>
                <div className="font-medium text-gray-900">{category.category}</div>
                <div className="text-sm text-gray-500">{category.productCount} منتج</div>
              </div>
              <div className="text-right">
                                 <div className="font-medium text-gray-900">{category.totalSales.toFixed(2)} دينار ليبي</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 