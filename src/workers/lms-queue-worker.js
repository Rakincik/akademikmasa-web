require('dotenv').config();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MURO_API_URL = process.env.MURO_API_URL || 'http://localhost:5292';
const MURO_WEBHOOK_SECRET = process.env.MURO_WEBHOOK_SECRET || 'CHANGE_THIS_IN_PRODUCTION';
const MURO_TENANT_CODE = process.env.MURO_TENANT_CODE || 'derece';

/**
 * Node.js & C# .NET API arasındaki Türkçe/Unicode karakter 
 * uyuşmazlığından kaynaklı imza hatalarını önleyen yardımcı serileştirici.
 */
function serializePayload(payload) {
  const json = JSON.stringify(payload);
  return json.replace(/[^\x00-\x7F]/g, (char) => {
    return '\\u' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
  });
}

async function runWorker() {
  // PENDING olan ya da daha önce hata alıp deneme hakkı 3'ten az olan kuyruk elemanlarını al
  const pendingJobs = await prisma.lmsQueue.findMany({
    where: {
      OR: [
        { status: 'PENDING' },
        { status: 'FAILED', attempts: { lt: 3 } }
      ]
    },
    include: {
      order: {
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  if (pendingJobs.length === 0) return;

  console.log(`[${new Date().toISOString()}] ${pendingJobs.length} kuyruk kaydı LMS'e aktarılıyor...`);

  for (const job of pendingJobs) {
    try {
      const user = job.order.user;
      
      // Siparişteki LMS'e gönderilmesi gereken eğitimleri bul (lmsCourseId si olanlar)
      const lmsItems = job.order.items.filter(item => item.product && item.product.lmsCourseId);
      
      if (lmsItems.length === 0) {
        // Eğer bu siparişte lmsCourseId'si olan bir ürün yoksa gereksiz kuyruk oluşmuş demektir.
        await prisma.lmsQueue.update({
          where: { id: job.id },
          data: { status: 'SUCCESS' }
        });
        continue;
      }

      // Telefon ve ad-soyad formatlamaları
      const digits = (user.phone || '').replace(/\D/g, '');
      const lmsPhone = digits.length >= 10 ? digits.slice(-10) : digits;
      const lmsEmail = (user.email || '').trim();
      
      const nameParts = (user.name || 'Öğrenci').trim().split(/\s+/);
      const surname = nameParts.length > 1 ? nameParts.pop() : 'Öğrenci';
      const firstName = nameParts.join(' ') || 'Öğrenci';

      let allSuccessful = true;
      let lastError = null;

      // Siparişteki her bir LMS eğitimi için istek at (veya hepsi için tek istek atılabiliyorsa LMS API dökümanına göre)
      // Biz her eğitim (PackageIdentifier) için bir istek atıyoruz.
      for (const item of lmsItems) {
        const lmsCourseId = item.product.lmsCourseId;
        
        const payload = {
          TenantCode: MURO_TENANT_CODE,
          PackageIdentifier: lmsCourseId,
          UserEmail: lmsEmail,
          UserPassword: user.password, // Şifreyi gönderiyoruz
          UserFirstName: firstName,
          UserLastName: surname,
          UserPhone: lmsPhone || null,
          OrderId: job.orderId,
          PaidAt: job.order.createdAt.toISOString()
        };

        const rawJson = serializePayload(payload);
        const signature = crypto
          .createHmac('sha256', MURO_WEBHOOK_SECRET)
          .update(rawJson)
          .digest('hex');

        const url = `${MURO_API_URL}/api/v1/webhooks/purchase`;
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': signature
            },
            body: rawJson
          });

          const responseText = await response.text();

          if (response.status >= 200 && response.status < 300) {
            console.log(`[SUCCESS] Öğrenci LMS'e tanımlandı. Sipariş ID: ${job.orderId}, Kurs: ${lmsCourseId}`);
          } else {
            console.error(`[ERROR] LMS'e tanımlanırken HTTP ${response.status} hatası: ${responseText}`);
            allSuccessful = false;
            lastError = `HTTP ${response.status}: ${responseText}`;
          }
        } catch (fetchErr) {
           console.error(`[ERROR] Ağ hatası:`, fetchErr.message);
           allSuccessful = false;
           lastError = fetchErr.message;
        }
      }

      if (allSuccessful) {
        await prisma.lmsQueue.update({
          where: { id: job.id },
          data: { status: 'SUCCESS' }
        });
      } else {
        throw new Error(lastError || 'Bilinmeyen LMS Hatası');
      }

    } catch (err) {
      console.error(`Sipariş işleme hatası (ID: ${job.orderId}):`, err.message);
      // Hatalı kayıt denemesini ve hatayı logla
      await prisma.lmsQueue.update({
        where: { id: job.id },
        data: { 
          status: 'FAILED',
          error: err.message,
          attempts: { increment: 1 }
        }
      });
    }
  }
}

// Daemon (Servis) Yapısı: Sürekli ayakta durup belirli periyotlarla kuyruğu tarar
async function startDaemon() {
  console.log('LMS Kuyruk Worker Başlatıldı...');
  
  // Bir defa çalıştır ve çık (Eğer webhooks'tan tetiklendiyse)
  if (process.argv.includes('--once')) {
      await runWorker();
      prisma.$disconnect();
      process.exit(0);
      return;
  }
  
  while (true) {
    try {
      await runWorker();
    } catch (err) {
      console.error('Daemon loop error:', err);
    }
    // Her tarama sonrası 60 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
}

startDaemon().catch(err => {
  console.error('Daemon fatal error:', err);
  prisma.$disconnect();
  process.exit(1);
});
