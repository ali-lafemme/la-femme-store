'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/api';

// Star Icons
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarOutlineIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [starRating, setStarRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [dynamicRating, setDynamicRating] = useState(0); // سيتم تحديثه من قاعدة البيانات
  const [reviewCount, setReviewCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
          
          // استخدام التقييم الحقيقي من قاعدة البيانات
          const realRating = data.data.rating || 0;
          const realReviewCount = data.data.reviewCount || 0;
          
          setDynamicRating(realRating);
          setReviewCount(realReviewCount);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
      
      // تحميل تقييم المستخدم السابق
      const ratings = JSON.parse(localStorage.getItem('productRatings') || '{}');
      if (ratings[productId]) {
        setUserRating(ratings[productId]);
        setHasUserRated(true);
      }
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product && (product.stock || 0) > 0) {
      setIsAdding(true);
      addItem(product);
      
      // إظهار حالة النجاح لمدة ثانية واحدة
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // إضافة المنتج إلى السلة
      addItem(product);
      // الانتقال مباشرة إلى صفحة الشراء
      router.push('/checkout');
    }
  };

  const handleStarClick = async (rating: number) => {
    if (!hasUserRated) {
      try {
        // إرسال التقييم إلى الخادم
        const response = await fetch('/api/products/rate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            rating
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          setUserRating(rating);
          setHasUserRated(true);
          setDynamicRating(result.data.rating);
          setReviewCount(result.data.reviewCount);
          
          // حفظ التقييم في localStorage أيضاً
          const ratings = JSON.parse(localStorage.getItem('productRatings') || '{}');
          ratings[productId] = rating;
          localStorage.setItem('productRatings', JSON.stringify(ratings));
          
          alert('شكراً لك! تم تسجيل تقييمك بنجاح.');
        } else {
          alert('فشل في تسجيل التقييم. يرجى المحاولة مرة أخرى.');
        }
      } catch (error) {
        console.error('Error rating product:', error);
        alert('فشل في تسجيل التقييم. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleStarHover = (rating: number) => {
    if (!hasUserRated) {
      setStarRating(rating);
      setIsHovering(true);
    }
  };

  const handleStarLeave = () => {
    if (!hasUserRated) {
      setStarRating(0);
      setIsHovering(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      let currentRating = dynamicRating;
      
      // إذا كان المستخدم يقيم، استخدم تقييمه
      if (isHovering && !hasUserRated) {
        currentRating = starRating;
      }
      
      // حساب ما إذا كانت النجمة مملوءة بالكامل أو جزئياً
      const isFullyFilled = starNumber <= Math.floor(currentRating);
      const isPartiallyFilled = starNumber === Math.ceil(currentRating) && currentRating % 1 > 0;
      
      return (
        <button
          key={index}
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleStarHover(starNumber)}
          onMouseLeave={handleStarLeave}
          disabled={hasUserRated}
          className={`text-yellow-400 transition-colors relative ${
            hasUserRated ? 'cursor-default' : 'hover:text-yellow-500 cursor-pointer'
          }`}
        >
          {isFullyFilled ? (
            <StarIcon className="w-6 h-6" />
          ) : isPartiallyFilled ? (
            <div className="relative">
              <StarOutlineIcon className="w-6 h-6" />
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(currentRating % 1) * 100}%` }}
              >
                <StarIcon className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <StarOutlineIcon className="w-6 h-6" />
          )}
        </button>
      );
    });
  };

  const getImageArray = () => {
    if (!product) return [];
    try {
      return JSON.parse(product.images);
    } catch {
      return [product.image];
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const diff = touchStart - touch.clientX;
    
    if (Math.abs(diff) > 50) { // Swipe threshold
      if (diff > 0) {
        // Swipe left - next image
        setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
      } else {
        // Swipe right - previous image
        setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
      }
    }
    setTouchStart(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">المنتج غير موجود</h2>
          <p className="text-gray-600">عذراً، المنتج الذي تبحث عنه غير متوفر</p>
        </div>
      </div>
    );
  }

  const images = getImageArray();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-pink-500">الرئيسية</Link></li>
              <li>/</li>
              <li><a href={`/${product.category?.name?.toLowerCase() || 'products'}`} className="hover:text-pink-500">{product.category?.name || 'المنتجات'}</a></li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Slider */}
            <div className="space-y-4">
              {/* Main Image with Navigation */}
              <div 
                className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-lg group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={images[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                      aria-label="الصورة السابقة"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                      aria-label="الصورة التالية"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Images with Scroll */}
              {images.length > 1 && (
                <div className="relative">
                  <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex-shrink-0 aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-pink-500 shadow-lg' 
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - صورة ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  
                  {/* Scroll Indicators */}
                  {images.length > 5 && (
                    <div className="flex justify-center space-x-1 mt-2">
                      {Array.from({ length: Math.ceil(images.length / 5) }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            Math.floor(selectedImage / 5) === index 
                              ? 'bg-pink-500' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="space-y-2">
                {product.brand && (
                  <p className="text-sm text-gray-500">العلامة التجارية: {product.brand}</p>
                )}
                <p className="text-sm text-gray-500">الفئة: {product.category?.name || 'غير محدد'}</p>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              {/* Rating */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars()}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({reviewCount} تقييم)
                  </span>
                </div>
                {!hasUserRated && (
                  <p className="text-xs text-gray-400">
                    اضغطي على النجوم لتقييم هذا المنتج
                  </p>
                )}
                {hasUserRated && (
                  <p className="text-xs text-green-600">
                    ✓ تم تقييمك: {userRating} نجوم
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                {hasDiscount ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-pink-600">
                      {(product.price || 0).toFixed(2)} دينار ليبي
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {(product.originalPrice || 0).toFixed(2)} دينار ليبي
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                      خصم {Math.round((((product.originalPrice || 0) - (product.price || 0)) / (product.originalPrice || 1)) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {(product.price || 0).toFixed(2)} دينار ليبي
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="space-y-2">
                {(product.stock || 0) > 0 ? (
                  <p className="text-green-600 font-medium">
                    متوفر
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">غير متوفر</p>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">الكمية:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* أزرار الشراء */}
                <div className="space-y-3">
                  {/* زر اشتري الآن */}
                  <button
                    onClick={handleBuyNow}
                    disabled={(product.stock || 0) === 0}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                      (product.stock || 0) > 0
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {(product.stock || 0) > 0 ? 'اشتري الآن' : 'نفذ المخزون'}
                  </button>

                  {/* زر أضف إلى السلة */}
                  <button
                    onClick={handleAddToCart}
                    disabled={(product.stock || 0) === 0}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                      isAdding
                        ? 'bg-green-500 text-white border-2 border-green-500'
                        : (product.stock || 0) > 0
                        ? 'bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAdding 
                      ? 'تم الإضافة! ✓' 
                      : (product.stock || 0) > 0 
                        ? 'أضف إلى السلة' 
                        : 'نفذ المخزون'
                    }
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {product.benefits && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">الفوائد</h3>
                    <p className="text-gray-700 leading-relaxed">{product.benefits}</p>
                  </div>
                )}

                {product.ingredients && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">المكونات</h3>
                    <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
                  </div>
                )}

                {product.usage && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">طريقة الاستخدام</h3>
                    <p className="text-gray-700 leading-relaxed">{product.usage}</p>
                  </div>
                )}

                {product.weight && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">الحجم/الوزن</h3>
                    <p className="text-gray-700">{product.weight}</p>
                  </div>
                )}

                {product.sku && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">رمز المنتج</h3>
                    <p className="text-gray-700">{product.sku}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Button - Bottom */}
      {product && (
        <div className="mt-8 animate-pulse">
          <button
            onClick={handleBuyNow}
            disabled={(product?.stock || 0) === 0}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl ${
              (product?.stock || 0) > 0
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {(product?.stock || 0) > 0 ? 'اشتري الآن' : 'نفذ المخزون'}
          </button>
        </div>
      )}
    </div>
  );
} 