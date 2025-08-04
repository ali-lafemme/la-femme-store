'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/api';

interface CategoryHeroProps {
  categoryName: string;
  title: string;
  subtitle: string;
  gradientColors?: string;
}

const CategoryHero = ({ categoryName, title, subtitle, gradientColors = "from-pink-400 to-purple-500" }: CategoryHeroProps) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success) {
          // البحث المرن عن الفئة
          const cleanCategoryName = categoryName.trim();
          const foundCategory = data.data.find((cat: Category) => {
            const cleanCatName = cat.name.trim();
            return (
              cleanCatName === cleanCategoryName ||
              cleanCatName === cleanCategoryName + ' ' ||
              cleanCategoryName === cleanCatName + ' ' ||
              cleanCatName.includes(cleanCategoryName) ||
              cleanCategoryName.includes(cleanCatName)
            );
          });
          setCategory(foundCategory || null);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryName]);

  if (loading) {
    return (
      <div className={`bg-gradient-to-r ${gradientColors} text-white py-12 md:py-16 lg:py-20`}>
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 md:h-12 lg:h-16 bg-white/20 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-6 md:h-8 lg:h-10 bg-white/20 rounded mx-auto max-w-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${gradientColors} text-white py-12 md:py-16 lg:py-20 xl:py-24`}>
      {/* Background Image */}
      {category?.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${category.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Category Image (Mobile) */}
          {category?.image && (
            <div className="mb-6 md:hidden">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4 lg:mb-6 drop-shadow-lg leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 px-2 md:px-4 lg:px-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
          
          {/* Category Description (Desktop) */}
          {category?.description && (
            <div className="hidden md:block mt-6 lg:mt-8">
              <p className="text-sm lg:text-base opacity-80 max-w-2xl mx-auto leading-relaxed">
                {category.description}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 md:w-12 md:h-12 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 md:w-8 md:h-8 bg-white/5 rounded-full"></div>
      </div>
    </div>
  );
};

export default CategoryHero; 