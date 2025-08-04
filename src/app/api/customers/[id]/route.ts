import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب عميل واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    const customerWithStats = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.totalAmount, 0),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: customerWithStats,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب العميل' },
      { status: 500 }
    );
  }
}

// PUT - تحديث العميل
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // التحقق من وجود العميل
    const existingCustomer = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من صحة البيانات
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'الاسم والبريد الإلكتروني والهاتف مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    if (body.email !== existingCustomer.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        );
      }
    }

    // تحديث العميل
    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'تم تحديث العميل بنجاح',
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث العميل' },
      { status: 500 }
    );
  }
}

// DELETE - حذف العميل
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // التحقق من وجود العميل
    const existingCustomer = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    // حذف العميل (سيتم حذف الطلبات المرتبطة تلقائياً بسبب CASCADE)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف العميل بنجاح',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف العميل' },
      { status: 500 }
    );
  }
} 