import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - حذف جميع شرائح Hero
export async function DELETE() {
  try {
    await (prisma as any).heroSlide.deleteMany({});

    return NextResponse.json({
      success: true,
      message: 'تم حذف جميع الشرائح بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error deleting hero slides:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الشرائح' },
      { status: 500 }
    );
  }
} 