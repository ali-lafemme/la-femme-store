'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

import { Product } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [starRating, setStarRating] = useState(3);
  const [isHovering, setIsHovering] = useState(false);
  const [dynamicRating, setDynamicRating] = useState(3); // تقييم افتراضي 3 نجوم
  const [reviewCount, setReviewCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hasUserRated, setHasUserRated] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
          
          // توليد تقييم ديناميكي بناءً على المبيعات والخصائص
          const generateDynamicRating = () => {
            // استخدام ID المنتج كبذرة لتوليد تقييم ثابت لكل منتج
            const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = (seed * 9301 + 49297) % 233280;
            const normalized = random / 233280;
            
            let baseRating = 3; // تقييم افتراضي 3 نجوم
            
            // إذا كان المنتج جديد
            if (data.data.isNew) {
              baseRating += 0.3;
            }
            
            // إذا كان من الأكثر مبيعاً
            if (data.data.isBestSeller) {
              baseRating += 0.5;
            }
            
            // إذا كان السعر مرتفع (منتج فاخر)
            if (data.data.price > 100) {
              baseRating += 0.2;
            }
            
            // إضافة بعض العشوائية بناءً على ID المنتج
            const randomFactor = (normalized - 0.5) * 1.5; // -0.75 إلى 0.75
            const finalRating = Math.max(2, Math.min(5, baseRating + randomFactor));
            
            return Math.round(finalRating * 10) / 10; // تقريب إلى رقم عشري واحد
          };
          
          const generateReviewCount = (rating: number) => {
            const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = (seed * 9301 + 49297) % 233280;
            const normalized = random / 233280;
            
            let baseCount = 15; // عدد افتراضي
            
            // إذا كان التقييم عالي، عدد التقييمات أكثر
            if (rating >= 4) {
              baseCount = 30 + Math.floor(normalized * 70); // 30-100
            } else if (rating >= 3) {
              baseCount = 15 + Math.floor(normalized * 35); // 15-50
            } else {
              baseCount = 5 + Math.floor(normalized * 15); // 5-20
            }
            
            return baseCount;
          };
          
          const rating = generateDynamicRating();
          const count = generateReviewCount(rating);
          
          setDynamicRating(rating);
          setReviewCount(count);
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
    if (!product) return;
    
    // إضافة المنتج للكمية المحددة
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    alert('تم إضافة المنتج إلى السلة بنجاح!');
  };

  const handleStarClick = (rating: number) => {
    if (!hasUserRated) {
      setUserRating(rating);
      setHasUserRated(true);
      
      // تحديث التقييم العام بناءً على تقييم المستخدم
      const newTotalRating = (dynamicRating * reviewCount + rating) / (reviewCount + 1);
      setDynamicRating(Math.round(newTotalRating * 10) / 10);
      setReviewCount(reviewCount + 1);
      
      // حفظ التقييم في localStorage
      const ratings = JSON.parse(localStorage.getItem('productRatings') || '{}');
      ratings[productId] = rating;
      localStorage.setItem('productRatings', JSON.stringify(ratings));
      
      alert('شكراً لك! تم تسجيل تقييمك بنجاح.');
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
      <div className="py-8">
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
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={images[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
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
                    متوفر ({(product.stock || 0)} قطعة)
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">نفذ المخزون</p>
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

                <button
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    (product.stock || 0) > 0
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {(product.stock || 0) > 0 ? 'أضف إلى السلة' : 'نفذ المخزون'}
                </button>
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
      <Footer />
    </div>
  );
} 