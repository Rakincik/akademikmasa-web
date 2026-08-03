"use client";
import { useState, useEffect } from "react";
import { Trash2, ArrowRight, ShieldCheck, CreditCard, Tag, ChevronLeft, ShoppingBag, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

import { validateCoupon, getRecommendedProducts } from "./actions";

export default function CartPage() {
  const { items, addToCart, removeFromCart } = useCart();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      const productIds = items.map(item => item.id);
      const res = await getRecommendedProducts(productIds);
      if (res.success) {
        setAllProducts(res.products);
      }
    };
    fetchRecommendations();
  }, [items]);
  const [activeCoupon, setActiveCoupon] = useState<{code: string, discountType: string, discountValue: number, allowedProductIds: string[]} | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isEftModalOpen, setIsEftModalOpen] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.salePrice ? (item.price - item.salePrice) : 0), 0);

  // Kupon geçerliliği sepet güncellendikçe kontrol edilir
  useEffect(() => {
    if (activeCoupon && activeCoupon.allowedProductIds && activeCoupon.allowedProductIds.length > 0) {
      const hasValidProduct = items.some(item => activeCoupon.allowedProductIds.includes(item.id));
      if (!hasValidProduct) {
        setActiveCoupon(null);
        setPromoError("Geçerli ürün sepetten çıkarıldığı için indirim kuponu iptal edildi.");
      }
    }
  }, [items, activeCoupon]);
  
  let promoDiscount = 0;
  if (activeCoupon) {
    const isRestricted = activeCoupon.allowedProductIds && activeCoupon.allowedProductIds.length > 0;
    
    if (isRestricted) {
      const validItems = items.filter(item => activeCoupon.allowedProductIds.includes(item.id));
      const validItemsTotal = validItems.reduce((sum, item) => {
        const itemPrice = item.salePrice || item.price;
        return sum + itemPrice;
      }, 0);
      
      if (activeCoupon.discountType === "PERCENTAGE") {
        promoDiscount = validItemsTotal * (activeCoupon.discountValue / 100);
      } else {
        promoDiscount = Math.min(validItemsTotal, activeCoupon.discountValue);
      }
    } else {
      if (activeCoupon.discountType === "PERCENTAGE") {
        promoDiscount = (subtotal - totalDiscount) * (activeCoupon.discountValue / 100);
      } else {
        promoDiscount = Math.min(subtotal - totalDiscount, activeCoupon.discountValue);
      }
    }
  }
  
  const finalTotal = Math.max(0, subtotal - totalDiscount - promoDiscount);
  const recommendations = allProducts.filter(p => !items.some(item => item.id === p.id));

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (!promoCode.trim()) return;

    setIsChecking(true);
    try {
      const res = await validateCoupon(promoCode);
      if (res.success && res.coupon) {
        const allowedIds = res.coupon.allowedProductIds || [];
        if (allowedIds.length > 0) {
          const hasValidProduct = items.some(item => allowedIds.includes(item.id));
          if (!hasValidProduct) {
            setPromoError("Bu kupon kodu sepetinizdeki ürünler için geçerli değil.");
            setIsChecking(false);
            return;
          }
        }
        setActiveCoupon(res.coupon);
        setPromoCode("");
      } else {
        setPromoError(res.message || "Geçersiz kod.");
      }
    } catch (err) {
      setPromoError("Bağlantı hatası.");
    } finally {
      setIsChecking(false);
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id })),
          couponCode: activeCoupon?.code
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else if (data.freeCheckout) {
          window.location.href = '/panel/siparislerim?success=true';
        }
      } else {
        alert(data.error || 'Ödeme başlatılırken bir sorun oluştu.');
      }
    } catch (error) {
      console.error('Ödeme işlemi başarısız:', error);
      alert('Sistemsel bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
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

            {recommendations.length > 0 && (
              <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Bunlar da İlginizi Çekebilir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.slice(0, 4).map((prod) => (
                    <div key={prod.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-brand-200 hover:shadow-md transition-all group bg-slate-50/50">
                      <Link href={`/kurslar/${prod.slug}`} className="w-20 h-24 rounded-xl overflow-hidden shrink-0 block relative">
                        <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div>
                          <Link href={`/kurslar/${prod.slug}`}>
                            <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">{prod.title}</h4>
                          </Link>
                          <p className="text-slate-400 text-xs mt-1 font-medium">{prod.instructor}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-col">
                            {prod.salePrice ? (
                              <>
                                <span className="text-[10px] text-slate-400 line-through font-bold">₺{prod.price.toLocaleString('tr-TR')}</span>
                                <span className="text-sm font-black text-brand-600">₺{prod.salePrice.toLocaleString('tr-TR')}</span>
                              </>
                            ) : (
                              <span className="text-sm font-black text-slate-900">₺{prod.price.toLocaleString('tr-TR')}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(prod)}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ Taraf: Sipariş Özeti (Ultra Premium Panel) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              
              <h2 className="text-2xl font-black text-slate-900 mb-6">Sipariş Özeti</h2>

              {/* İndirim Kodu Alanı */}
              <div className="mb-8 relative">
                {!activeCoupon ? (
                  <form onSubmit={handleApplyPromo} className="relative flex flex-col gap-2">
                    <div className="relative flex items-center">
                      <Tag className="absolute left-4 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="İndirim Kodu"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={isChecking}
                        className="w-full pl-12 pr-24 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-bold text-slate-700 uppercase"
                      />
                      <button type="submit" disabled={isChecking} className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center min-w-[80px]">
                        {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Uygula"}
                      </button>
                    </div>
                    {promoError && <span className="text-red-500 font-bold text-sm px-2">{promoError}</span>}
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-emerald-700 font-bold text-sm leading-none mb-1">Kupon Uygulandı</p>
                        <p className="text-emerald-900 font-black tracking-wide">{activeCoupon.code}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveCoupon(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors" title="Kuponu Kaldır">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
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
                {activeCoupon && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Promosyon ({activeCoupon.code})</span>
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

              {/* Kredi Kartı ile Ödeme Butonu */}
              <button 
                onClick={processPayment}
                disabled={isProcessing}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-5 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] shadow-[0_15px_30px_rgba(191,29,48,0.2)] flex items-center justify-center gap-3 mb-3 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>Kredi Kartı ile Öde <CreditCard className="w-6 h-6" /></>
                )}
              </button>

              {/* Havale / EFT Butonu */}
              <button 
                onClick={() => setIsEftModalOpen(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 mb-6"
              >
                Havale / EFT ile Öde
              </button>

              {/* Güvenlik Göstergeleri */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> %100 Güvenli Alışveriş (256-Bit SSL)
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                  <CreditCard className="w-5 h-5 text-slate-400" /> Kredi Kartına 12 Taksit İmkanı
                </div>
                <div className="mt-2 text-center text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                  * Ödemenizi yaptıktan sonra şifrenizi almak için WhatsApp'tan bize ulaşmayı unutmayın.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Havale/EFT Modal */}
      {isEftModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
            <button 
              onClick={() => setIsEftModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Havale / EFT ile Ödeme</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              IBAN bilgisi almak ve ödeme bildirimi yapmak için lütfen WhatsApp destek hattımızdan bizimle iletişime geçin.
            </p>
            <a 
              href={`https://wa.me/905380449090?text=${encodeURIComponent(`Merhaba "${items.map(i => i.title).join(', ')}" paketini satın almak istiyorum, IBAN bilgisi paylaşır mısınız?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-[#25D366]/20"
            >
              WhatsApp ile İletişime Geç
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
