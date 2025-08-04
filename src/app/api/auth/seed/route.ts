import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // التحقق من وجود أدمن بالفعل
    const existingAdmin = await prisma.admin.findFirst();
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'يوجد أدمن بالفعل في النظام' },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // إنشاء الأدمن الافتراضي
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@lafemme.com',
        name: 'مدير النظام',
        role: 'admin',
        isActive: true,
      },
    });

    // إرجاع البيانات بدون كلمة المرور
    const { password: _, ...adminData } = admin;

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الأدمن الافتراضي بنجاح',
      data: adminData,
    });

  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إنشاء الأدمن' },
      { status: 500 }
    );
  }
} 