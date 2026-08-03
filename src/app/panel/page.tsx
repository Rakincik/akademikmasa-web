import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, BookOpen, User, ExternalLink, ArrowRight } from "lucide-react";

export default async function PanelDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  // Son siparişleri ve istatistikleri çek
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: { include: { product: true } } }
      }
    }
  });

  const totalOrders = await prisma.order.count({
    where: { userId: session.user.id }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Hoş Geldiniz, {user?.name}!
        </h1>
        <p className="text-slate-500 font-medium">
          Buradan siparişlerinizi takip edebilir, hesap bilgilerinizi güncelleyebilir ve eğitim paneline geçiş yapabilirsiniz.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Toplam Sipariş</p>
            <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Ders Paneli</p>
            <Link 
              href="https://akm.muro.click/admin/dashboard" 
              target="_blank" 
              className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-1 mt-1 transition-colors"
            >
              Eğitimlere Git <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Profil Durumu</p>
            <Link 
              href="/panel/hesabim" 
              className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 mt-1 transition-colors"
            >
              Bilgilerimi Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Son Siparişler */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Son Siparişleriniz</h2>
          <Link href="/panel/siparislerim" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
            Tümünü Gör
          </Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {user?.orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              Henüz bir siparişiniz bulunmamaktadır.
            </div>
          ) : (
            user?.orders.map(order => (
              <div key={order.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-900 mb-1">
                    Sipariş #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                  <div className="mt-2 text-sm text-slate-600">
                    {order.items.map(item => item.product.title).join(", ")}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                    order.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {order.status === "COMPLETED" ? "Tamamlandı" : order.status === "PENDING" ? "Bekliyor" : "İptal/Hata"}
                  </span>
                  <span className="font-bold text-slate-900 text-lg">
                    {order.totalAmount.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
