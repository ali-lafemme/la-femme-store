import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // الحصول على المستخدمين والمنتجات الموجودة
    const users = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
    const products = await prisma.product.findMany({ take: 5 });
    
    if (users.length === 0 || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'يجب إنشاء عملاء ومنتجات أولاً' },
        { status: 400 }
      );
    }

    // إنشاء طلبات تجريبية
    const orders = [];
    const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // إنشاء الطلب
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          status: status as any,
          totalAmount: product.price * (Math.floor(Math.random() * 3) + 1),
          shippingAddress: user.address || 'عنوان تجريبي',
          phone: user.phone,
          notes: `طلب تجريبي رقم ${i + 1}`,
          items: {
            create: {
              productId: product.id,
              quantity: Math.floor(Math.random() * 3) + 1,
              price: product.price,
            }
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true
        }
      });
      
      orders.push(order);
    }

    return NextResponse.json({
      success: true,
      message: `تم إنشاء ${orders.length} طلب تجريبي بنجاح`,
      data: orders,
    });
  } catch (error) {
    console.error('Error seeding orders:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الطلبات التجريبية' },
      { status: 500 }
    );
  }
} 