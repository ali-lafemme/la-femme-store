import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, phoneNumber } = body;

    if (!message || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'الرسالة ورقم الهاتف مطلوبان' },
        { status: 400 }
      );
    }

    // تنظيف رقم الهاتف
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // التحقق من صحة رقم الهاتف
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'رقم الهاتف غير صحيح' },
        { status: 400 }
      );
    }
    
    // إنشاء رابط الواتساب
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL created:', whatsappUrl);
    console.log('Message length:', message.length);
    console.log('Phone:', cleanPhone);

    // في بيئة الإنتاج، يمكن استخدام خدمات مثل:
    // - WhatsApp Business API
    // - Twilio WhatsApp API
    // - MessageBird WhatsApp API
    
    // للآن، سنقوم بإنشاء رابط الواتساب فقط
    // يمكنك فتح الرابط يدوياً لإرسال الرسالة
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء رابط الواتساب',
      url: whatsappUrl,
      phone: cleanPhone
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال رسالة الواتساب' },
      { status: 500 }
    );
  }
} 