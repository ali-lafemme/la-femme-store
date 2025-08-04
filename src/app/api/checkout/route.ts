import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppNotification, createOrderNotification } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      phone, 
      shippingAddress, 
      notes, 
      items, 
      totalAmount 
    } = body;

    // التحقق من البيانات المطلوبة
    if (!customerName || !phone || !shippingAddress || !items || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'جميع البيانات المطلوبة يجب أن تكون موجودة' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'السلة فارغة' },
        { status: 400 }
      );
    }

    // إنشاء مستخدم مؤقت أو البحث عن مستخدم موجود
    let user = await prisma.user.findFirst({
      where: { phone }
    });

    if (!user) {
      // إنشاء مستخدم جديد
      user = await prisma.user.create({
        data: {
          name: customerName,
          email: customerEmail || null,
          phone,
          address: shippingAddress,
          role: 'CUSTOMER',
        },
      });
    } else {
      // تحديث بيانات المستخدم إذا كان موجود
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: customerName,
          email: customerEmail || user.email,
          address: shippingAddress,
        },
      });
    }

    // التحقق من توفر الكمية وتحديث المخزون
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `المنتج غير موجود: ${item.name}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `الكمية المتوفرة غير كافية للمنتج: ${product.name}` },
          { status: 400 }
        );
      }

      // تحديث المخزون
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: product.stock - item.quantity
        }
      });
    }

    // إنشاء الطلب
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        shippingAddress,
        phone,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
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

    // إرسال إشعار الواتساب
    const notificationMessage = createOrderNotification(order);
    const whatsappResult = await sendWhatsAppNotification(notificationMessage);
    
    if (whatsappResult.success) {
      console.log('WhatsApp notification sent successfully');
    } else {
      console.error('Failed to send WhatsApp notification:', whatsappResult.error);
    }

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