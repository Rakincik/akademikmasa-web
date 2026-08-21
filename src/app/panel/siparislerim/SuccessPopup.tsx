"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2">Satın Alımınız Başarıyla Gerçekleşmiştir</h2>
          <p className="text-slate-500 mb-8">Eğitimleriniz hesabınıza tanımlandı. Hemen ders çalışmaya başlayabilirsiniz.</p>
          
          <Link 
            href="https://online.akademikmasa.com"
            target="_blank"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all text-lg mb-4"
          >
            Ders Paneline Git
          </Link>
          
          <p className="text-red-500 font-bold text-sm">
            * Web sitesine üye olurken kullandığınız e-posta ve şifre ile girebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
