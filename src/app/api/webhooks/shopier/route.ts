import { ShopierWebhookRouter, handleWebhookRequest } from '@nopeion/shopier';
import { prisma } from '@/lib/prisma';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!process.env.SHOPIER_WEBHOOK_TOKEN) {
    console.error('SHOPIER_WEBHOOK_TOKEN eksik!');
    return new Response('Webhook Token Config Error', { status: 500 });
  }

  // Güvenlik doğrulaması için webhook token ile router'ı başlatıyoruz
  const router = new ShopierWebhookRouter(process.env.SHOPIER_WEBHOOK_TOKEN);

  // Başarılı ödeme bildiriminde tetiklenecek event handler
  router.on('order.created', async (event: any) => {
    const orderData = event.data;
    
    if (!orderData || !orderData.lineItems || orderData.lineItems.length === 0) {
      console.warn('Webhook: order.created verisi eksik.');
      return;
    }

    // Shopier Product ID'sini alıyoruz
    const shopierProductId = orderData.lineItems[0].productId?.toString();
    if (!shopierProductId) return;

    console.log(`Shopier Webhook ödeme onayı alındı: ${shopierProductId}`);

    // Veritabanında eşleşen bekleyen (PENDING) siparişi bul
    const orders = await prisma.order.findMany({
      where: { 
        paymentId: { startsWith: shopierProductId },
        status: 'PENDING'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (orders.length === 0) {
      console.warn(`Webhook: Eşleşen bekleyen sipariş bulunamadı.`);
      return;
    }

    const exactPaymentId = orders[0].paymentId;

    // Sipariş statüsünü COMPLETED (Başarılı) yap, kupon kullanımını ve cirosunu artır
    for (const order of orders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      // Kopya/Yarım kalanları iptal et
      try {
        await prisma.order.updateMany({
          where: {
            userId: order.userId,
            status: 'PENDING',
            id: { not: order.id }
          },
          data: { status: 'FAILED' }
        });
      } catch (err) {
        console.error("Webhook: Kopya siparişler temizlenirken hata:", err);
      }

      if (order.couponId) {
        await prisma.coupon.update({
          where: { id: order.couponId },
          data: {
            usedCount: { increment: 1 },
            totalRevenue: { increment: order.totalAmount }
          }
        });
        console.log(`Kupon (${order.couponId}) kullanım sayısı ve cirosu artırıldı. Sipariş tutarı: ${order.totalAmount}`);
      }
    }

    console.log(`Sipariş başarıyla onaylandı ve COMPLETED durumuna getirildi: ${exactPaymentId}`);

    // LMS sırasına ekle
    for (const order of orders) {
      const hasLmsCourse = order.items.some((item: any) => item.product?.lmsCourseId);
      if (hasLmsCourse) {
        const existingJob = await prisma.lmsQueue.findUnique({ where: { orderId: order.id } });
        if (!existingJob) {
          await prisma.lmsQueue.create({
            data: { orderId: order.id, status: 'PENDING' }
          });
        }
      }
    }

    // Arka planda LMS kuyruğunu eritmek için worker'ı tetikle
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
  });

  // İmzayı doğrula ve isteği router handler'ına gönder
  return handleWebhookRequest(request, router);
}
