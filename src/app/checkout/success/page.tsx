'use client';

import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const CheckoutSuccessContent = () => {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // الحصول على رقم الطلب من URL إذا كان موجود
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    } else {
      // إنشاء رقم طلب مؤقت
      setOrderId(`ORD-${Date.now().toString().slice(-8)}`);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* أيقونة النجاح */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              تم إرسال طلبك بنجاح! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              شكراً لك على طلبك. سنتواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.
            </p>
          </div>

          {/* تفاصيل الطلب */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">تفاصيل الطلب</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">رقم الطلب</h3>
                <p className="text-gray-600">#{orderId}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">تاريخ الطلب</h3>
                <p className="text-gray-600">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">حالة الطلب</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  في انتظار التأكيد
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">طريقة الدفع</h3>
                <p className="text-gray-600">الدفع عند الاستلام</p>
              </div>
            </div>
          </div>

          {/* الخطوات التالية */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">الخطوات التالية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">تأكيد الطلب</h3>
                <p className="text-sm text-gray-600">سنتواصل معك خلال 24 ساعة لتأكيد الطلب</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">تحضير الطلب</h3>
                <p className="text-sm text-gray-600">سيتم تحضير طلبك وتجهيزه للتوصيل</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">التوصيل</h3>
                <p className="text-sm text-gray-600">سيتم توصيل طلبك إلى عنوانك المحدد</p>
              </div>
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">معلومات التواصل</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.477 0 10c0 1.821.487 3.53 1.338 5.012L0 20l5.233-1.237A9.954 9.954 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm0 18c-1.821 0-3.53-.487-5.012-1.338L2.5 17.5l.838-2.488A7.954 7.954 0 012 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">واتساب</h3>
                  <p className="text-sm text-gray-600">للتواصل السريع</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">الهاتف</h3>
                  <p className="text-sm text-gray-600">0912345678</p>
                </div>
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              العودة للرئيسية
            </Link>
            
            <a
              href="https://wa.me/381615851106"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 1.821.487 3.53 1.338 5.012L0 20l5.233-1.237A9.954 9.954 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm0 18c-1.821 0-3.53-.487-5.012-1.338L2.5 17.5l.838-2.488A7.954 7.954 0 012 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
              </svg>
              تواصل معنا عبر الواتساب
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const CheckoutSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage; 