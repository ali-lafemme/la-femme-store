import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب طلب واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الطلب' },
      { status: 500 }
    );
  }
}

// PUT - تحديث طلب
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // التحقق من وجود الطلب
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // تحديث الطلب
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        shippingAddress: body.shippingAddress,
        phone: body.phone,
        notes: body.notes,
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'تم تحديث الطلب بنجاح',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الطلب' },
      { status: 500 }
    );
  }
}

// DELETE - حذف طلب
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // التحقق من وجود الطلب
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // حذف الطلب (سيتم حذف العناصر المرتبطة تلقائياً)
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب بنجاح',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الطلب' },
      { status: 500 }
    );
  }
} 