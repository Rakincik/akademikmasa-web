"use client";

import { LayoutDashboard, Users, BookOpen, ShoppingCart, Settings, LogOut, Folder, Tag, Megaphone, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/kullanicilar", icon: Users, label: "Kullanıcılar / Şifreler" },
    { href: "/admin/egitmenler", icon: Users, label: "Eğitmenler" },
    { href: "/admin/kategoriler", icon: Folder, label: "Kategoriler" },
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

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 sticky top-0 h-screen hidden md:flex">
      <div className="p-6 border-b border-slate-800 flex items-center justify-center">
        <Link href="/admin">
          <img src="/logo-transparent.png" alt="Akademik Masa" className="h-10 brightness-0 invert" />
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = checkIsActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-brand-600 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 flex flex-col gap-1">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium transition-colors"
        >
          <Globe className="w-5 h-5" />
          <span>Siteye Dön</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-400 hover:bg-red-950/20 hover:text-red-300 font-medium transition-colors text-left"
        >
          <LogOut className="w-5 h-5 text-red-500/80" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
