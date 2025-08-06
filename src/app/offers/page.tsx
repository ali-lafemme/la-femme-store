'use client';

import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';
import { Product, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await getProducts();
        const categoriesResponse = await getCategories();
        
        setProducts(productsResponse.data || []);
        setFilteredProducts(productsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // فلترة حسب الفئة
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category?.name === selectedCategory
      );
    }

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل العروض...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Header />
      
      {/* Category Hero Section */}
      <CategoryHero 
        categoryName="العروض"
        title="العروض والخصومات"

        gradientColors="from-red-400 to-orange-500"
      />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Filters and Search */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              {/* فلترة حسب الفئة */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base w-full sm:w-auto"
              >
                <option value="">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {/* البحث */}
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحثي في العروض..."
                  className="pl-10 pr-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base w-full sm:w-64"
                />
                <svg className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || selectedCategory ? 'لا توجد نتائج مطابقة' : 'لا توجد عروض متاحة حالياً'}
            </h3>
            <p className="text-sm md:text-base text-gray-500 px-4">
              {searchTerm || selectedCategory ? 'جربي تغيير معايير البحث' : 'تابعي صفحتنا للحصول على أحدث العروض والخصومات'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center mt-6 md:mt-8">
            <nav className="flex items-center space-x-1 md:space-x-2 space-x-reverse">
              <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors">
                السابق
              </button>
              <button className="px-2 py-1 md:px-3 md:py-2 bg-red-500 text-white rounded-lg text-xs md:text-sm">1</button>
              <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors">2</button>
              <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors">3</button>
              <button className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors">
                التالي
              </button>
            </nav>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 