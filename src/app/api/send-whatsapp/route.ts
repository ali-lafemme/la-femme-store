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
    
    console.log('Creating WhatsApp URL for:', cleanPhone);
    console.log('Message length:', message.length);

    // إنشاء رابط الواتساب مع الرسالة جاهزة
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL created:', whatsappUrl);
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء رابط الواتساب مع الرسالة جاهزة',
      url: whatsappUrl,
      phone: cleanPhone
    });

  } catch (error) {
    console.error('Error creating WhatsApp URL:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء رابط الواتساب' },
      { status: 500 }
    );
  }
} 