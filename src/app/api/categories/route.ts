import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب جميع الفئات
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: category._count.products,
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الفئات' },
      { status: 500 }
    );
  }
}

// POST - إضافة فئة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    // التحقق من البيانات المطلوبة
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'اسم الفئة مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار اسم الفئة
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'اسم الفئة موجود مسبقاً' },
        { status: 400 }
      );
    }

    // إنشاء الفئة
    const category = await prisma.category.create({
      data: {
        name,
        description,
        image,
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'تم إضافة الفئة بنجاح',
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إضافة الفئة' },
      { status: 500 }
    );
  }
} 