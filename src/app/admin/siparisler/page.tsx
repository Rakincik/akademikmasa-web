import { prisma } from "@/lib/prisma";
import SiparislerClient from "./SiparislerClient";

export default async function SiparislerPage() {
  // 1. 2 saatten eski olan ve hâlâ PENDING (Bekliyor) olarak kalan yarım kalmış kredi kartı ödemelerini otomatik olarak FAILED yap.
  // Bu sayede havada kalan eski kart denemeleri "Bekleyenler" listesinden temizlenip "İptal/Hata" kısmına taşınır.
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  try {
    await prisma.order.updateMany({
      where: {
        status: "PENDING",
        createdAt: { lt: twoHoursAgo }
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

  // 4. Aynı kullanıcının aynı ürün(ler) için oluşturduğu mükerrer "Bekleyen" (PENDING) siparişleri filtrele.
  // Sadece en güncel (son oluşturulan) bekleyen siparişi listeye dahil et.
  const seenPending = new Set<string>();
  const deduplicatedOrders = orders.filter((order) => {
    if (order.status !== "PENDING") return true;

    // Eğer bu kullanıcının bu ürün(ler) için zaten onaylanmış/başarılı bir siparişi varsa, bekleyen sipariş denemesini gösterme.
    const hasAlreadyPurchased = order.items.some((item) =>
      successfulPurchases.has(`${order.userId}_${item.productId}`)
    );
    if (hasAlreadyPurchased) return false;

    // Siparişteki ürünlerin ID'lerini sıralayıp birleştirerek benzersiz bir anahtar oluşturuyoruz.
    const productKey = order.items
      .map((item) => item.productId)
      .sort()
      .join(",");
    const key = `${order.userId}_${productKey}`;

    if (seenPending.has(key)) {
      return false; // Aynı ürüne ait eski bekleyen siparişi atla
    }
    seenPending.add(key);
    return true;
  });

  return <SiparislerClient orders={deduplicatedOrders} />;
}


