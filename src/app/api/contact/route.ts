import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Create contact message
    const contactMessage = `📧 *رسالة تواصل جديدة من La Femme*

👤 *الاسم:* ${name}
📱 *الهاتف:* ${phone}
${email ? `📧 *البريد الإلكتروني:* ${email}\n` : ''}
📋 *الموضوع:* ${subject}
💬 *الرسالة:*
${message}

⏰ *التاريخ:* ${new Date().toLocaleDateString('ar', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

🔗 *رابط لوحة التحكم:* ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`;

    // Create WhatsApp URL for manual sending
    const cleanPhone = '+381615851106'.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(contactMessage)}`;
    
    console.log('Contact form submitted:', {
      name,
      phone,
      subject,
      message,
      whatsappUrl
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      whatsappUrl: whatsappUrl,
      whatsappSent: true
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
} 