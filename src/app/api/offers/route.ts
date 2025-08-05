import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب جميع العروض
export async function GET() {
  try {
    const offers = await (prisma as any).offer.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: offers
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب العروض' },
      { status: 500 }
    );
  }
}

// POST - إنشاء عرض جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, discountPercentage, originalPrice, discountedPrice, categoryId, image, isActive, order, expiresAt } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !description || !discountPercentage) {
      return NextResponse.json(
        { success: false, error: 'العنوان والوصف ونسبة الخصم مطلوبة' },
        { status: 400 }
      );
    }

    const offer = await (prisma as any).offer.create({
      data: {
        title,
        description,
        discountPercentage,
        originalPrice: originalPrice || 0,
        discountedPrice: discountedPrice || 0,
        categoryId: categoryId || null,
        image: image || '',
        isActive: isActive ?? true,
        order: order || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: offer,
      message: 'تم إنشاء العرض بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء العرض' },
      { status: 500 }
    );
  }
} 