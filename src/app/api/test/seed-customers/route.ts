import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // إنشاء عملاء تجريبيين
    const customers = [
      {
        email: 'ahmed@example.com',
        name: 'أحمد محمد',
        phone: '0501234567',
        address: 'الرياض، شارع الملك فهد',
        role: 'CUSTOMER',
      },
      {
        email: 'fatima@example.com',
        name: 'فاطمة علي',
        phone: '0502345678',
        address: 'جدة، شارع التحلية',
        role: 'CUSTOMER',
      },
      {
        email: 'omar@example.com',
        name: 'عمر خالد',
        phone: '0503456789',
        address: 'الدمام، شارع الملك خالد',
        role: 'CUSTOMER',
      },
      {
        email: 'noor@example.com',
        name: 'نور أحمد',
        phone: '0504567890',
        address: 'مكة، شارع العزيزية',
        role: 'CUSTOMER',
      },
      {
        email: 'sara@example.com',
        name: 'سارة محمود',
        phone: '0505678901',
        address: 'المدينة، شارع الملك عبدالله',
        role: 'CUSTOMER',
      },
    ];

    // إنشاء العملاء
    const createdCustomers = [];
    for (const customerData of customers) {
      const customer = await (prisma as any).user.upsert({
        where: { email: customerData.email },
        update: {},
        create: customerData,
      });
      createdCustomers.push(customer);
    }

    return NextResponse.json({
      success: true,
      message: `تم إنشاء ${createdCustomers.length} عميل تجريبي بنجاح`,
      data: createdCustomers,
    });
  } catch (error) {
    console.error('Error seeding customers:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء العملاء التجريبية' },
      { status: 500 }
    );
  }
}     