import Link from "next/link";
import { Building2, Phone, Trophy, GraduationCap, Home, BookOpen, ChevronRight, Plus } from "lucide-react";

export default function SettingsPage() {
  const pages = [
    { id: "home", title: "Ana Sayfa", desc: "Hero alanı, istatistikler, öne çıkan eğitimler, SEO bilgileri", icon: Home, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "about", title: "Hakkımızda", desc: "Misyon, vizyon, değerlerimiz ve kurumsal metinler", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "contact", title: "İletişim", desc: "İletişim formu bilgileri, adres, telefon, e-posta", icon: Phone, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "instructors", title: "Kadromuz", desc: "Eğitmen kadrosu sayfasının genel başlıkları ve açıklaması", icon: GraduationCap, color: "text-orange-600", bg: "bg-orange-50" },
    { id: "courses", title: "Kurslar (Tüm Eğitimler)", desc: "Kurslar ana sayfasının hero metinleri ve banner bilgileri", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Başlık Alanı */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sayfa İçerikleri</h1>
        <p className="text-slate-500 mt-1">Her sayfanın başlıklarını, açıklamalarını, istatistiklerini ve görsellerini düzenleyin.</p>
      </div>

      {/* Grid Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page) => (
          <Link 
            href={`/admin/ayarlar/${page.id}`} 
            key={page.id}
            className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${page.bg} ${page.color} group-hover:scale-110 transition-transform duration-300`}>
                <page.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{page.title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{page.desc}</p>
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-6 h-6" />
            </div>
          </Link>
        ))}

        {/* Yeni Sayfa Ekle Butonu */}
        <button className="bg-brand-50/50 border-2 border-dashed border-brand-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-brand-100">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">Yeni Alt Sayfa Ekle</span>
        </button>
      </div>
    </div>
  );
}
