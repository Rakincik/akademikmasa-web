"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  LogOut,
  ExternalLink
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function PanelSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Genel Bakış",
      href: "/panel",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Siparişlerim",
      href: "/panel/siparislerim",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Hesap Bilgilerim",
      href: "/panel/hesabim",
      icon: <User className="w-5 h-5" />,
    }
  ];

  return (
    <aside className="w-64 bg-white h-screen sticky top-0 flex flex-col hidden lg:flex">

      {/* Menu Items */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={isActive ? "text-brand-600" : "text-slate-400"}>
                {item.icon}
              </div>
              {item.title}
            </Link>
          );
        })}

        <div className="pt-6 pb-2">
          <div className="h-px bg-slate-100 w-full mb-4"></div>
          <Link
            href="https://online.akademikmasa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 group"
          >
            <div className="text-slate-400 group-hover:text-brand-600 transition-colors">
              <ExternalLink className="w-5 h-5" />
            </div>
            Ders Paneline Git
          </Link>
        </div>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
