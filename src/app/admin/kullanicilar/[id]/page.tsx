import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, ShoppingBag, Shield, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      {/* Üst Kısım: Geri Dönüş ve Başlık */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/kullanicilar" 
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {user.name}
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
              {user.role}
            </span>
          </h1>
          <p className="text-slate-500">Kullanıcı Detayları ve Satın Alma Geçmişi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon: Kullanıcı Bilgileri Kartı */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Kişisel Bilgiler</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Ad Soyad</p>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">E-posta</p>
                  <p className="font-semibold text-slate-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Telefon</p>
                  <p className="font-semibold text-slate-900">{user.phone || "Belirtilmemiş"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Kayıtlı Şifre</p>
                  <div className="bg-slate-100 px-2 py-0.5 rounded text-sm font-mono text-slate-800 border border-slate-200 mt-1 inline-block">
                    {user.password}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Kayıt Tarihi</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Sipariş Geçmişi */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-500" /> 
                Satın Alma Geçmişi
              </h2>
              <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-xs font-bold">
                Toplam {user.orders.length} Sipariş
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {user.orders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p>Bu kullanıcının henüz bir satın alımı bulunmuyor.</p>
                </div>
              ) : (
                user.orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">Sipariş ID: #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="font-bold text-slate-900">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-900">
                          ₺{order.totalAmount.toLocaleString('tr-TR')}
                        </span>
                        {order.status === "COMPLETED" || order.status === "SUCCESS" ? (
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Başarılı
                          </span>
                        ) : order.status === "PENDING" ? (
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">
                            <Clock className="w-3.5 h-3.5" /> Bekliyor
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold border border-red-100">
                            {order.status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                          <tr>
                            <th className="px-4 py-2">Eğitim</th>
                            <th className="px-4 py-2 text-right">Tutar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {order.items.map(item => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-slate-700 font-medium flex items-center gap-3">
                                {item.product.imageUrl ? (
                                  <img src={item.product.imageUrl} alt={item.product.title} className="w-10 h-10 object-cover rounded-md border border-slate-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-slate-300" />
                                  </div>
                                )}
                                <Link href={`/kurslar/${item.product.slug}`} target="_blank" className="hover:text-brand-600 hover:underline">
                                  {item.product.title}
                                </Link>
                              </td>
                              <td className="px-4 py-3 text-right text-slate-600 font-medium">
                                ₺{item.price.toLocaleString('tr-TR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
