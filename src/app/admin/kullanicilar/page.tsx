import { prisma } from "@/lib/prisma";
import KullanicilarClient from "./KullanicilarClient";

export default async function KullanicilarPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          id: true,
          status: true,
          totalAmount: true,
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      <KullanicilarClient users={users} />
    </div>
  );
}

