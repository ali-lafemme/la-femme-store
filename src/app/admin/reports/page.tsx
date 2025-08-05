import { Suspense } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SalesReport from '@/components/admin/reports/SalesReport';
import ProductsReport from '@/components/admin/reports/ProductsReport';
import CustomersReport from '@/components/admin/reports/CustomersReport';
import RevenueChart from '@/components/admin/reports/RevenueChart';
import type { Viewport } from 'next';

export const metadata = {
  title: 'التقارير - لوحة التحكم',
  description: 'تقارير شاملة للمبيعات والمنتجات والعملاء',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير</h1>
            <p className="text-gray-600">تحليل شامل لأداء المتجر والمبيعات</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">إيرادات المبيعات</h2>
              <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse"></div>}>
                <RevenueChart />
              </Suspense>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">أفضل المنتجات مبيعاً</h2>
              <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse"></div>}>
                <ProductsReport />
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">تقرير المبيعات</h2>
              <Suspense fallback={<div className="h-96 bg-gray-100 rounded animate-pulse"></div>}>
                <SalesReport />
              </Suspense>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">تقرير العملاء</h2>
              <Suspense fallback={<div className="h-96 bg-gray-100 rounded animate-pulse"></div>}>
                <CustomersReport />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 