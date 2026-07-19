import { prisma } from "@/lib/prisma";
import { CreditCard, Users, TrendingUp, BookOpen, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const [totalUsers, totalProducts, pendingOrders, totalRevenueData, recentOrders] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { totalAmount: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    })
  ]);

  const totalRevenue = totalRevenueData._sum.totalAmount || 0;

  const stats = [
    { title: "Toplam Satış", value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Kayıtlı Öğrenci", value: totalUsers.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Kayıtlı Eğitim", value: totalProducts.toString(), icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Bekleyen Sipariş", value: pendingOrders.toString(), icon: CreditCard, color: "text-brand-500", bg: "bg-brand-50" },
  ];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Özeti</h1>
        <p className="text-slate-500">Platformun genel durumu ve son satışlar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Son Siparişler</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Sipariş ID</th>
                <th className="px-4 py-3">Öğrenci</th>
                <th className="px-4 py-3">Kurs</th>
                <th className="px-4 py-3">Tutar</th>
                <th className="px-4 py-3 rounded-tr-lg">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Henüz sipariş bulunmuyor.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-slate-500 text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{order.user.name}</td>
                    <td className="px-4 py-4 text-xs">
                      {order.items.map(item => item.product.title).join(', ')}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900">₺{order.totalAmount}</td>
                    <td className="px-4 py-4">
                      {order.status === 'COMPLETED' ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">Başarılı</span>
                      ) : order.status === 'PENDING' ? (
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">Beklemede</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">İptal/Hata</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
