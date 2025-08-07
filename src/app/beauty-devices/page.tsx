'use client';

import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';
import { Product, Category } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BeautyDevicesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await getProducts({ category: 'الأجهزة الجمالية' });
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

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // الترتيب
    switch (sortBy) {
      case 'low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'best-sellers':
        filtered = filtered.filter(product => product.isBestSeller);
        break;
      default:
        // لا ترتيب
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header />
      
      {/* Category Hero Section */}
      <CategoryHero 
        categoryName="الأجهزة الجمالية"
        title="الأجهزة الجمالية"

        gradientColors="from-orange-400 to-amber-500"
      />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Filters and Search */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              {/* ترتيب حسب السعر */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base w-full sm:w-auto"
              >
                <option value="">ترتيب حسب السعر</option>
                <option value="low-to-high">من الأقل إلى الأعلى</option>
                <option value="high-to-low">من الأعلى إلى الأقل</option>
                <option value="best-sellers">الأكثر مبيعاً</option>
              </select>
              {/* البحث */}
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحثي عن منتج..."
                  className="pl-10 pr-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base w-full sm:w-64"
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
              {searchTerm || sortBy ? 'لا توجد نتائج مطابقة' : 'لا توجد منتجات متاحة'}
            </h3>
            <p className="text-sm md:text-base text-gray-500 px-4">
              {searchTerm || sortBy ? 'جربي تغيير معايير البحث' : 'سيتم إضافة أجهزة تجميلية قريباً'}
            </p>
          </div>
        )}


      </div>
      
      <Footer />
    </div>
  );
} 