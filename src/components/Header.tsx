"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown, GraduationCap, ChevronRight, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
  _count?: { products: number };
}

export default function Header() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent hydration mismatch for cart & fetch categories for menu
  useEffect(() => {
    setMounted(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Header categories load error:", err));
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

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
          
          {/* Eğitim Paketleri Dropdown (Desktop) */}
          <div
            className="relative py-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/kurslar"
              className="flex items-center gap-1.5 hover:text-brand-500 transition-colors py-1 group"
            >
              <span>Eğitim Paketleri</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 group-hover:text-brand-500 ${
                  isDropdownOpen ? "rotate-180 text-brand-500" : "text-slate-400"
                }`}
              />
            </Link>

            {/* Desktop Dropdown Submenu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in-50 slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <GraduationCap className="w-4 h-4 text-brand-600" />
                    <span>Eğitim Programları</span>
                  </div>
                  <Link
                    href="/kurslar"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <span>Tümünü Gör</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {categories.length === 0 ? (
                  <div className="py-2 text-center text-xs text-slate-400">
                    <Link
                      href="/kurslar"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block p-2 hover:bg-slate-50 rounded-xl font-medium text-slate-700"
                    >
                      Tüm Eğitim Paketlerini İncele →
                    </Link>
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                    {categories.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        {/* Parent Category Header */}
                        <Link
                          href={`/kurslar?kategori=${cat.slug}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-50/70 text-slate-900 font-bold text-sm group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-500 group-hover:scale-125 transition-transform"></span>
                            <span>{cat.name}</span>
                          </div>
                          {cat._count?.products ? (
                            <span className="text-[11px] font-medium text-slate-400 group-hover:text-brand-600">
                              {cat._count.products} Kurs
                            </span>
                          ) : null}
                        </Link>

                        {/* Subcategories under Parent */}
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-0.5">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/kurslar?kategori=${sub.slug}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center justify-between p-1.5 px-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-brand-600 text-xs transition-colors"
                              >
                                <span>{sub.name}</span>
                                {sub._count?.products ? (
                                  <span className="text-[10px] text-slate-400">
                                    {sub._count.products}
                                  </span>
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

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
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute top-full left-0 right-0 animate-in slide-in-from-top-2 z-50">
          <nav className="flex flex-col p-4 space-y-3 font-medium text-slate-600 max-h-[80vh] overflow-y-auto">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-500 transition-colors p-2 rounded-lg hover:bg-slate-50">Ana Sayfa</Link>
            
            {/* Mobile Accordion Menu */}
            <div>
              <button
                onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 hover:text-brand-500 transition-colors text-left"
              >
                <span>Eğitim Paketleri</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileAccordionOpen ? "rotate-180 text-brand-500" : ""}`} />
              </button>

              {isMobileAccordionOpen && (
                <div className="mt-1 ml-3 pl-3 border-l-2 border-brand-100 space-y-2 py-2 animate-in slide-in-from-top-1">
                  <Link
                    href="/kurslar"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2 text-xs font-bold text-brand-600 bg-brand-50/60 rounded-lg hover:bg-brand-100/60 transition-colors"
                  >
                    Tüm Eğitim Paketlerini İncele →
                  </Link>

                  {categories.map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <Link
                        href={`/kurslar?kategori=${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block p-2 text-xs font-bold text-slate-800 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        • {cat.name}
                      </Link>

                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="ml-3 space-y-1 border-l border-slate-200 pl-2">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/kurslar?kategori=${sub.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block p-1.5 text-xs text-slate-600 hover:text-brand-600 rounded-md hover:bg-slate-50 transition-colors"
                            >
                              - {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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

