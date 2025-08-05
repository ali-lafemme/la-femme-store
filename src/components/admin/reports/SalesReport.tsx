'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/lib/api';

interface SalesStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlySales: { month: string; amount: number }[];
  topSellingCategories: { category: string; sales: number }[];
}

export default function SalesReport() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90 days

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const ordersResponse = await getOrders({ limit: 1000 });
      const orders = ordersResponse.data || [];
      
      const now = new Date();
      const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);
      
      const filteredOrders = orders.filter(order => 
        new Date(order.createdAt) >= daysAgo && order.status === 'DELIVERED'
      );

      const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalOrders = filteredOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // تجميع المبيعات الشهرية
      const monthlyData = filteredOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + order.totalAmount;
        return acc;
      }, {} as Record<string, number>);

      const monthlySales = Object.entries(monthlyData)
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => a.month.localeCompare(b.month));

      // أفضل الفئات مبيعاً
      const categorySales = filteredOrders.reduce((acc, order) => {
        order.items.forEach(item => {
          const category = 'غير محدد'; // لا تتوفر معلومات الفئة في البيانات الحالية
          acc[category] = (acc[category] || 0) + item.quantity;
        });
        return acc;
      }, {} as Record<string, number>);

      const topSellingCategories = Object.entries(categorySales)
        .map(([category, sales]) => ({ category, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      setStats({
        totalSales,
        totalOrders,
        averageOrderValue,
        monthlySales,
        topSellingCategories
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
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
      {/* فلتر الفترة الزمنية */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">إحصائيات المبيعات</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="7">آخر 7 أيام</option>
          <option value="30">آخر 30 يوم</option>
          <option value="90">آخر 90 يوم</option>
        </select>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">إجمالي المبيعات</div>
                     <div className="text-2xl font-bold">{stats.totalSales.toFixed(2)} دينار ليبي</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">عدد الطلبات</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">متوسط قيمة الطلب</div>
                     <div className="text-2xl font-bold">{stats.averageOrderValue.toFixed(2)} دينار ليبي</div>
        </div>
      </div>

      {/* المبيعات الشهرية */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">المبيعات الشهرية</h4>
        <div className="space-y-2">
          {stats.monthlySales.map((item) => (
            <div key={item.month} className="flex justify-between items-center">
                             <span className="text-sm text-gray-600">
                 {new Date(item.month + '-01').toLocaleDateString('ar', { 
                   year: 'numeric', 
                   month: 'long' 
                 })}
               </span>
               <span className="font-medium text-gray-900">{item.amount.toFixed(2)} دينار ليبي</span>
            </div>
          ))}
        </div>
      </div>

      {/* أفضل الفئات مبيعاً */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">أفضل الفئات مبيعاً</h4>
        <div className="space-y-2">
          {stats.topSellingCategories.map((item, index) => (
            <div key={item.category} className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-600">{item.category}</span>
              </div>
              <span className="font-medium text-gray-900">{item.sales} قطعة</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 