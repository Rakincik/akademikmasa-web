import { prisma } from "@/lib/prisma";
import KuponlarClient from "./KuponlarClient";

export const dynamic = "force-dynamic";

export default async function KuponlarPage() {
  const coupons = await prisma.coupon.findMany({
    where: { isInfluencer: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <KuponlarClient initialCoupons={coupons} />
    </div>
  );
}
