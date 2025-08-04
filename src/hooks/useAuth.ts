'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // التحقق من وجود بيانات الأدمن في localStorage
    const adminData = localStorage.getItem('admin');
    
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (adminData: Admin) => {
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    router.push('/login');
  };

  const isAuthenticated = !!admin;

  return {
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
  };
} 