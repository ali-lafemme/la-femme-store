'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface Admin {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

interface AdminHeaderProps {
  admin?: Admin;
}

const AdminHeader = ({ admin }: AdminHeaderProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <Link href="/admin" className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">La Femme</h1>
                <p className="text-sm text-gray-500">لوحة التحكم</p>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* View Store Button */}
            <Link
              href="/"
              target="_blank"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              عرض المتجر
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {admin?.name?.charAt(0) || admin?.username?.charAt(0) || 'أ'}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {admin?.name || admin?.username || 'المدير'}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{admin?.name || admin?.username}</div>
                  <div className="text-gray-500">{admin?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 