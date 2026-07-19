"use client";
import { useState } from "react";
import { Trash2, ArrowRight, ShieldCheck, CreditCard, Tag, ChevronLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.salePrice ? (item.price - item.salePrice) : 0), 0);
  const promoDiscount = isPromoApplied ? 500 : 0;
  const finalTotal = subtotal - totalDiscount - promoDiscount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "MASA500") {
      setIsPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full border-dashed animate-spin-slow"></div>
          <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Sepetiniz Boş</h2>
        <p className="text-slate-500 text-lg mb-8 text-center max-w-md">Hedeflerinize ulaşmak için ilk adımı atın. Sizin için hazırladığımız özel eğitim paketlerini keşfedin.</p>
        <Link href="/kurslar" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-brand-600/30 flex items-center gap-2">
          Eğitimlere Göz At <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      
      {/* Şık ve Kurumsal Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-8">
        <div className="container mx-auto px-4">
          <Link href="/kurslar" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Alışverişe Devam Et
          </Link>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Sepetim</h1>
            <span className="text-slate-500 font-bold bg-slate-100 px-4 py-1.5 rounded-lg">{items.length} Eğitim</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sol Taraf: Sepet Ürünleri */}
          <div className="w-full lg:w-2/3 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2rem] p-4 pr-6 lg:p-6 border border-slate-200 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-brand-200 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Görsel */}
                <Link href={`/kurslar/${item.slug}`} className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden shrink-0 block">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                </Link>

                {/* Detaylar */}
                <div className="flex-grow flex flex-col justify-center h-full">
                  <Link href={`/kurslar/${item.slug}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">{item.title}</h3>
                  </Link>
                  <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> {item.instructor}
                  </p>
                </div>

                {/* Fiyat & Silme */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                  <div className="flex flex-col items-start sm:items-end">
                    {item.salePrice ? (
                      <>
                        <span className="text-sm text-slate-400 line-through font-bold mb-0.5">₺{item.price.toLocaleString('tr-TR')}</span>
                        <span className="text-2xl font-black text-brand-600">₺{item.salePrice.toLocaleString('tr-TR')}</span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-slate-900">₺{item.price.toLocaleString('tr-TR')}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                    title="Sepetten Çıkar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Sağ Taraf: Sipariş Özeti (Ultra Premium Panel) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              
              <h2 className="text-2xl font-black text-slate-900 mb-6">Sipariş Özeti</h2>

              {/* İndirim Kodu Alanı */}
              <div className="mb-8 relative">
                <form onSubmit={handleApplyPromo} className="relative flex items-center">
                  <Tag className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="İndirim Kodu (MASA500)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isPromoApplied}
                    className="w-full pl-12 pr-24 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-bold text-slate-700 uppercase"
                  />
                  {!isPromoApplied ? (
                    <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors text-sm">
                      Uygula
                    </button>
                  ) : (
                    <div className="absolute right-4 text-emerald-500 font-bold text-sm">Uygulandı</div>
                  )}
                </form>
              </div>

              {/* Hesaplamalar */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toLocaleString('tr-TR')}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-brand-600 font-bold">
                    <span>Paket İndirimleri</span>
                    <span>-₺{totalDiscount.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Promosyon (MASA500)</span>
                    <span>-₺{promoDiscount.toLocaleString('tr-TR')}</span>
                  </div>
                )}
              </div>

              {/* Çizgi */}
              <div className="w-full h-px bg-slate-200 mb-6"></div>

              {/* Genel Toplam */}
              <div className="flex items-end justify-between mb-8">
                <span className="text-lg font-bold text-slate-900">Genel Toplam</span>
                <span className="text-4xl font-black text-slate-900">₺{finalTotal.toLocaleString('tr-TR')}</span>
              </div>

              {/* Ödeme Butonu */}
              <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-5 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] shadow-[0_15px_30px_rgba(191,29,48,0.2)] flex items-center justify-center gap-3 mb-6">
                Güvenli Ödemeye Geç <ArrowRight className="w-6 h-6" />
              </button>

              {/* Güvenlik Göstergeleri */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> %100 Güvenli Alışveriş (256-Bit SSL)
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                  <CreditCard className="w-5 h-5 text-slate-400" /> Kredi Kartına 12 Taksit İmkanı
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
