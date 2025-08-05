const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@lafemme.com',
        name: 'مدير النظام',
        isActive: true,
        role: 'admin'
      }
    });
    
    console.log('تم إنشاء حساب الأدمن:', admin);
  } catch (error) {
    console.error('خطأ في إنشاء الأدمن:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 