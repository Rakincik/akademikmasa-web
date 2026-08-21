require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');

const prisma = new PrismaClient();

async function syncShopierOrders() {
  if (!process.env.SHOPIER_PAT) {
    console.error('[Shopier Sync] SHOPIER_PAT bulunamadı. Senkronizasyon atlanıyor.');
    return;
  }

  console.log(`[${new Date().toISOString()}] [Shopier Sync] Bekleyen siparişler Shopier'den kontrol ediliyor...`);

  try {
    // Sadece PENDING olan siparişleri veritabanından alalım (en fazla 100 tane)
    const pendingOrders = await prisma.order.findMany({
      where: { status: 'PENDING' },
      include: {
        items: { include: { product: true } }
      },
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    if (pendingOrders.length === 0) {
      console.log(`[Shopier Sync] Bekleyen sipariş yok.`);
      return;
    }

    // Shopier API'dan son 100 siparişi çekelim
    const response = await fetch('https://api.shopier.com/v1/orders?limit=100', {
      headers: {
        'Authorization': `Bearer ${process.env.SHOPIER_PAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopier API Hatası: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let processedCount = 0;

    for (const shopierOrder of data) {
      if (shopierOrder.paymentStatus !== 'paid') continue; // Sadece ödenmiş olanları işle

      const productId = shopierOrder.lineItems?.[0]?.productId?.toString();
      if (!productId) continue;

      // Veritabanındaki PENDING siparişleri eşleştir
      // Eşleşme 1: paymentId = productId (Bu @nopeion/shopier kütüphanesinin oluşturduğu ID)
      const matchedOrders = pendingOrders.filter(
        (o) => o.paymentId && o.paymentId.startsWith(productId)
      );

      for (const order of matchedOrders) {
        // Siparişi onayla
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'COMPLETED' }
        });

        // Kopya/Yarım kalanları iptal et
        await prisma.order.updateMany({
          where: {
            userId: order.userId,
            status: 'PENDING',
            id: { not: order.id }
          },
          data: { status: 'FAILED' }
        });

        // Kupon varsa kullanımı artır
        if (order.couponId) {
          await prisma.coupon.update({
            where: { id: order.couponId },
            data: {
              usedCount: { increment: 1 },
              totalRevenue: { increment: order.totalAmount }
            }
          });
          console.log(`[Shopier Sync] Kupon (${order.couponId}) güncellendi.`);
        }

        console.log(`[Shopier Sync] Sipariş onaylandı: ${order.paymentId}`);
        processedCount++;

        // LMS kuyruğuna ekle
        const hasLmsCourse = order.items.some((item) => 
          item.product?.lmsCourseId || (Array.isArray(item.product?.lmsCourseIds) && item.product.lmsCourseIds.length > 0)
        );
        if (hasLmsCourse) {
          const existingJob = await prisma.lmsQueue.findUnique({ where: { orderId: order.id } });
          if (!existingJob) {
            await prisma.lmsQueue.create({
              data: { orderId: order.id, status: 'PENDING' }
            });
          }
        }
      }
    }

    if (processedCount > 0) {
      console.log(`[Shopier Sync] Toplam ${processedCount} adet sipariş başarıyla onaylandı ve senkronize edildi.`);
      
      // LMS işçisini tetikle
      try {
        const workerPath = require('path').join(__dirname, 'lms-queue-worker.js');
        const child = spawn('node', [workerPath, '--once'], {
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
      } catch (spawnErr) {
        console.error('[Shopier Sync] LMS Worker spawn hatası:', spawnErr);
      }
    } else {
      console.log(`[Shopier Sync] Eşleşen/onaylanacak sipariş bulunamadı.`);
    }

  } catch (err) {
    console.error('[Shopier Sync] Senkronizasyon hatası:', err.message);
  }
}

async function startDaemon() {
  console.log('[Shopier Sync Worker] Başlatıldı. (10 dakikada bir çalışacak)');
  
  if (process.argv.includes('--once')) {
    await syncShopierOrders();
    prisma.$disconnect();
    process.exit(0);
    return;
  }
  
  // İlk çalıştırma (Anında çalıştırıp sonra 10 dk aralıklarla döngüye sokar)
  syncShopierOrders();
  
  // 10 dakika (600,000 ms) aralıklarla çalıştır
  setInterval(() => {
    syncShopierOrders();
  }, 10 * 60 * 1000);
}

// Sadece doğrudan çalıştırıldığında daemon başlasın
if (require.main === module) {
  startDaemon().catch(err => {
    console.error('Daemon fatal error:', err);
    prisma.$disconnect();
    process.exit(1);
  });
}

module.exports = startDaemon;
