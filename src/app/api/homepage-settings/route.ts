import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب إعدادات الصفحة الرئيسية
export async function GET() {
  try {
    const settings = await prisma.homepageSettings.findFirst();

    if (!settings) {
      // إنشاء إعدادات افتراضية إذا لم تكن موجودة
      const defaultSettings = await prisma.homepageSettings.create({
        data: {
          featuredProductsCount: 8,
          bestSellersCount: 8,
          newProductsCount: 8,
          showOffers: true,
          showBestSellers: true,
          showNewProducts: true,
          showQuickCategories: true,
          showFeatures: true
        }
      });

      return NextResponse.json({
        success: true,
        data: defaultSettings
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب إعدادات الصفحة الرئيسية' },
      { status: 500 }
    );
  }
}

// PUT - تحديث إعدادات الصفحة الرئيسية
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      featuredProductsCount,
      bestSellersCount,
      newProductsCount,
      showOffers,
      showBestSellers,
      showNewProducts,
      showQuickCategories,
      showFeatures
    } = body;

    const settings = await prisma.homepageSettings.upsert({
      where: { id: '1' }, // استخدام ID ثابت
      update: {
        featuredProductsCount: featuredProductsCount || 8,
        bestSellersCount: bestSellersCount || 8,
        newProductsCount: newProductsCount || 8,
        showOffers: showOffers ?? true,
        showBestSellers: showBestSellers ?? true,
        showNewProducts: showNewProducts ?? true,
        showQuickCategories: showQuickCategories ?? true,
        showFeatures: showFeatures ?? true
      },
      create: {
        id: '1',
        featuredProductsCount: featuredProductsCount || 8,
        bestSellersCount: bestSellersCount || 8,
        newProductsCount: newProductsCount || 8,
        showOffers: showOffers ?? true,
        showBestSellers: showBestSellers ?? true,
        showNewProducts: showNewProducts ?? true,
        showQuickCategories: showQuickCategories ?? true,
        showFeatures: showFeatures ?? true
      }
    });

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'تم تحديث إعدادات الصفحة الرئيسية بنجاح'
    });
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث إعدادات الصفحة الرئيسية' },
      { status: 500 }
    );
  }
} 