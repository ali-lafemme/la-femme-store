'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/lib/api';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7'); // 7, 14, 30 days

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const ordersResponse = await getOrders({ limit: 1000 });
      const orders = ordersResponse.data || [];
      
      const now = new Date();
      const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);
      
      const filteredOrders = orders.filter(order => 
        new Date(order.createdAt) >= daysAgo && order.status === 'DELIVERED'
      );

      // تجميع البيانات حسب التاريخ
      const dailyData = new Map<string, { revenue: number; orders: number }>();
      
      // إنشاء جميع التواريخ في النطاق
      for (let i = 0; i < parseInt(timeRange); i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        dailyData.set(dateKey, { revenue: 0, orders: 0 });
      }

      // إضافة البيانات الفعلية
      filteredOrders.forEach(order => {
        const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
        const current = dailyData.get(dateKey) || { revenue: 0, orders: 0 };
        dailyData.set(dateKey, {
          revenue: current.revenue + order.totalAmount,
          orders: current.orders + 1
        });
      });

      // تحويل البيانات إلى مصفوفة وترتيبها
      const revenueData = Array.from(dailyData.entries())
        .map(([date, stats]) => ({
          date,
          revenue: stats.revenue,
          orders: stats.orders
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setData(revenueData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const maxOrders = Math.max(...data.map(d => d.orders), 1);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        لا توجد بيانات متاحة للعرض
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* فلتر الفترة الزمنية */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">إيرادات المبيعات</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
        >
          <option value="7">آخر 7 أيام</option>
          <option value="14">آخر 14 يوم</option>
          <option value="30">آخر 30 يوم</option>
        </select>
      </div>

      {/* الرسم البياني */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.date} className="flex items-center space-x-4 space-x-reverse">
              <div className="w-20 text-xs text-gray-500 text-left">
                                 {new Date(item.date).toLocaleDateString('ar', { 
                   month: 'short', 
                   day: 'numeric' 
                 })}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                                     <div className="text-xs font-medium text-gray-900 w-16 text-left">
                     {item.revenue.toFixed(0)} دينار ليبي
                   </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 w-16 text-left">
                    {item.orders} طلب
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 border">
          <div className="text-sm text-gray-500">إجمالي الإيرادات</div>
                     <div className="text-lg font-bold text-pink-600">
             {data.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)} دينار ليبي
           </div>
        </div>
        <div className="bg-white rounded-lg p-3 border">
          <div className="text-sm text-gray-500">إجمالي الطلبات</div>
          <div className="text-lg font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.orders, 0)}
          </div>
        </div>
      </div>

      {/* مفتاح الرسم البياني */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse text-xs">
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded"></div>
          <span className="text-gray-600">الإيرادات</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
          <span className="text-gray-600">الطلبات</span>
        </div>
      </div>
    </div>
  );
} 