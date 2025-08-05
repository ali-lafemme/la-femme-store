import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// دالة للبحث عن الفئة بمرونة
async function findCategoryByName(categoryName: string) {
  // تنظيف اسم الفئة
  const cleanName = categoryName.trim();
  
  // محاولات البحث المختلفة
  const searchAttempts = [
    cleanName,
    cleanName.replace(/\s+/g, ' '), // إزالة المسافات المتعددة
    cleanName.replace(/\s+$/, ''), // إزالة المسافات من النهاية
    cleanName.replace(/^\s+/, ''), // إزالة المسافات من البداية
    cleanName + ' ', // إضافة مسافة في النهاية
    cleanName.replace(/\s+$/, '') + ' ', // إزالة المسافات من النهاية ثم إضافة مسافة
    cleanName.replace(/\s+$/, '') + '  ', // إضافة مسافتين في النهاية
  ];

  for (const attempt of searchAttempts) {
    const category = await (prisma as any).category.findFirst({
      where: {
        name: attempt
      }
    });
    
    if (category) {
      console.log(`Found category "${attempt}" with ID: ${category.id}`);
      return category;
    }
  }

  // إذا لم يتم العثور، جرب البحث الجزئي
  const partialMatch = await (prisma as any).category.findFirst({
    where: {
      name: {
        contains: cleanName
      }
    }
  });

  if (partialMatch) {
    console.log(`Found partial match "${partialMatch.name}" for "${cleanName}"`);
    return partialMatch;
  }

  return null;
}

// GET - جلب جميع المنتجات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');

    // بناء query
    const where: {
      isActive: boolean;
      categoryId?: string;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      isActive: true,
    };

    // فلتر حسب الفئة
    if (category) {
      console.log('Searching for category:', category);
      
      // البحث عن الفئة باستخدام النظام الذكي
      const categoryRecord = await findCategoryByName(category);
      
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
        console.log('Using category ID:', categoryRecord.id);
      } else {
        console.log('Category not found, using as ID:', category);
        // إذا لم يتم العثور على الفئة، استخدم category كـ ID
        where.categoryId = category;
      }
    }

    // البحث في الاسم والوصف
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }



    // جلب المنتجات
    const products = await (prisma as any).product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // جلب العدد الإجمالي
    const total = await (prisma as any).product.count({ where });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المنتجات' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      images,
      categoryId,
      stock,
      ingredients,
      usage,
      benefits,
      weight,
      brand,
      sku,
      isNew,
      isBestSeller,
      isActive,
    } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من وجود الفئة
    const category = await (prisma as any).category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'الفئة غير موجودة' },
        { status: 400 }
      );
    }

    // إنشاء المنتج
    const product = await (prisma as any).product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image,
        images: images || '',
        categoryId,
        stock: parseInt(stock) || 0,
        ingredients: ingredients || null,
        usage: usage || null,
        benefits: benefits || null,
        weight: weight || null,
        brand: brand || null,
        sku: sku || null,
        isNew: isNew || false,
        isBestSeller: isBestSeller || false,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'تم إضافة المنتج بنجاح',
    }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إضافة المنتج' },
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
} 