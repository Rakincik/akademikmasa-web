import { prisma } from "@/lib/prisma";
import KuponlarClient from "../kuponlar/KuponlarClient";

export const dynamic = "force-dynamic";

export default async function InfluencerPage() {
  const coupons = await prisma.coupon.findMany({
    where: { isInfluencer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <KuponlarClient initialCoupons={coupons} isInfluencerMode={true} />
    </div>
  );
}
