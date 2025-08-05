import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب فئة واحدة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await (prisma as any).category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'الفئة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        productCount: category._count.products,
      },
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الفئة' },
      { status: 500 }
    );
  }
}

// PUT - تحديث فئة
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // التحقق من وجود الفئة
    const existingCategory = await (prisma as any).category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'الفئة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من عدم تكرار اسم الفئة إذا تم تغييره
    if (body.name && body.name !== existingCategory.name) {
      const duplicateCategory = await (prisma as any).category.findUnique({
        where: { name: body.name },
      });

      if (duplicateCategory) {
        return NextResponse.json(
          { success: false, error: 'اسم الفئة موجود مسبقاً' },
          { status: 400 }
        );
      }
    }

    // تحديث الفئة
    const updatedCategory = await (prisma as any).category.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedCategory,
        productCount: updatedCategory._count.products,
      },
      message: 'تم تحديث الفئة بنجاح',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الفئة' },
      { status: 500 }
    );
  }
}

// DELETE - حذف فئة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // التحقق من وجود الفئة
    const existingCategory = await (prisma as any).category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'الفئة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من وجود منتجات في الفئة
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { success: false, error: 'لا يمكن حذف الفئة لوجود منتجات مرتبطة بها' },
        { status: 400 }
      );
    }

    // حذف الفئة
    await (prisma as any).category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الفئة بنجاح',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الفئة' },
      { status: 500 }
    );
  }
} 