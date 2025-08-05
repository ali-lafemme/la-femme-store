import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب جميع شرائح Hero
export async function GET() {
  try {
    const slides = await (prisma as any).heroSlide.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: slides
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب شرائح Hero' },
      { status: 500 }
    );
  }
}

// POST - إنشاء شريحة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, description, image, ctaText, ctaLink, bgColor, isActive, order } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !subtitle || !description) {
      return NextResponse.json(
        { success: false, error: 'العنوان والعنوان الفرعي والوصف مطلوبة' },
        { status: 400 }
      );
    }

    const slide = await (prisma as any).heroSlide.create({
      data: {
        title,
        subtitle,
        description,
        image: image || '',
        ctaText: ctaText || 'اشتري الآن',
        ctaLink: ctaLink || '/',
        bgColor: bgColor || 'from-pink-400 to-purple-500',
        isActive: isActive ?? true,
        order: parseInt(order) || 0
      }
    });

    return NextResponse.json({
      success: true,
      data: slide,
      message: 'تم إنشاء الشريحة بنجاح'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الشريحة' },
      { status: 500 }
    );
  }
} 