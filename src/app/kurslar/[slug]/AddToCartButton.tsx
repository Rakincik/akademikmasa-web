"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();

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

  return (
    <button 
      onClick={handleAddToCart}
      className="relative group/btn w-full bg-slate-900 hover:bg-brand-600 text-white py-5 rounded-2xl font-black text-xl transition-all duration-500 shadow-xl shadow-slate-900/20 hover:shadow-brand-600/40 flex items-center justify-center gap-3 mb-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <span>Sepete Ekle</span>
    </button>
  );
}
