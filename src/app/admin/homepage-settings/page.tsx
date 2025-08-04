'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface HomepageSettings {
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

export default function HomepageSettingsPage() {
  const [settings, setSettings] = useState<HomepageSettings>({
    id: '1',
    featuredProductsCount: 8,
    bestSellersCount: 8,
    newProductsCount: 8,
    showOffers: true,
    showBestSellers: true,
    showNewProducts: true,
    showQuickCategories: true,
    showFeatures: true,
    updatedAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      const data = await response.json();
      
      if (data.success) {
        // التأكد من أن القيم الرقمية صحيحة
        const settingsData = {
          ...data.data,
          featuredProductsCount: data.data.featuredProductsCount || 8,
          bestSellersCount: data.data.bestSellersCount || 8,
          newProductsCount: data.data.newProductsCount || 8,
        };
        setSettings(settingsData);
      } else {
        toast.error('فشل في جلب الإعدادات');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('تم حفظ الإعدادات بنجاح');
      } else {
        toast.error(data.error || 'فشل في حفظ الإعدادات');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? (value === '' ? 0 : parseInt(value) || 0) : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
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
              إعدادات الصفحة الرئيسية
            </h1>
            <p className="text-gray-600">
              تخصيص محتوى وعرض الصفحة الرئيسية
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                إعدادات العرض
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* عدد المنتجات */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد المنتجات المميزة
                  </label>
                  <input
                    type="number"
                    name="featuredProductsCount"
                    value={settings.featuredProductsCount || ''}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الأكثر مبيعاً
                  </label>
                  <input
                    type="number"
                    name="bestSellersCount"
                    value={settings.bestSellersCount || ''}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد المنتجات الجديدة
                  </label>
                  <input
                    type="number"
                    name="newProductsCount"
                    value={settings.newProductsCount || ''}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* خيارات العرض */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">خيارات العرض</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showOffers"
                      checked={settings.showOffers}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="mr-3 block text-sm text-gray-900">
                      عرض العروض والخصومات
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showBestSellers"
                      checked={settings.showBestSellers}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="mr-3 block text-sm text-gray-900">
                      عرض الأكثر مبيعاً
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showNewProducts"
                      checked={settings.showNewProducts}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="mr-3 block text-sm text-gray-900">
                      عرض المنتجات الجديدة
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showQuickCategories"
                      checked={settings.showQuickCategories}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="mr-3 block text-sm text-gray-900">
                      عرض الفئات السريعة
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="showFeatures"
                      checked={settings.showFeatures}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="mr-3 block text-sm text-gray-900">
                      عرض المميزات
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 