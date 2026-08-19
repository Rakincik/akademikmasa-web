import { prisma } from "@/lib/prisma";
import SiparislerClient from "./SiparislerClient";

export default async function SiparislerPage() {
  // 1. 30 dakikadan eski olan ve hâlâ PENDING (Bekliyor) olarak kalan yarım kalmış kredi kartı ödemelerini otomatik olarak FAILED yap.
  // Bu sayede havada kalan eski kart denemeleri "Bekleyenler" listesinden temizlenip "İptal/Hata" kısmına taşınır.
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  try {
    await prisma.order.updateMany({
      where: {
        status: "PENDING",
        createdAt: { lt: thirtyMinutesAgo }
      },
      data: { status: "FAILED" }
    });
  } catch (err) {
    console.error("Old pending orders auto-cleanup error:", err);
  }

  // 2. Güncel sipariş listesini çek
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 3. Kullanıcıların başarılı bir şekilde satın aldığı (COMPLETED veya COMPLETED_HAVALE) ürünleri belirle.
  const successfulPurchases = new Set<string>();
  orders.forEach((order) => {
    if (order.status === "COMPLETED" || order.status === "COMPLETED_HAVALE") {
      order.items.forEach((item) => {
        successfulPurchases.add(`${order.userId}_${item.productId}`);
      });
    }
  });

  // 4. Mükerrer / gereksiz (başarısız veya bekleyen) siparişleri filtrele.
  const seenUnsuccessful = new Set<string>();
  const deduplicatedOrders = orders.filter((order) => {
    // Başarılı siparişleri her zaman göster
    if (order.status === "COMPLETED" || order.status === "COMPLETED_HAVALE") return true;

    // PENDING veya FAILED siparişler için filtreleme uyguluyoruz:
    
    // a. Eğer bu kullanıcının bu ürün(ler) için zaten onaylanmış/başarılı bir siparişi varsa,
    // başarısız/bekleyen sipariş denemelerini göstermeye gerek yok.
    const hasAlreadyPurchased = order.items.some((item) =>
      successfulPurchases.has(`${order.userId}_${item.productId}`)
    );
    if (hasAlreadyPurchased) return false;

    // b. Aynı kullanıcının aynı ürün(ler) için oluşturduğu birden fazla başarısız/bekleyen sipariş varsa,
    // sadece en sonuncuyu (en güncel olanı) göster.
    const productKey = order.items
      .map((item) => item.productId)
      .sort()
      .join(",");
    const key = `${order.userId}_${productKey}`;

    if (seenUnsuccessful.has(key)) {
      return false; // Eski mükerrer denemeyi atla
    }
    seenUnsuccessful.add(key);
    return true;
  });

  return <SiparislerClient orders={deduplicatedOrders} />;
}


