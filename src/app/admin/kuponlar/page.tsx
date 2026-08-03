import { prisma } from "@/lib/prisma";
import KuponlarClient from "./KuponlarClient";

export const dynamic = "force-dynamic";

export default async function KuponlarPage() {
  const [coupons, products] = await Promise.all([
    prisma.coupon.findMany({
      where: { isInfluencer: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    })
  ]);

  return (
    <div className="p-8">
      <KuponlarClient initialCoupons={coupons} products={products} />
    </div>
  );
}
