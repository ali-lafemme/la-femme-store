'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CartIcon = () => {
  const { state } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(state.itemCount);
  }, [state.itemCount]);

  return (
    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-pink-500 transition-all duration-200 hover:scale-110">
      <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon; 