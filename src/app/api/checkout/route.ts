import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppNotification, createOrderNotification } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    // إضافة تفاصيل التشخيص
    console.log('=== ORDER CREATION START ===');
    console.log('User-Agent:', request.headers.get('user-agent'));
    console.log('Content-Type:', request.headers.get('content-type'));
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
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
      console.log('Missing required fields:', {
        customerName: !!customerName,
        phone: !!phone,
        shippingAddress: !!shippingAddress,
        items: !!items,
        totalAmount: !!totalAmount
      });
      return NextResponse.json(
        { success: false, error: 'جميع البيانات المطلوبة يجب أن تكون موجودة' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      console.log('Empty items array');
      return NextResponse.json(
        { success: false, error: 'السلة فارغة' },
        { status: 400 }
      );
    }

    console.log('Creating/updating user...');
    // إنشاء مستخدم مؤقت أو البحث عن مستخدم موجود
    let user = await (prisma as any).user.findFirst({
      where: { phone }
    });

    if (!user) {
      console.log('Creating new user...');
      // إنشاء مستخدم جديد
      user = await (prisma as any).user.create({
        data: {
          name: customerName,
          email: customerEmail || null,
          phone,
          address: shippingAddress,
          role: 'CUSTOMER',
        },
      });
      console.log('New user created:', user.id);
    } else {
      console.log('Updating existing user...');
      // تحديث بيانات المستخدم إذا كان موجود
      user = await (prisma as any).user.update({
        where: { id: user.id },
        data: {
          name: customerName,
          email: customerEmail || user.email,
          address: shippingAddress,
        },
      });
      console.log('User updated:', user.id);
    }

    console.log('Checking product stock...');
    // التحقق من توفر الكمية وتحديث المخزون
    for (const item of items) {
      const product = await (prisma as any).product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        console.log('Product not found:', item.productId);
        return NextResponse.json(
          { success: false, error: `المنتج غير موجود: ${item.name}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        console.log('Insufficient stock:', { product: product.name, available: product.stock, requested: item.quantity });
        return NextResponse.json(
          { success: false, error: `الكمية المتوفرة غير كافية للمنتج: ${product.name}` },
          { status: 400 }
        );
      }

      // تحديث المخزون
      await (prisma as any).product.update({
        where: { id: item.productId },
        data: {
          stock: product.stock - item.quantity
        }
      });
      console.log('Stock updated for product:', product.name);
    }

    console.log('Creating order...');
    // إنشاء الطلب
    const order = await (prisma as any).order.create({
      data: {
        userId: user.id,
        totalAmount,
        shippingAddress,
        phone,
        notes: notes || null,
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

    console.log('Order created successfully:', order.id);

    // إرسال إشعار الواتساب (مع معالجة الأخطاء)
    try {
      const orderForNotification = {
        ...order,
        notes: order.notes || undefined,
        createdAt: order.createdAt.toISOString()
      };
      const notificationMessage = createOrderNotification(orderForNotification);
      const whatsappResult = await sendWhatsAppNotification(notificationMessage);
      
      if (whatsappResult.success) {
        console.log('WhatsApp notification sent successfully');
      } else {
        console.error('Failed to send WhatsApp notification:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.error('Error in WhatsApp notification:', whatsappError);
      // لا نوقف العملية إذا فشل الواتساب
    }

    console.log('=== ORDER CREATION SUCCESS ===');
    return NextResponse.json({
      success: true,
      data: order,
      message: 'تم إنشاء الطلب بنجاح',
    });

  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error creating order:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الطلب' },
      { status: 500 }
    );
  }
} 