import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب عميل واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const customer = await (prisma as any).user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
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

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب العميل' },
      { status: 500 }
    );
  }
}

// PUT - تحديث عميل
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // التحقق من وجود العميل
    const existingCustomer = await (prisma as any).user.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من عدم تكرار البريد الإلكتروني إذا تم تغييره
    if (body.email && body.email !== existingCustomer.email) {
      const duplicateCustomer = await (prisma as any).user.findUnique({
        where: { email: body.email },
      });

      if (duplicateCustomer) {
        return NextResponse.json(
          { success: false, error: 'البريد الإلكتروني موجود مسبقاً' },
          { status: 400 }
        );
      }
    }

    // تحديث العميل
    const updatedCustomer = await (prisma as any).user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        role: body.role,
      },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
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

// DELETE - حذف عميل
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // التحقق من وجود العميل
    const existingCustomer = await (prisma as any).user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من وجود طلبات للعميل
    if (existingCustomer._count.orders > 0) {
      return NextResponse.json(
        { success: false, error: 'لا يمكن حذف العميل لوجود طلبات مرتبطة به' },
        { status: 400 }
      );
    }

    // حذف العميل
    await (prisma as any).user.delete({
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