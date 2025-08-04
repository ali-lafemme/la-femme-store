'use client';

import { useState, useEffect } from 'react';
import { getCustomers, getOrders } from '@/lib/api';

interface CustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: {
    id: string;
    name: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
  }[];
  customerSegments: {
    segment: string;
    count: number;
    percentage: number;
  }[];
  customerRetention: {
    newCustomers: number;
    returningCustomers: number;
    loyalCustomers: number;
  };
}

export default function CustomersReport() {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      const [customersResponse, ordersResponse] = await Promise.all([
        getCustomers({ limit: 1000 }),
        getOrders({ limit: 1000 })
      ]);
      
      const customers = customersResponse.data || [];
      const orders = ordersResponse.data || [];

      // إحصائيات العملاء
      const totalCustomers = customers.length;
      
      // العملاء الجدد هذا الشهر
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const newCustomersThisMonth = customers.filter(customer => 
        new Date(customer.createdAt) >= thisMonth
      ).length;

      // حساب إحصائيات العملاء من الطلبات
      const customerStats = new Map<string, { orders: number; spent: number; lastOrder: Date }>();
      
      orders.forEach(order => {
        const customerId = order.userId;
        const current = customerStats.get(customerId) || { orders: 0, spent: 0, lastOrder: new Date(0) };
        customerStats.set(customerId, {
          orders: current.orders + 1,
          spent: current.spent + order.totalAmount,
          lastOrder: new Date(order.createdAt) > current.lastOrder ? new Date(order.createdAt) : current.lastOrder
        });
      });

      // أفضل العملاء
      const topCustomers = customers
        .map(customer => {
          const stats = customerStats.get(customer.id) || { orders: 0, spent: 0, lastOrder: new Date(0) };
          return {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            totalOrders: stats.orders,
            totalSpent: stats.spent,
            lastOrderDate: stats.lastOrder.toISOString()
          };
        })
        .filter(customer => customer.totalOrders > 0)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      // تقسيم العملاء حسب الإنفاق
      const customerSegments = [
        { segment: 'عملاء VIP', minSpent: 1000, count: 0 },
        { segment: 'عملاء نشطون', minSpent: 500, count: 0 },
        { segment: 'عملاء عاديون', minSpent: 100, count: 0 },
        { segment: 'عملاء جدد', minSpent: 0, count: 0 }
      ];

      customers.forEach(customer => {
        const stats = customerStats.get(customer.id) || { orders: 0, spent: 0, lastOrder: new Date(0) };
        
        if (stats.spent >= 1000) {
          customerSegments[0].count++;
        } else if (stats.spent >= 500) {
          customerSegments[1].count++;
        } else if (stats.spent >= 100) {
          customerSegments[2].count++;
        } else {
          customerSegments[3].count++;
        }
      });

      const segmentsWithPercentage = customerSegments.map(segment => ({
        ...segment,
        percentage: totalCustomers > 0 ? (segment.count / totalCustomers) * 100 : 0
      }));

      // تحليل الاحتفاظ بالعملاء
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newCustomers = customers.filter(customer => 
        new Date(customer.createdAt) >= thirtyDaysAgo
      ).length;
      
      const returningCustomers = customers.filter(customer => {
        const stats = customerStats.get(customer.id);
        return stats && stats.orders > 1 && new Date(customer.createdAt) < thirtyDaysAgo;
      }).length;
      
      const loyalCustomers = customers.filter(customer => {
        const stats = customerStats.get(customer.id);
        return stats && stats.orders >= 5;
      }).length;

      setStats({
        totalCustomers,
        newCustomersThisMonth,
        topCustomers,
        customerSegments: segmentsWithPercentage,
        customerRetention: {
          newCustomers,
          returningCustomers,
          loyalCustomers
        }
      });
    } catch (error) {
      console.error('Error fetching customers data:', error);
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
          <div className="text-sm opacity-90">إجمالي العملاء</div>
          <div className="text-2xl font-bold">{stats.totalCustomers}</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">عملاء جدد هذا الشهر</div>
          <div className="text-2xl font-bold">{stats.newCustomersThisMonth}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-sm opacity-90">العملاء المخلصون</div>
          <div className="text-2xl font-bold">{stats.customerRetention.loyalCustomers}</div>
        </div>
      </div>

      {/* أفضل العملاء */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">أفضل العملاء</h4>
        <div className="space-y-3">
          {stats.topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between bg-white rounded-lg p-3">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{customer.name}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </div>
              </div>
              <div className="text-right">
                                 <div className="font-medium text-gray-900">{customer.totalSpent.toFixed(2)} دينار ليبي</div>
                <div className="text-sm text-gray-500">{customer.totalOrders} طلب</div>
                <div className="text-xs text-gray-400">
                  آخر طلب: {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* تقسيم العملاء */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">تقسيم العملاء</h4>
        <div className="space-y-3">
          {stats.customerSegments.map((segment) => (
            <div key={segment.segment} className="flex justify-between items-center bg-white rounded-lg p-3">
              <div>
                <div className="font-medium text-gray-900">{segment.segment}</div>
                <div className="text-sm text-gray-500">{segment.count} عميل</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{segment.percentage.toFixed(1)}%</div>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* تحليل الاحتفاظ بالعملاء */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">تحليل الاحتفاظ بالعملاء</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.customerRetention.newCustomers}</div>
            <div className="text-sm text-gray-600">عملاء جدد</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.customerRetention.returningCustomers}</div>
            <div className="text-sm text-gray-600">عملاء عائدون</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.customerRetention.loyalCustomers}</div>
            <div className="text-sm text-gray-600">عملاء مخلصون</div>
          </div>
        </div>
      </div>
    </div>
  );
} 