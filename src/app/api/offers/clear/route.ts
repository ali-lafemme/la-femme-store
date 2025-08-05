import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - حذف جميع العروض
export async function DELETE() {
  try {
    await (prisma as any).offer.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'تم حذف جميع العروض بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error deleting offers:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف العروض' },
      { status: 500 }
    );
  }
} 