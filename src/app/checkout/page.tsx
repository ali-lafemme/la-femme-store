'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitOrder } from '@/lib/api';

const CheckoutPage = () => {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '', // اختياري
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.name || !formData.phone || !formData.address) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (state.items.length === 0) {
      alert('السلة فارغة');
      return;
    }

    setIsSubmitting(true);

    try {
      // إرسال الطلب إلى API
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email || undefined,
        phone: formData.phone,
        shippingAddress: formData.address,
        notes: formData.notes,
        items: state.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: state.total,
      };

      const response = await submitOrder(orderData);

      if (response.success) {
        // تفريغ السلة
        clearCart();
        
        // الانتقال إلى صفحة تأكيد الطلب مع رقم الطلب
        router.push(`/checkout/success?orderId=${response.data.id}`);
      } else {
        alert(`خطأ: ${response.error}`);
      }
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">السلة فارغة</h1>
              <p className="text-gray-600 mb-8">لا يمكن إتمام الطلب بدون منتجات</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                العودة للتسوق
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">أدخل بياناتك لإتمام الطلب</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* نموذج البيانات */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">بيانات العميل</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                    placeholder="مثال: 0912345678"
                  />
                </div>

                {/* العنوان */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان التوصيل *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                    placeholder="أدخل عنوانك بالتفصيل"
                  />
                </div>

                {/* البريد الإلكتروني (اختياري) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                    placeholder="example@email.com"
                  />
                </div>

                {/* ملاحظات */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                    placeholder="أي ملاحظات إضافية حول الطلب..."
                  />
                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'جاري إرسال الطلب...' : 'إتمام الطلب'}
                </button>
              </form>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">ملخص الطلب</h2>
              
              {/* المنتجات */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 space-x-reverse">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {(item.product.price * item.quantity).toFixed(2)} دينار ليبي
                    </span>
                  </div>
                ))}
              </div>

              {/* التفاصيل المالية */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium">{state.total.toFixed(2)} دينار ليبي</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشحن:</span>
                  <span className="font-medium text-green-600">مجاني</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">المجموع الكلي:</span>
                    <span className="text-lg font-bold text-gray-900">{state.total.toFixed(2)} دينار ليبي</span>
                  </div>
                </div>
              </div>

              {/* معلومات الدفع */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">طريقة الدفع</h3>
                <p className="text-sm text-gray-600">
                  الدفع عند الاستلام (كاش عند التوصيل)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage; 