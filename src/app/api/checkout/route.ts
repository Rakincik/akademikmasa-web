import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { spawn } from 'child_process';
import { ShopierApiClient, ShopierPaymentFlow } from '@nopeion/shopier';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const shopierClient = new ShopierApiClient({
    pat: process.env.SHOPIER_PAT || ''
  });
  const shopierPayments = new ShopierPaymentFlow({
    client: shopierClient
  });
  try {
    // 1. Kullanıcıyı doğrula ve bilgilerini al
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Satın alma işlemi için lütfen giriş yapın.' }, { status: 401 });
    }
    const userId = session.user.id;
    
    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!dbUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // 2. İstek gövdesini ve DB ürünlerini doğrula
    const { items, couponCode } = await request.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Sepetiniz boş.' }, { status: 400 });
    }

    const productIds = items.map((item: { id: string }) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isPublished: true }
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'Sepetinizdeki bazı ürünler bulunamadı.' }, { status: 400 });
    }

    // 3. Fiyat ve Kupon Hesabı
    const subtotal = dbProducts.reduce((sum, p) => sum + p.price, 0);
    const totalDiscount = dbProducts.reduce((sum, p) => sum + (p.salePrice ? (p.price - p.salePrice) : 0), 0);
    
    let promoDiscount = 0;
    let validCouponId = null;
    
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });
      if (coupon && coupon.isActive) {
        const isRestricted = coupon.allowedProductIds && coupon.allowedProductIds.length > 0;
        
        if (isRestricted) {
          const validProducts = dbProducts.filter(p => coupon.allowedProductIds.includes(p.id));
          if (validProducts.length > 0) {
            const validProductsTotal = validProducts.reduce((sum, p) => {
              return sum + (p.salePrice || p.price);
            }, 0);
            
            if (coupon.discountType === "PERCENTAGE") {
              promoDiscount = validProductsTotal * (coupon.discountValue / 100);
            } else {
              promoDiscount = Math.min(validProductsTotal, coupon.discountValue);
            }
            validCouponId = coupon.id;
          } else {
            return NextResponse.json({ error: 'Bu kupon kodu sepetinizdeki ürünler için geçerli değil.' }, { status: 400 });
          }
        } else {
          if (coupon.discountType === "PERCENTAGE") {
            promoDiscount = (subtotal - totalDiscount) * (coupon.discountValue / 100);
          } else {
            promoDiscount = Math.min(subtotal - totalDiscount, coupon.discountValue);
          }
          validCouponId = coupon.id;
        }
      }
    }
    
    const total = Math.max(0, subtotal - totalDiscount - promoDiscount);
    const isFreeCheckout = total === 0;

    // 4. Benzersiz geçici işlem ID'si
    const randomPart = Math.random().toString(36).substring(2, 10);
    const paymentId = `tr_${randomPart}`;

    // 5. Sipariş kayıtlarını veritabanına PENDING olarak aç
    // We create one Order with multiple OrderItems
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        status: 'PENDING',
        paymentId,
        couponId: validCouponId,
        items: {
          create: dbProducts.map(p => ({
            productId: p.id,
            price: p.salePrice || p.price
          }))
        }
      }
    });

    // 6. Ücretsiz (0 TL) ise Bypass et ve doğrudan SUCCESS yap
    if (isFreeCheckout) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      if (validCouponId) {
        await prisma.coupon.update({
          where: { id: validCouponId },
          data: { 
            usedCount: { increment: 1 }
          }
        });
      }
      
      // LMS Kuyruğuna Ekle
      const hasLmsCourse = dbProducts.some(p => p.lmsCourseId || (Array.isArray(p.lmsCourseIds) && p.lmsCourseIds.length > 0));
      if (hasLmsCourse) {
        await prisma.lmsQueue.create({
          data: { orderId: order.id, status: 'PENDING' }
        });
        
        // Arka planda LMS Worker'ı tetikle
        try {
          const workerPath = ['src', 'workers', 'lms-queue-worker.js'].join('/');
          const child = spawn('node', [workerPath, '--once'], {
            detached: true,
            stdio: 'ignore'
          });
          child.unref();
        } catch (spawnErr) {
          console.error('LMS Worker spawn error:', spawnErr);
        }
      }

      return NextResponse.json({ message: 'Ücretsiz işlem başarıyla tamamlandı.', freeCheckout: true, paymentId });
    }

    // 7. Shopier Ödeme Sayfası Linkini Oluştur
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akademikmasa.com';
    
    const [name, ...surnameParts] = (dbUser.name || 'Müşteri').split(' ');
    const surname = surnameParts.length > 0 ? surnameParts.join(' ') : 'Kullanıcısı';

    const paymentResult = await shopierPayments.createPaymentLink({
      title: dbProducts.map(p => p.title).join(', ').substring(0, 100),
      amount: parseFloat(total.toFixed(2)),
      currency: 'TRY',
      imageUrl: `${siteUrl}/logo-transparent.png`,
      orderId: paymentId,
      hostedCheckout: true,
      // @ts-ignore
      returnUrl: `${siteUrl}/panel/siparislerim?success=true`,
      shopSlug: process.env.SHOPIER_SHOP_SLUG || 'your_shop_slug'
    });

    // 8. Webhook'un siparişi yakalayabilmesi için veritabanındaki ödeme kodunu Shopier'ın oluşturduğu productId ile güncelle
    let trackingId = paymentId;
    if (paymentResult.productId) {
      trackingId = paymentResult.productId.toString();
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: trackingId }
      });
    }

    return NextResponse.json({
      message: 'Shopier ödemesi başlatıldı.',
      paymentUrl: paymentResult.paymentUrl,
      paymentId: trackingId
    }, { status: 201 });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' }, { status: 500 });
  }
}
