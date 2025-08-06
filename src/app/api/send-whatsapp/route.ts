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
    
    console.log('Sending WhatsApp message to:', cleanPhone);
    console.log('Message length:', message.length);

    // محاولة إرسال الرسالة عبر WhatsApp Business API
    // يمكنك استخدام خدمات مثل:
    // - Twilio WhatsApp API
    // - MessageBird WhatsApp API
    // - WhatsApp Business API مباشرة
    
    try {
      // مثال باستخدام Twilio (تحتاج إلى حساب Twilio)
      /*
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      
      const result = await client.messages.create({
        body: message,
        from: 'whatsapp:+14155238886', // رقم Twilio WhatsApp
        to: `whatsapp:+${cleanPhone}`
      });
      */
      
      // للآن، سنقوم بإنشاء رابط الواتساب مع رسالة تأكيد
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      
      console.log('WhatsApp URL created:', whatsappUrl);
      
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء رابط الواتساب - يرجى إرسال الرسالة يدوياً',
        url: whatsappUrl,
        phone: cleanPhone,
        note: 'لإرسال أوتوماتيكي، تحتاج إلى إعداد WhatsApp Business API'
      });

    } catch (apiError) {
      console.error('WhatsApp API error:', apiError);
      
      // Fallback: إنشاء رابط الواتساب
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      
      return NextResponse.json({
        success: true,
        message: 'تم إنشاء رابط الواتساب - يرجى إرسال الرسالة يدوياً',
        url: whatsappUrl,
        phone: cleanPhone,
        note: 'لإرسال أوتوماتيكي، تحتاج إلى إعداد WhatsApp Business API'
      });
    }

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إرسال رسالة الواتساب' },
      { status: 500 }
    );
  }
} 