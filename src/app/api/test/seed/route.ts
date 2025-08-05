import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - إنشاء بيانات تجريبية
export async function POST(request: NextRequest) {
  try {
    // إنشاء الفئات
    const categories = await Promise.all([
      (prisma as any).category.create({
        data: {
          name: 'المكياج',
          description: 'جميع منتجات المكياج والعناية بالجمال',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
        },
      }),
      (prisma as any).category.create({
        data: {
          name: 'العناية بالبشرة',
          description: 'منتجات العناية بالبشرة والكريمات',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        },
      }),
      (prisma as any).category.create({
        data: {
          name: 'العناية بالشعر',
          description: 'منتجات العناية بالشعر والزيوت',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
        },
      }),
      (prisma as any).category.create({
        data: {
          name: 'الأظافر',
          description: 'منتجات العناية بالأظافر والطلاء',
          image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
        },
      }),
    ]);

    // جلب معرفات الفئات
    const makeupCategory = categories[0];
    const skincareCategory = categories[1];
    const haircareCategory = categories[2];
    const nailsCategory = categories[3];

    // إنشاء المنتجات
    const products = await Promise.all([
      // منتجات المكياج
      (prisma as any).product.create({
        data: {
          name: 'أحمر شفاه مات',
          description: 'أحمر شفاه مات طويل الأمد بألوان رائعة',
          price: 45.00,
          originalPrice: 60.00,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
          images: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500,https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
          categoryId: makeupCategory.id,
          stock: 50,
          rating: 4.5,
          reviewCount: 128,
          isNew: true,
          isBestSeller: true,
        },
      }),
      (prisma as any).product.create({
        data: {
          name: 'كونسيلر عالي التغطية',
          description: 'كونسيلر يخفي العيوب ويوفر تغطية مثالية',
          price: 35.00,
          originalPrice: 45.00,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          images: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          categoryId: makeupCategory.id,
          stock: 30,
          rating: 4.3,
          reviewCount: 89,
          isNew: false,
          isBestSeller: true,
        },
      }),
      (prisma as any).product.create({
        data: {
          name: 'ماسكارا طويلة الأمد',
          description: 'ماسكارا تعطي رموش طويلة وكثيفة',
          price: 25.00,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
          images: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
          categoryId: makeupCategory.id,
          stock: 75,
          rating: 4.7,
          reviewCount: 156,
          isNew: false,
          isBestSeller: false,
        },
      }),

      // منتجات العناية بالبشرة
      (prisma as any).product.create({
        data: {
          name: 'كريم مرطب للوجه',
          description: 'كريم مرطب عميق للبشرة الجافة',
          price: 55.00,
          originalPrice: 70.00,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          images: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          categoryId: skincareCategory.id,
          stock: 40,
          rating: 4.6,
          reviewCount: 203,
          isNew: true,
          isBestSeller: true,
        },
      }),
      (prisma as any).product.create({
        data: {
          name: 'سيروم فيتامين سي',
          description: 'سيروم فيتامين سي لتوحيد لون البشرة',
          price: 65.00,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          images: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          categoryId: skincareCategory.id,
          stock: 25,
          rating: 4.4,
          reviewCount: 67,
          isNew: false,
          isBestSeller: false,
        },
      }),

      // منتجات العناية بالشعر
      (prisma as any).product.create({
        data: {
          name: 'زيت الأرغان للشعر',
          description: 'زيت الأرغان الطبيعي لتغذية الشعر',
          price: 40.00,
          originalPrice: 55.00,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
          images: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
          categoryId: haircareCategory.id,
          stock: 60,
          rating: 4.8,
          reviewCount: 134,
          isNew: false,
          isBestSeller: true,
        },
      }),
      (prisma as any).product.create({
        data: {
          name: 'شامبو للشعر الجاف',
          description: 'شامبو مخصص للشعر الجاف والمتضرر',
          price: 30.00,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
          images: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
          categoryId: haircareCategory.id,
          stock: 45,
          rating: 4.2,
          reviewCount: 98,
          isNew: true,
          isBestSeller: false,
        },
      }),

      // منتجات الأظافر
      (prisma as any).product.create({
        data: {
          name: 'طلاء أظافر طويل الأمد',
          description: 'طلاء أظافر مقاوم للتقشير',
          price: 20.00,
          originalPrice: 30.00,
          image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
          images: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
          categoryId: nailsCategory.id,
          stock: 100,
          rating: 4.1,
          reviewCount: 76,
          isNew: false,
          isBestSeller: false,
        },
      }),
      (prisma as any).product.create({
        data: {
          name: 'زيت تقوية الأظافر',
          description: 'زيت لتقوية الأظافر ومنع التكسر',
          price: 15.00,
          image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
          images: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500',
          categoryId: nailsCategory.id,
          stock: 80,
          rating: 4.0,
          reviewCount: 45,
          isNew: true,
          isBestSeller: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء البيانات التجريبية بنجاح',
      data: {
        categories: categories.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء البيانات التجريبية' },
      { status: 500 }
    );
  }
} 