import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SuccessPopup from "./SuccessPopup";

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Suspense fallback={null}>
        <SuccessPopup />
      </Suspense>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Siparişlerim</h1>
          <p className="text-slate-500 font-medium text-sm">
            Geçmiş siparişlerinizi ve satın aldığınız eğitimleri buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Henüz Siparişiniz Yok</h2>
          <p className="text-slate-500 mb-6 max-w-sm">
            Eğitim paketlerimizi inceleyerek hemen öğrenmeye başlayabilirsiniz.
          </p>
          <Link 
            href="/kurslar" 
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-brand-600/30"
          >
            Eğitimleri İncele
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Sipariş Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sipariş Tarihi</p>
                    <p className="font-medium text-slate-900">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Toplam Tutar</p>
                    <p className="font-bold text-slate-900">{order.totalAmount.toLocaleString("tr-TR")} ₺</p>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sipariş No</p>
                    <p className="font-medium text-slate-900 text-sm">{order.id}</p>
                  </div>
                </div>
                
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    order.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                    order.status === "PENDING" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                    "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    {order.status === "COMPLETED" ? "TAMAMLANDI" : order.status === "PENDING" ? "BEKLİYOR" : "İPTAL/HATA"}
                  </span>
                </div>
              </div>

              {/* Sipariş Kalemleri */}
              <div className="p-4 sm:p-6 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-center">
                    {item.product.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.title} 
                        className="w-full sm:w-24 h-24 object-cover rounded-xl border border-slate-100 shrink-0"
                      />
                    ) : (
                      <div className="w-full sm:w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{item.product.title}</h3>
                      <p className="text-brand-600 font-bold">{item.price.toLocaleString("tr-TR")} ₺</p>
                    </div>

                    <div className="shrink-0 mt-4 sm:mt-0">
                      {order.status === "COMPLETED" ? (
                        <Link 
                          href="https://akm.muro.click/admin/dashboard"
                          target="_blank"
                          className="px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold transition-colors text-sm flex items-center justify-center"
                        >
                          Eğitime Git
                        </Link>
                      ) : order.status === "PENDING" ? (
                        <a 
                          href={`https://wa.me/905380449090?text=Merhaba,%20${order.id}%20numaral%C4%B1%20sipari%C5%9Fim%20i%C3%A7in%20havale%20dekontumu%20iletmek%20istiyorum.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#219a4d] rounded-xl font-bold transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                          </svg>
                          Dekont İlet
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
