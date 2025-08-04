import { Product } from '@/lib/api';
import Link from 'next/link';

interface RecentProductsProps {
  products: Product[];
}

const RecentProducts = ({ products }: RecentProductsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">المنتجات الحديثة</h3>
          <Link
            href="/admin/products"
            className="text-pink-600 hover:text-pink-700 text-sm font-medium"
          >
            عرض الكل
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {products.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">لا توجد منتجات حديثة</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="px-6 py-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.category.name} • {product.price.toFixed(2)} دينار ليبي
                  </p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {product.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      جديد
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      الأكثر مبيعاً
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ المخزون'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentProducts; 