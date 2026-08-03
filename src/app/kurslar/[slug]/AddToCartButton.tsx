"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isFree = product.price === 0 || product.salePrice === 0;

  const handleFreeJoin = async () => {
    if (!session) {
      // Giriş yapmamışsa kayıt sayfasına yönlendir, kayıt sonrası bu sayfaya dönsün
      router.push(`/auth/register?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: product.id }]
        })
      });
      const data = await response.json();
      if (response.ok && data.freeCheckout) {
        router.push('/panel/siparislerim?success=true');
      } else {
        alert(data.error || 'İşlem başlatılırken bir sorun oluştu.');
      }
    } catch (err) {
      console.error(err);
      alert('Sistemsel bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      image: product.imageUrl || "",
      slug: product.slug,
      instructor: product.instructors?.[0]?.name || "Akademik Masa",
    });
    router.push("/sepet");
  };

  if (isFree) {
    return (
      <button 
        onClick={handleFreeJoin}
        disabled={loading}
        className="relative group/btn w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl transition-all duration-500 shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center justify-center gap-3 mb-6 overflow-hidden disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>
            <span>Ücretsiz Kayıt Ol</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button 
      onClick={handleAddToCart}
      className="relative group/btn w-full bg-slate-900 hover:bg-brand-600 text-white py-5 rounded-2xl font-black text-xl transition-all duration-500 shadow-xl shadow-slate-900/20 hover:shadow-brand-600/40 flex items-center justify-center gap-3 mb-6 overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <span>Sepete Ekle</span>
    </button>
  );
}
