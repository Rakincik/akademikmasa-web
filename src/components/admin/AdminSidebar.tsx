"use client";

import { useEffect } from "react";
import { LayoutDashboard, Users, BookOpen, ShoppingCart, Settings, LogOut, Folder, Tag, Megaphone, Globe, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminSidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  // Close sidebar on pathname change
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/kullanicilar", icon: Users, label: "Kullanıcılar / Şifreler" },
    { href: "/admin/egitmenler", icon: Users, label: "Eğitmenler" },
    { href: "/admin/kategoriler", icon: Folder, label: "Kategori & Menü Yönetimi" },
    { href: "/admin/kurslar", icon: BookOpen, label: "Eğitim / Ürünler" },
    { href: "/admin/siparisler", icon: ShoppingCart, label: "Siparişler" },
    { href: "/admin/kuponlar", icon: Tag, label: "İndirim Kuponları" },
    { href: "/admin/influencer", icon: Megaphone, label: "Influencer Pazarlama" },
    { href: "/admin/ayarlar", icon: Settings, label: "Site Ayarları" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  const sidebarContent = (
    <div className="w-60 bg-slate-900 text-white flex flex-col h-full shrink-0 border-r border-slate-800">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
        <Link href="/admin" onClick={onClose}>
          <img src="/logo-transparent.png" alt="Akademik Masa" className="h-9 brightness-0 invert opacity-95 transition-opacity hover:opacity-100" />
        </Link>
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Scrollable Navigation Area - Completely Hides Scrollbar */}
      <div className="flex-1 overflow-y-auto py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                  isActive 
                    ? "bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/20 scale-[1.02]" 
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-transform duration-200 ${isActive ? "scale-110 text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Quick Actions */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-1.5 text-xs font-semibold bg-slate-950/10">
        <Link 
          href="/" 
          onClick={onClose}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <Globe className="w-[18px] h-[18px]" />
          <span>Siteye Dön</span>
        </Link>
        <button
          onClick={() => {
            if (onClose) onClose();
            signOut({ callbackUrl: "/" });
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-red-400/90 hover:bg-red-950/20 hover:text-red-300 transition-all duration-200 text-left cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] text-red-500/80" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on md screens and above) */}
      <aside className="w-60 bg-slate-900 text-white flex-col shadow-2xl z-20 sticky top-0 h-screen hidden md:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible on mobile when isOpen is true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          ></div>

          {/* Drawer Sidebar Pane */}
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
