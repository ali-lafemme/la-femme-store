import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب جميع المنتجات المميزة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const whereClause: {
      isActive: boolean;
      section?: string;
    } = {
      isActive: true
    };

    // إضافة فلترة حسب القسم إذا تم تحديده
    if (section) {
      whereClause.section = section;
    }

    const homepageProducts = await (prisma as any).homepageProducts.findMany({
      where: whereClause,
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: homepageProducts
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching homepage products:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في جلب المنتجات المميزة' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج مميز
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, section, order, isActive } = body;

    // التحقق من وجود المنتج
    const product = await (prisma as any).product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من عدم وجود المنتج في نفس القسم
    const existingProduct = await (prisma as any).homepageProducts.findFirst({
      where: {
        productId,
        section
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'المنتج موجود بالفعل في هذا القسم' },
        { status: 400 }
      );
    }

    const homepageProduct = await (prisma as any).homepageProducts.create({
      data: {
        productId,
        section,
        order: order || 0,
        isActive: isActive ?? true
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: homepageProduct,
      message: 'تم إضافة المنتج بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error creating homepage product:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في إضافة المنتج' },
      { status: 500 }
    );
  }
} 