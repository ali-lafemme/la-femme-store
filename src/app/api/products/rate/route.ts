import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { productId, rating } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة' },
        { status: 400 }
      );
    }

    // الحصول على المنتج الحالي
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { rating: true, reviewCount: true }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // حساب التقييم الجديد
    const currentTotal = product.rating * product.reviewCount;
    const newTotal = currentTotal + rating;
    const newReviewCount = product.reviewCount + 1;
    const newAverageRating = newTotal / newReviewCount;

    // تحديث المنتج في قاعدة البيانات
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(newAverageRating * 10) / 10,
        reviewCount: newReviewCount
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل التقييم بنجاح',
      data: {
        rating: updatedProduct.rating,
        reviewCount: updatedProduct.reviewCount
      }
    });

  } catch (error) {
    console.error('Error rating product:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تسجيل التقييم' },
      { status: 500 }
    );
  }
}
