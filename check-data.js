const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();
    const admins = await prisma.admin.findMany();
    const homepageProducts = await prisma.homepageProducts.findMany();

    console.log('=== البيانات الموجودة ===');
    console.log('الفئات:', categories.length);
    console.log('المنتجات:', products.length);
    console.log('الأدمن:', admins.length);
    console.log('منتجات الصفحة الرئيسية:', homepageProducts.length);

    if (categories.length > 0) {
      console.log('\n=== الفئات ===');
      categories.forEach(cat => {
        console.log(`- ${cat.name} (${cat.id})`);
      });
    }

    if (products.length > 0) {
      console.log('\n=== المنتجات ===');
      products.forEach(prod => {
        console.log(`- ${prod.name} (${prod.price} دينار)`);
      });
    }

    if (admins.length > 0) {
      console.log('\n=== الأدمن ===');
      admins.forEach(admin => {
        console.log(`- ${admin.username} (${admin.name})`);
      });
    }

  } catch (error) {
    console.error('خطأ في التحقق من البيانات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 