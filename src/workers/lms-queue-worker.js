require('dotenv').config();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MURO_API_URL = process.env.MURO_API_URL || 'https://online.akademikmasa.com/api/v1';
const MURO_API_KEY = process.env.MURO_API_KEY || 'muro_live_3b06fbf8fd9fe828f60c896eb7c89251';

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
      
      // Siparişteki LMS'e gönderilmesi gereken eğitimleri bul (lmsCourseId veya lmsCourseIds olanlar)
      const lmsItems = job.order.items.filter(item => {
        if (!item.product) return false;
        const hasLegacy = !!item.product.lmsCourseId;
        const hasArray = Array.isArray(item.product.lmsCourseIds) && item.product.lmsCourseIds.length > 0;
        return hasLegacy || hasArray;
      });
      
      if (lmsItems.length === 0) {
        // Eğer bu siparişte LMS kurs ID'si olan bir ürün yoksa kuyruğu tamamla
        await prisma.lmsQueue.update({
          where: { id: job.id },
          data: { status: 'SUCCESS' }
        });
        continue;
      }

      // Telefon ve ad-soyad formatlamaları
      const digits = (user.phone || '').replace(/\D/g, '');
      const lmsPhone = digits.length >= 10 ? (digits.length === 10 ? `0${digits}` : digits.slice(-11)) : digits;
      const lmsEmail = (user.email || '').trim();
      
      const nameParts = (user.name || 'Öğrenci').trim().split(/\s+/);
      const surname = nameParts.length > 1 ? nameParts.pop() : 'Öğrenci';
      const firstName = nameParts.join(' ') || 'Öğrenci';

      let allSuccessful = true;
      let lastError = null;

      // Siparişteki her ürün için tüm LMS gruplarını topla (tekrarsız)
      const courseIdsToEnroll = [];
      for (const item of lmsItems) {
        const prod = item.product;
        if (Array.isArray(prod.lmsCourseIds)) {
          prod.lmsCourseIds.forEach(id => {
            const clean = (id || '').trim();
            if (clean && !courseIdsToEnroll.includes(clean)) {
              courseIdsToEnroll.push(clean);
            }
          });
        }
        if (prod.lmsCourseId) {
          const clean = prod.lmsCourseId.trim();
          if (clean && !courseIdsToEnroll.includes(clean)) {
            courseIdsToEnroll.push(clean);
          }
        }
      }

      // Her bir LMS eğitimi / paketi / grubu için istek at
      for (const lmsCourseId of courseIdsToEnroll) {
        const payload = {
          first_name: firstName,
          last_name: surname,
          email: lmsEmail,
          phone: lmsPhone || undefined,
          package_code: lmsCourseId,
          order_id: job.orderId,
          send_welcome_sms: true
        };

        const url = `${MURO_API_URL}/connect/enroll`;
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Muro-Key': MURO_API_KEY
            },
            body: JSON.stringify(payload)
          });

          const responseData = await response.json().catch(() => null);

          if (response.ok && (responseData?.success !== false)) {
            console.log(`[SUCCESS] Öğrenci LMS'e tanımlandı. Sipariş ID: ${job.orderId}, Kurs/Grup: ${lmsCourseId}`);
            if (responseData?.magic_login_url) {
              console.log(`[MAGIC LOGIN URL] ${responseData.magic_login_url}`);
            }
          } else {
            const errDetail = responseData?.message || JSON.stringify(responseData) || `HTTP ${response.status}`;
            console.error(`[ERROR] LMS'e tanımlanırken hata: ${errDetail} (Grup: ${lmsCourseId})`);
            allSuccessful = false;
            lastError = errDetail;
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
