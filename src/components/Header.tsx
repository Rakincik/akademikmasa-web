"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch for the cart counter
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <img src="/logo-transparent.png" alt="Akademik Masa" className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-sm hover:scale-[1.02] transition-transform origin-left" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link href="/" className="hover:text-brand-500 transition-colors">Ana Sayfa</Link>
          <Link href="/kurslar" className="hover:text-brand-500 transition-colors">Eğitim Paketleri</Link>
          <Link href="/hakkimizda" className="hover:text-brand-500 transition-colors">Hakkımızda</Link>
          <Link href="/kadromuz" className="hover:text-brand-500 transition-colors">Kadromuz</Link>
          <Link href="/iletisim" className="hover:text-brand-500 transition-colors">İletişim</Link>
          <Link href="https://www.youtube.com/@akademikmasa" target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-slate-800/30 text-sm text-center w-36 flex items-center justify-center shrink-0">Örnek Dersler</Link>
          <Link href="https://akm.muro.click/admin/dashboard" target="_blank" rel="noopener noreferrer" className="bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-brand-600/30 text-sm text-center w-36 flex items-center justify-center shrink-0">Ders Paneli</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/sepet" className="relative p-2 text-slate-600 hover:text-brand-600 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-brand-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse-once">
                {totalItems}
              </span>
            )}
          </Link>
          <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>
          {session ? (
            <Link href={(session?.user as any)?.role === "ADMIN" ? "/admin" : "/panel"} className="flex items-center gap-3 ml-2 group">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="font-bold text-sm text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">{session.user.name}</span>
                <span className="font-medium text-xs text-slate-500 leading-tight">{(session?.user as any)?.role === "ADMIN" ? "Yönetici" : "Öğrenci"}</span>
              </div>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-600 hover:text-brand-600 font-bold hidden md:block transition-colors">
                Giriş Yap
              </Link>
              <Link href="/auth/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-brand-600/30 ml-1 sm:ml-2 text-sm sm:text-base">
                Kayıt Ol
              </Link>
            </>
          )}
          
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-brand-600 transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute top-full left-0 right-0 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-4 font-medium text-slate-600">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-500 transition-colors p-2 rounded-lg hover:bg-slate-50">Ana Sayfa</Link>
            <Link href="/kurslar" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-500 transition-colors p-2 rounded-lg hover:bg-slate-50">Eğitim Paketleri</Link>
            <Link href="/hakkimizda" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-500 transition-colors p-2 rounded-lg hover:bg-slate-50">Hakkımızda</Link>
            <Link href="/kadromuz" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-500 transition-colors p-2 rounded-lg hover:bg-slate-50">Kadromuz</Link>
            <Link href="/iletisim" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-500 transition-colors p-2 rounded-lg hover:bg-slate-50">İletişim</Link>
            <Link href="https://www.youtube.com/@akademikmasa" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all text-center mx-2 mt-2 shadow-md">Örnek Dersler</Link>
            <Link href="https://akm.muro.click/admin/dashboard" target="_blank" rel="noopener noreferrer" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all text-center mx-2 mt-2 shadow-md">Ders Paneli</Link>
            <div className="h-px bg-slate-100 my-2"></div>
            {session ? (
              <Link href={(session?.user as any)?.role === "ADMIN" ? "/admin" : "/panel"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mx-2 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-800 leading-tight">{session.user.name}</span>
                  <span className="font-medium text-xs text-slate-500 leading-tight">{(session?.user as any)?.role === "ADMIN" ? "Yönetici" : "Öğrenci"}</span>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col gap-2 px-2">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-900 font-bold p-3 text-center border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Giriş Yap</Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-600 text-white font-bold p-3 text-center rounded-xl shadow-md hover:bg-brand-700 transition-colors">Kayıt Ol</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
