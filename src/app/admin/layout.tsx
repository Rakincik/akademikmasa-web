import { LayoutDashboard, Users, BookOpen, ShoppingCart, Settings, LogOut, Folder } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 sticky top-0 h-screen hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center justify-center">
          <img src="/logo-transparent.png" alt="Akademik Masa" className="h-10 brightness-0 invert" />
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-brand-600 text-white font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/kullanicilar" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors">
              <Users className="w-5 h-5" />
              <span>Kullanıcılar / Şifreler</span>
            </Link>
            <Link href="/admin/egitmenler" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors">
              <Users className="w-5 h-5" />
              <span>Eğitmenler</span>
            </Link>
            <Link href="/admin/kategoriler" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors">
              <Folder className="w-5 h-5" />
              <span>Kategoriler</span>
            </Link>
            <Link href="/admin/kurslar" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>Eğitim / Ürünler</span>
            </Link>
            <Link href="/admin/siparisler" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span>Siparişler</span>
            </Link>
            <Link href="/admin/ayarlar" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium transition-colors">
              <Settings className="w-5 h-5" />
              <span>Site Ayarları</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 glass border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Yönetim Paneli</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="font-medium text-sm text-slate-700">Admin</span>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
