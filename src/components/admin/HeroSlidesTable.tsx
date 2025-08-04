'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import EditHeroSlideModal from './EditHeroSlideModal';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const HeroSlidesTable = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      
      if (data.success) {
        setSlides(data.data);
      } else {
        toast.error('فشل في جلب الشرائح');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('تم حذف الشريحة بنجاح');
        fetchSlides();
      } else {
        toast.error(data.error || 'فشل في حذف الشريحة');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch(`/api/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...slide,
          isActive: !slide.isActive,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`تم ${slide.isActive ? 'إيقاف' : 'تفعيل'} الشريحة بنجاح`);
        fetchSlides();
      } else {
        toast.error(data.error || 'فشل في تحديث الشريحة');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    }
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
            شرائح Hero ({slides.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الترتيب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العنوان الفرعي
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
              {slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {slide.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {slide.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {slide.subtitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        slide.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {slide.isActive ? 'مفعلة' : 'متوقفة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`${
                          slide.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {slide.isActive ? 'إيقاف' : 'تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
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

        {slides.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              لا توجد شرائح مضافة بعد
            </div>
          </div>
        )}
      </div>

      <EditHeroSlideModal
        slide={editingSlide}
        isOpen={!!editingSlide}
        onClose={() => setEditingSlide(null)}
        onUpdate={fetchSlides}
      />
    </>
  );
};

export default HeroSlidesTable; 