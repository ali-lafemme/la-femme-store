'use client';

import { useState, useEffect } from 'react';

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
  category?: {
    name: string;
  };
}

const OffersSection = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        const data = await response.json();
        
        if (data.success) {
          // تصفية العروض المفعلة فقط وترتيبها
          const activeOffers = data.data
            .filter((offer: Offer) => offer.isActive)
            .sort((a: Offer, b: Offer) => a.order - b.order);
          
          setOffers(activeOffers);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // دالة لتحديد رابط الفئة بناءً على اسم الفئة
  const getCategoryLink = (categoryName?: string) => {
    if (!categoryName) return '/';
    
    // تنظيف اسم الفئة من المسافات الزائدة
    const cleanCategoryName = categoryName.trim();
    
    const categoryMap: { [key: string]: string } = {
      'المكياج': '/makeup',
      'المكياج ': '/makeup', // للتعامل مع المسافة الإضافية
      'العناية بالبشرة': '/skincare',
      'العناية بالشعر': '/haircare',
      'الأظافر': '/nails',
      'حقائب': '/bags',
      'اكسسورات': '/accessories',
      'العطور': '/perfumes',
      'الأجهزة الجمالية': '/beauty-devices',
      'الأجهزة  الجمالية': '/beauty-devices', // للتعامل مع المسافتين
      'العيون': '/eyes'
    };
    
    return categoryMap[cleanCategoryName] || '/';
  };

  // دالة لتنسيق التاريخ بالفرنجي مع أسماء الشهور العربية
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'غير محدد';
      }
      
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      // أسماء الشهور العربية
      const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      
      const formattedDate = `${day} ${arabicMonths[month]} ${year}`;
      return `ينتهي ${formattedDate}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'غير محدد';
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    // عرض عروض افتراضية إذا لم تكن هناك عروض
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🎉 العروض والخصومات
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              عروض محدودة الوقت - لا تفوتي الفرصة!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Offer Card 1 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-red-200 to-orange-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">50%</span>
                    </div>
                    <p className="text-gray-600">خصم</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    محدود الوقت
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">خصم على المكياج</h3>
                <p className="text-gray-600 text-sm mb-4">خصم 50% على جميع منتجات المكياج</p>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">ينتهي خلال 24 ساعة</span>
                  <a href="/makeup" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    تسوقي الآن
                  </a>
                </div>
              </div>
            </div>

            {/* Offer Card 2 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">30%</span>
                    </div>
                    <p className="text-gray-600">خصم</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    جديد
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">عروض العناية بالبشرة</h3>
                <p className="text-gray-600 text-sm mb-4">خصم 30% على منتجات العناية بالبشرة</p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-500 font-bold">ينتهي خلال 48 ساعة</span>
                  <a href="/skincare" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    تسوقي الآن
                  </a>
                </div>
              </div>
            </div>

            {/* Offer Card 3 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-green-200 to-teal-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">2+1</span>
                    </div>
                    <p className="text-gray-600">مجاناً</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    باقة
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">عروض الباقات</h3>
                <p className="text-gray-600 text-sm mb-4">اشتري 2 واحصلي على الثالث مجاناً</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-500 font-bold">عرض محدود</span>
                  <a href="/offers" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    تسوقي الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            🎉 العروض والخصومات
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            عروض محدودة الوقت - لا تفوتي الفرصة!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                {offer.image ? (
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${offer.image})` }}>
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-red-200 to-orange-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{offer.discountPercentage}%</span>
                      </div>
                      <p className="text-gray-600">خصم</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {offer.expiresAt ? 'محدود الوقت' : 'جديد'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                {offer.category && (
                  <p className="text-sm text-gray-500 mb-2">القسم: {offer.category.name}</p>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-500 font-bold text-sm">
                    خصم {offer.discountPercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {offer.expiresAt && (
                    <span className="text-red-500 font-bold text-sm">
                      {formatDate(offer.expiresAt)}
                    </span>
                  )}
                  <a 
                    href={getCategoryLink(offer.category?.name)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    تسوقي الآن
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection; 