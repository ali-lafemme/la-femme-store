'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import EditOfferModal from './EditOfferModal';

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  categoryId?: string;
  image?: string;
  isActive: boolean;
  order: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

const OffersTable = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      
      if (data.success) {
        setOffers(data.data);
      } else {
        toast.error('فشل في جلب العروض');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('تم حذف العرض بنجاح');
        fetchOffers();
      } else {
        toast.error(data.error || 'فشل في حذف العرض');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      const response = await fetch(`/api/offers/${offer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offer,
          isActive: !offer.isActive,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`تم ${offer.isActive ? 'إيقاف' : 'تفعيل'} العرض بنجاح`);
        fetchOffers();
      } else {
        toast.error(data.error || 'فشل في تحديث العرض');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          العروض والخصومات ({offers.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العنوان
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نسبة الخصم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الفئة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الانتهاء
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {offer.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {offer.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {offer.discountPercentage}%
                  </div>
                  {offer.originalPrice > 0 && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">{offer.originalPrice} د.ت</span>
                      <span className="mr-2">→</span>
                      <span className="text-green-600">{offer.discountedPrice} د.ت</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {offer.category?.name || 'جميع الفئات'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {offer.expiresAt ? formatDate(offer.expiresAt) : 'غير محدد'}
                  </div>
                  {offer.expiresAt && isExpired(offer.expiresAt) && (
                    <div className="text-xs text-red-600">منتهي الصلاحية</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {offer.isActive ? 'مفعل' : 'متوقف'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => setEditingOffer(offer)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className={`${
                        offer.isActive
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {offer.isActive ? 'إيقاف' : 'تفعيل'}
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {offers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            لا توجد عروض مضافة بعد
          </div>
        </div>
      )}
    </div>

    <EditOfferModal
      offer={editingOffer}
      isOpen={!!editingOffer}
      onClose={() => setEditingOffer(null)}
      onUpdate={fetchOffers}
    />
  </>
  );
};

export default OffersTable; 