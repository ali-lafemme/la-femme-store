'use client';

import { useState, useEffect } from 'react';

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
}

const HeroSlider = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides');
        const data = await response.json();
        
        if (data.success) {
          // تصفية الشرائح المفعلة فقط وترتيبها
          const activeSlides = data.data
            .filter((slide: HeroSlide) => slide.isActive)
            .sort((a: HeroSlide, b: HeroSlide) => a.order - b.order);
          
          setSlides(activeSlides);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // تغيير الشريحة كل 5 ثواني

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    // عرض شريحة افتراضية إذا لم تكن هناك شرائح
    return (
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="text-center lg:text-right">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                    مرحباً بك في La Femme
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-2xl text-pink-600 font-semibold mb-3 sm:mb-4">
                    متجر التجميل والعناية بالجمال
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 px-4 lg:px-0">
                    اكتشفي مجموعة رائعة من منتجات التجميل والعناية بالبشرة
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <a href="/products" className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                      تسوقي الآن
                      <svg className="mr-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-full h-80 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600">صورة المنتج</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`}>
            {slide.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            )}
            {!slide.image && <div className="absolute inset-0 bg-black/20"></div>}
          </div>
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="text-center lg:text-right">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
                    {slide.title}
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-2xl text-white/90 font-semibold mb-3 sm:mb-4">
                    {slide.subtitle}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 px-4 lg:px-0">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <a 
                      href={slide.ctaLink} 
                      className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      {slide.ctaText}
                      <svg className="mr-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
                {slide.image && (
                  <div className="hidden lg:block">
                    <div className="w-full h-80 rounded-2xl overflow-hidden">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {!slide.image && (
                  <div className="hidden lg:block">
                    <div className="w-full h-80 bg-white/20 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <p className="text-white/80">صورة الشريحة</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider; 