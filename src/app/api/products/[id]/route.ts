import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب منتج واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المنتج' },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // التحقق من وجود المنتج
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من وجود الفئة إذا تم تغييرها
    if (body.categoryId && body.categoryId !== existingProduct.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { success: false, error: 'الفئة غير موجودة' },
          { status: 400 }
        );
      }
    }

    // تحديث المنتج
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        image: body.image,
        images: body.images,
        categoryId: body.categoryId,
        stock: body.stock,
        rating: body.rating,
        reviewCount: body.reviewCount,
        isNew: body.isNew,
        isBestSeller: body.isBestSeller,
        isActive: body.isActive,
        ingredients: body.ingredients,
        usage: body.usage,
        benefits: body.benefits,
        weight: body.weight,
        brand: body.brand,
        sku: body.sku,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'تم تحديث المنتج بنجاح',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المنتج' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // التحقق من وجود المنتج
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // حذف المنتج
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج بنجاح',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المنتج' },
      { status: 500 }
    );
  }
} 