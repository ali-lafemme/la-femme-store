import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - حذف منتج مميز
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const homepageProduct = await (prisma as any).homepageProducts.findUnique({
      where: { id }
    });

    if (!homepageProduct) {
      return NextResponse.json(
        { success: false, error: 'المنتج المميز غير موجود' },
        { status: 404 }
      );
    }

    await (prisma as any).homepageProducts.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error deleting homepage product:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في حذف المنتج' },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج مميز
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { order, isActive } = body;

    const updatedHomepageProduct = await (prisma as any).homepageProducts.update({
      where: { id },
      data: {
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
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
      data: updatedHomepageProduct,
      message: 'تم تحديث المنتج بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error updating homepage product:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في تحديث المنتج' },
      { status: 500 }
    );
  }
} 