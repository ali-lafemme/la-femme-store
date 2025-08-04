import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // ملاحظة: هذا API يعرض المنتجات الأكثر مبيعاً بناءً على الطلبيات المكتملة فقط (DELIVERED)

    // الحصول على المنتجات الأكثر مبيعاً بناءً على الطلبيات المكتملة فقط
    const bestSellers = await prisma.product.findMany({
      where: {
        stock: { gt: 0 }, // فقط المنتجات المتوفرة
      },
      include: {
        category: true,
        orderItems: {
          include: {
            order: true, // للحصول على حالة الطلب
          },
        },
      },
      take: limit,
    });

    // ترتيب النتائج حسب عدد الطلبيات المكتملة فقط
    const sortedBestSellers = bestSellers
      .map(product => {
        // حساب عدد الطلبيات المكتملة فقط
        const completedOrders = product.orderItems.filter(item => 
          item.order.status === 'DELIVERED'
        ).length;
        
        return {
          ...product,
          completedOrdersCount: completedOrders,
        };
      })
      .filter(product => product.completedOrdersCount > 0) // فقط المنتجات التي تم طلبها مكتملة
      .sort((a, b) => b.completedOrdersCount - a.completedOrdersCount);

    // تنظيف النتائج
    const cleanBestSellers = sortedBestSellers.map(product => {
      const { orderItems, completedOrdersCount, ...cleanProduct } = product;
      return cleanProduct;
    });

    return NextResponse.json({
      success: true,
      data: cleanBestSellers,
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الأكثر مبيعاً' },
      { status: 500 }
    );
  }
} 