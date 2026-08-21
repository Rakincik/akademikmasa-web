"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, X, KeyRound, Smartphone, ExternalLink } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/context/CartContext";

export default function SuccessPopup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    // Both payment=success (Shopier standard) or success=true (Free checkout)
    if (searchParams.get("success") === "true" || searchParams.get("payment") === "success") {
      setIsOpen(true);
      clearCart(); // Kullanıcının sepetini temizle
      
      // Clean up the URL without reloading the page
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams, clearCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 relative animate-in zoom-in-95 duration-300">
        
        {/* Kapat Butonu */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-slate-400 hover:text-slate-600 active:bg-slate-200 bg-slate-100 rounded-full p-2 transition-colors touch-manipulation z-10"
          title="Kapat"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex flex-col items-center text-center pt-2 sm:pt-0">
          {/* Başarı İkonu */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3.5 sm:mb-4 ring-4 sm:ring-8 ring-emerald-50 shrink-0">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          
          {/* Başlık & Açıklama */}
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1 leading-snug px-2">
            Satın Alımınız Başarıyla Gerçekleşti!
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed px-1">
            Eğitimleriniz hesabınıza tanımlandı. Hemen ders çalışmaya başlayabilirsiniz.
          </p>
          
          {/* Giriş Bilgileri Bilgilendirme Kartı */}
          <div className="w-full bg-indigo-50/70 border border-indigo-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 text-left space-y-2 sm:space-y-2.5 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-[11px] sm:text-xs uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
              <span>Ders Paneli Giriş Bilgileriniz</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-white/90 p-2.5 sm:p-3 rounded-xl border border-indigo-100/60 shadow-xs">
              <Smartphone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-slate-900 block text-[11px] sm:text-xs mb-0.5">Kullanıcı Adı:</span>
                <span className="text-[11px] sm:text-xs">
                  Başında <strong className="text-indigo-700 underline underline-offset-2">0 OLMADAN</strong> telefon numaranız{" "}
                  <span className="text-slate-400 font-mono block sm:inline mt-0.5 sm:mt-0">(Örn: 5xxxxxxxxx)</span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-white/90 p-2.5 sm:p-3 rounded-xl border border-indigo-100/60 shadow-xs">
              <KeyRound className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-slate-900 block text-[11px] sm:text-xs mb-0.5">Şifre:</span>
                <span className="text-[11px] sm:text-xs">Web sitemize kayıt olurken belirlediğiniz şifreniz</span>
              </div>
            </div>
          </div>

          {/* Aksiyon Butonu */}
          <Link 
            href="https://online.akademikmasa.com"
            target="_blank"
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all text-sm sm:text-base flex items-center justify-center gap-2 mb-2 touch-manipulation"
          >
            <span>Ders Paneline Git</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
            (online.akademikmasa.com adresinden dilediğiniz zaman erişebilirsiniz)
          </p>
        </div>
      </div>
    </div>
  );
}
