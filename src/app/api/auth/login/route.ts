import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // التحقق من وجود البيانات المطلوبة
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن الأدمن في قاعدة البيانات
    const admin = await prisma.admins.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من أن الحساب مفعل
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'الحساب معطل' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // تحديث آخر تسجيل دخول
    await prisma.admins.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // إرجاع بيانات الأدمن (بدون كلمة المرور)
    const { password: _, ...adminData } = admin;

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: adminData,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  }
} 