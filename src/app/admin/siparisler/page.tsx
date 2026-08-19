import { prisma } from "@/lib/prisma";
import SiparislerClient from "./SiparislerClient";

export default async function SiparislerPage() {
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

  // Aynı kullanıcının aynı ürün(ler) için oluşturduğu mükerrer "Bekleyen" (PENDING) siparişleri filtrele.
  // Sadece en güncel (son oluşturulan) bekleyen siparişi listeye dahil et.
  const seenPending = new Set<string>();
  const deduplicatedOrders = orders.filter((order) => {
    if (order.status !== "PENDING") return true;

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

