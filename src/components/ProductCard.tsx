'use client';

import { Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [starRating, setStarRating] = useState(3); // 3 نجوم افتراضية
  const [isHovering, setIsHovering] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock > 0) {
      setIsAdding(true);
      addItem(product);
      
      // إظهار رسالة نجاح
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  // دالة معالجة النجوم التفاعلية
  const handleStarClick = (starIndex: number) => {
    setStarRating(starIndex + 1);
  };

  const handleStarHover = (starIndex: number) => {
    setIsHovering(true);
  };

  const handleStarLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <a href={`/product/${product.id}`} className="block">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </a>
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              جديد
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              الأكثر مبيعاً
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
          <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
            {product.category.name}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Product Name */}
        <a href={`/product/${product.id}`} className="block">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </a>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Interactive Star Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleStarClick(i)}
                onMouseEnter={() => handleStarHover(i)}
                onMouseLeave={handleStarLeave}
                className="transition-all duration-200 hover:scale-110 focus:outline-none"
              >
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isHovering
                      ? i <= starRating - 1
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                      : i < starRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <span className="text-gray-600 text-xs sm:text-sm mr-2">
            ({starRating}/5)
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {product.price.toFixed(2)} دينار ليبي
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-xs sm:text-sm">
                {product.originalPrice.toFixed(2)} دينار ليبي
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ المخزون'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
            product.stock > 0 && !isAdding
              ? 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-105'
              : product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white cursor-not-allowed'
          }`}
        >
          {isAdding 
            ? 'تم الإضافة! ✓' 
            : product.stock > 0 
            ? 'أضف للسلة' 
            : 'نفذ المخزون'
          }
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 