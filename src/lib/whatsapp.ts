// خدمة إرسال إشعارات الواتساب
export async function sendWhatsAppNotification(message: string, phoneNumber: string = '+381615851106') {
  try {
    // تنظيف رقم الهاتف
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // إنشاء رابط الواتساب مع الرسالة جاهزة
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL created:', whatsappUrl);
    
    // فتح الواتساب في نافذة جديدة
    if (typeof window !== 'undefined') {
      try {
        window.open(whatsappUrl, '_blank');
      } catch (error) {
        console.log('Could not open WhatsApp:', error);
      }
    }
    
    return { success: true, url: whatsappUrl };
  } catch (error) {
    console.error('Error creating WhatsApp URL:', error);
    return { success: false, error: 'فشل في إنشاء رابط الواتساب' };
  }
}

// دالة إنشاء رسالة طلب جديد
export function createOrderNotification(order: { 
  id: string; 
  user?: { name?: string }; 
  phone: string; 
  shippingAddress: string; 
  totalAmount: number; 
  notes?: string; 
  createdAt: string; 
  items: Array<{ 
    quantity: number; 
    product?: { name?: string }; 
    price: number; 
  }>; 
}) {
  const items = order.items || [];
  const productsList = items.map((item: { 
    quantity: number; 
    product?: { name?: string }; 
    price: number; 
  }) => 
    `• ${item.quantity}x ${item.product?.name || 'منتج'} - ${item.price.toFixed(2)} دينار ليبي`
  ).join('\n');

  return `🛍️ *طلب جديد في La Femme*

📋 *تفاصيل الطلب:*
• رقم الطلب: #${order.id.slice(-8)}
• العميل: ${order.user?.name || 'غير محدد'}
• الهاتف: ${order.phone}
• العنوان: ${order.shippingAddress}
• المبلغ الإجمالي: ${order.totalAmount.toFixed(2)} دينار ليبي

📦 *المنتجات:*
${productsList}

📝 *ملاحظات:* ${order.notes || 'لا توجد ملاحظات'}

⏰ *التاريخ:* ${new Date(order.createdAt).toLocaleDateString('fr-FR')}

🔗 *رابط لوحة التحكم:* ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders`;
} 