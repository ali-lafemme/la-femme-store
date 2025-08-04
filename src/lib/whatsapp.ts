// خدمة إرسال إشعارات الواتساب
export async function sendWhatsAppNotification(message: string, phoneNumber: string = '+381615851106') {
  try {
    // تنظيف رقم الهاتف
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // إرسال الرسالة عبر API
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, phoneNumber: cleanPhone })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('WhatsApp notification sent successfully');
      console.log('WhatsApp URL:', result.url);
      
      // فتح رابط الواتساب في نافذة جديدة
      if (typeof window !== 'undefined') {
        window.open(result.url, '_blank');
      }
      
      return { success: true, url: result.url };
    } else {
      console.error('Failed to send WhatsApp notification:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return { success: false, error: 'فشل في إرسال إشعار الواتساب' };
  }
}

// دالة إنشاء رسالة طلب جديد
export function createOrderNotification(order: any) {
  const items = order.items || [];
  const productsList = items.map((item: any) => 
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