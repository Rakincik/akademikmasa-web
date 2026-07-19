import { prisma } from "@/lib/prisma";
import { Eye, ShieldAlert } from "lucide-react";
import KullanicilarClient from "./KullanicilarClient";

export default async function KullanicilarPage() {
  // Veritabanından kullanıcıları şifreleri ile çekiyoruz
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kullanıcılar</h1>
        </div>
      </div>

      <KullanicilarClient users={users} />
    </div>
  );
}
