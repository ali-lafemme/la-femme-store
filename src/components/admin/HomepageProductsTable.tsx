'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { HomepageProduct, deleteHomepageProduct, updateHomepageProduct } from '@/lib/api';

const HomepageProductsTable = () => {
  const [homepageProducts, setHomepageProducts] = useState<HomepageProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomepageProducts = async () => {
    try {
      const response = await fetch('/api/homepage-products');
      const data = await response.json();
      
      if (data.success) {
        setHomepageProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching homepage products:', error);
      toast.error('خطأ في جلب المنتجات المميزة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      const response = await deleteHomepageProduct(id);
      
      if (response.success) {
        toast.success('تم حذف المنتج بنجاح');
        fetchHomepageProducts();
      } else {
        toast.error(response.error || 'خطأ في حذف المنتج');
      }
    } catch (error) {
      console.error('Error deleting homepage product:', error);
      toast.error('خطأ في حذف المنتج');
    }
  };

  const handleToggleActive = async (homepageProduct: HomepageProduct) => {
    try {
      const response = await updateHomepageProduct(homepageProduct.id, {
        isActive: !homepageProduct.isActive
      });
      
      if (response.success) {
        toast.success('تم تحديث حالة المنتج بنجاح');
        fetchHomepageProducts();
      } else {
        toast.error(response.error || 'خطأ في تحديث المنتج');
      }
    } catch (error) {
      console.error('Error updating homepage product:', error);
      toast.error('خطأ في تحديث المنتج');
    }
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'best-sellers':
        return 'الأكثر مبيعاً';
      case 'new-products':
        return 'وصل حديثاً';
      default:
        return section;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'best-sellers':
        return 'bg-blue-100 text-blue-800';
      case 'new-products':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المنتج
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              القسم
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الترتيب
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
          {homepageProducts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                لا توجد منتجات مميزة
              </td>
            </tr>
          ) : (
            homepageProducts.map((homepageProduct) => (
              <tr key={homepageProduct.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-lg object-cover" 
                        src={homepageProduct.product.image} 
                        alt={homepageProduct.product.name}
                      />
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {homepageProduct.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {homepageProduct.product.category.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSectionColor(homepageProduct.section)}`}>
                    {getSectionLabel(homepageProduct.section)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {homepageProduct.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(homepageProduct)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      homepageProduct.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {homepageProduct.isActive ? 'نشط' : 'غير نشط'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(homepageProduct.id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HomepageProductsTable; 