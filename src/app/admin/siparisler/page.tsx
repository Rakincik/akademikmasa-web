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

  return <SiparislerClient orders={orders} />;
}
