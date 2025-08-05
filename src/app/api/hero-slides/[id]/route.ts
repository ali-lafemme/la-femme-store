import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب شريحة واحدة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const slide = await (prisma as any).heroSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      return NextResponse.json(
        { success: false, error: 'الشريحة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: slide
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الشريحة' },
      { status: 500 }
    );
  }
}

// PUT - تحديث شريحة
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, description, image, ctaText, ctaLink, bgColor, isActive, order } = body;

    // التحقق من وجود الشريحة
    const existingSlide = await (prisma as any).heroSlide.findUnique({
      where: { id }
    });

    if (!existingSlide) {
      return NextResponse.json(
        { success: false, error: 'الشريحة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من البيانات المطلوبة
    if (!title || !subtitle || !description) {
      return NextResponse.json(
        { success: false, error: 'العنوان والعنوان الفرعي والوصف مطلوبة' },
        { status: 400 }
      );
    }

    const updatedSlide = await (prisma as any).heroSlide.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        image: image || '',
        ctaText: ctaText || 'اشتري الآن',
        ctaLink: ctaLink || '/',
        bgColor: bgColor || 'from-pink-400 to-purple-500',
        isActive: isActive ?? true,
        order: order || 0
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSlide,
      message: 'تم تحديث الشريحة بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الشريحة' },
      { status: 500 }
    );
  }
}

// DELETE - حذف شريحة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // التحقق من وجود الشريحة
    const existingSlide = await (prisma as any).heroSlide.findUnique({
      where: { id }
    });

    if (!existingSlide) {
      return NextResponse.json(
        { success: false, error: 'الشريحة غير موجودة' },
        { status: 404 }
      );
    }

    await (prisma as any).heroSlide.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الشريحة بنجاح'
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الشريحة' },
      { status: 500 }
    );
  }
} 