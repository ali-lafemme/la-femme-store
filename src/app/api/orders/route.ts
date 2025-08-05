import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب جميع الطلبات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: {
      status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    } = {};
    if (status) {
      where.status = status as 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    }

    // جلب الطلبات مع العلاقات
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // جلب العدد الإجمالي للطلبات
    const total = await prisma.order.count({ where });

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الطلبات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء طلب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, shippingAddress, phone, notes, totalAmount } = body;

    // التحقق من البيانات المطلوبة
    if (!userId || !items || !shippingAddress || !phone || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'جميع البيانات مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 400 }
      );
    }

    // إنشاء الطلب مع العناصر
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        phone,
        notes,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'تم إنشاء الطلب بنجاح',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الطلب' },
      { status: 500 }
    );
  }
} 