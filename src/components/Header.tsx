'use client';

import { useState } from 'react';
import Link from 'next/link';
import CartIcon from './CartIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المكياج', href: '/makeup' },
    { name: 'العناية بالبشرة', href: '/skincare' },
    { name: 'العناية بالشعر', href: '/haircare' },
    { name: 'الأظافر', href: '/nails' },
    { name: 'حقائب', href: '/bags' },
    { name: 'اكسسورات', href: '/accessories' },
    { name: 'العطور', href: '/perfumes' },
    { name: 'الأجهزة الجمالية', href: '/beauty-devices' },
    { name: 'العيون', href: '/eyes' },
    { name: 'العروض', href: '/offers' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 group-hover:scale-110 transition-transform duration-200">
                <img 
                  src="/logo.lam.png" 
                  alt="La Femme" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  La Femme
                </h1>
                <p className="text-xs lg:text-sm text-gray-500">متجر التجميل والعناية</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-pink-500 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3 space-x-reverse lg:space-x-4 lg:space-x-reverse">
            {/* WhatsApp Button - Hidden on mobile */}
            <a
              href="https://wa.me/381615851106"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex bg-green-500 hover:bg-green-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-full items-center space-x-2 space-x-reverse transition-all duration-200 hover:scale-105 shadow-md"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 1.821.487 3.53 1.338 5.012L0 20l5.233-1.237A9.954 9.954 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm0 18c-1.821 0-3.53-.487-5.012-1.338L2.5 17.5l.838-2.488A7.954 7.954 0 012 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
              </svg>
              <span className="hidden lg:inline text-sm font-medium">تواصل معنا</span>
            </a>

            {/* WhatsApp Icon - Mobile only */}
            <a
              href="https://wa.me/381615851106"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 1.821.487 3.53 1.338 5.012L0 20l5.233-1.237A9.954 9.954 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm0 18c-1.821 0-3.53-.487-5.012-1.338L2.5 17.5l.838-2.488A7.954 7.954 0 012 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
              </svg>
            </a>

            {/* Cart Icon */}
            <CartIcon />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-pink-500 transition-all duration-200 hover:scale-110"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-pink-100 bg-white/95 backdrop-blur-md shadow-lg">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile WhatsApp Button */}
              <div className="px-4 pt-2">
                <a
                  href="https://wa.me/381615851106"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 space-x-reverse bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.477 0 10c0 1.821.487 3.53 1.338 5.012L0 20l5.233-1.237A9.954 9.954 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm0 18c-1.821 0-3.53-.487-5.012-1.338L2.5 17.5l.838-2.488A7.954 7.954 0 012 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                  </svg>
                  <span>تواصل معنا عبر الواتساب</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 