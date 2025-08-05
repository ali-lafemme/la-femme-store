const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSeedData() {
  try {
    // إنشاء الفئات
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'المكياج',
          description: 'منتجات التجميل والمكياج',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'العناية بالبشرة',
          description: 'منتجات العناية بالبشرة',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'العناية بالشعر',
          description: 'منتجات العناية بالشعر',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'الأظافر',
          description: 'منتجات الأظافر',
          image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'حقائب',
          description: 'الحقائب الأنيقة',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'اكسسورات',
          description: 'الإكسسوارات المميزة',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7be304?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'العطور',
          description: 'العطور الفاخرة',
          image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'الأجهزة الجمالية',
          description: 'الأجهزة التجميلية',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'
        }
      }),
      prisma.category.create({
        data: {
          name: 'العيون',
          description: 'منتجات العيون والرموش',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'
        }
      })
    ]);

    console.log('تم إنشاء الفئات:', categories.length);

    // إنشاء المنتجات
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'أحمر شفاه مات',
          description: 'أحمر شفاه مات عالي الجودة مع لون طويل الأمد',
          price: 25.0,
          originalPrice: 35.0,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'
          ]),
          categoryId: categories[0].id, // المكياج
          stock: 50,
          isNew: true,
          isBestSeller: true,
          isActive: true
        }
      }),
      prisma.product.create({
        data: {
          name: 'كريم ترطيب البشرة',
          description: 'كريم ترطيب عميق للبشرة الجافة',
          price: 45.0,
          originalPrice: 60.0,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
          ]),
          categoryId: categories[1].id, // العناية بالبشرة
          stock: 30,
          isNew: true,
          isBestSeller: true,
          isActive: true
        }
      }),
      prisma.product.create({
        data: {
          name: 'شامبو للشعر الجاف',
          description: 'شامبو مغذي للشعر الجاف والمتضرر',
          price: 35.0,
          originalPrice: 45.0,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'
          ]),
          categoryId: categories[2].id, // العناية بالشعر
          stock: 40,
          isNew: false,
          isBestSeller: true,
          isActive: true
        }
      })
    ]);

    console.log('تم إنشاء المنتجات:', products.length);

    // إضافة المنتجات للصفحة الرئيسية
    await Promise.all([
      prisma.homepageProducts.create({
        data: {
          productId: products[0].id,
          section: 'best-sellers',
          order: 1,
          isActive: true
        }
      }),
      prisma.homepageProducts.create({
        data: {
          productId: products[1].id,
          section: 'best-sellers',
          order: 2,
          isActive: true
        }
      }),
      prisma.homepageProducts.create({
        data: {
          productId: products[2].id,
          section: 'new-products',
          order: 1,
          isActive: true
        }
      })
    ]);

    console.log('تم إضافة المنتجات للصفحة الرئيسية');

  } catch (error) {
    console.error('خطأ في إنشاء البيانات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSeedData(); 