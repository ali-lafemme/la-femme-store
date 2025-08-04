import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب عرض واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    if (!offer) {
      return NextResponse.json(
        { success: false, error: 'العرض غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب العرض' },
      { status: 500 }
    );
  }
}

// PUT - تحديث عرض
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, discountPercentage, originalPrice, discountedPrice, categoryId, image, isActive, order, expiresAt } = body;

    // التحقق من وجود العرض
    const existingOffer = await prisma.offer.findUnique({
      where: { id }
    });

    if (!existingOffer) {
      return NextResponse.json(
        { success: false, error: 'العرض غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من البيانات المطلوبة
    if (!title || !description || !discountPercentage) {
      return NextResponse.json(
        { success: false, error: 'العنوان والوصف ونسبة الخصم مطلوبة' },
        { status: 400 }
      );
    }

    const updatedOffer = await prisma.offer.update({
      where: { id },
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
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedOffer,
      message: 'تم تحديث العرض بنجاح'
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث العرض' },
      { status: 500 }
    );
  }
}

// DELETE - حذف عرض
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // التحقق من وجود العرض
    const existingOffer = await prisma.offer.findUnique({
      where: { id }
    });

    if (!existingOffer) {
      return NextResponse.json(
        { success: false, error: 'العرض غير موجود' },
        { status: 404 }
      );
    }

    await prisma.offer.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف العرض بنجاح'
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف العرض' },
      { status: 500 }
    );
  }
} 