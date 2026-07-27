"use client";
import { useState, useMemo } from "react";
import { Search, Award, Quote, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Instructor } from "@prisma/client";

const CATEGORIES = ["Tüm Kadro", "Türkçe ÖABT", "MEB-AGS"];

export default function KadromuzClient({ instructors }: { instructors: Instructor[] }) {
  const [activeCategory, setActiveCategory] = useState("Tüm Kadro");
  const [search, setSearch] = useState("");

  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst) => {
      const department = inst.department || "";
      const branch = inst.branch || inst.title || "";
      
      const matchesCategory = activeCategory === "Tüm Kadro" || department === activeCategory;
      const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase()) || branch.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, instructors]);

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-sm mb-6 border border-brand-500/30 backdrop-blur-sm">
            <Award className="w-4 h-4" /> Şampiyonların Kadrosu
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            Eğitimde <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">Yıldızlar Geçidi</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Türkiye'nin dört bir yanındaki binlerce adayı hedeflerine ulaştıran, alanında zirveye yerleşmiş duayen eğitim kadromuzla tanışın. Onlar birer eğitmen değil, başarınızın mimarları.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        
        {/* Filters & Search */}
        <div className="bg-white/80 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 rounded-3xl p-4 mb-24 flex flex-col md:flex-row items-center justify-between gap-6 border border-white">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105" 
                    : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Eğitmen veya branş ara..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* MİND-BLOWING INSTRUCTORS GRID */}
        {filteredInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-28 mt-20">
            {filteredInstructors.map((instructor) => (
              <div key={instructor.id} className="group relative flex flex-col perspective-1000">
                
                {/* Efsanevi Hover Glow Arka Planı (Sadece hoverda belirir, kartın dışına taşar) */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-amber-400 to-brand-500 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-60 transition duration-700 group-hover:duration-300"></div>
                
                {/* Ana Kart (Pop-out efektine imkan tanımak için overflow-visible) */}
                <div className="relative bg-white rounded-[3rem] shadow-xl border border-white p-8 pt-24 flex flex-col flex-grow transform transition-all duration-500 group-hover:-translate-y-3">
                  
                  {/* Arka Plan Dekoratif Tırnak */}
                  <div className="absolute top-4 right-6 text-slate-100 opacity-50 transform -scale-x-100 group-hover:text-brand-50 transition-colors duration-500">
                    <Quote className="w-24 h-24" />
                  </div>

                  {/* POPOUT AVATAR: Kartın üstünden dışarı taşan devasa 3D hissi veren avatar */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-4 z-20">
                    {/* Avatar arkası renkli gölge */}
                    <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    {/* Avatarın kendisi */}
                    <img 
                      src={instructor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=random`}
                      alt={instructor.name} 
                      className="relative w-full h-full object-cover rounded-[2.5rem] border-4 border-white shadow-2xl z-10 filter group-hover:brightness-110 transition-all duration-500 bg-white"
                      style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} // Benzersiz organik şekil
                    />
                    
                    {/* Hoverda Avatar Köşesinde Beliren Doğrulanmış İkonu */}
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 z-30 delay-100">
                      <CheckCircle2 className="w-6 h-6 text-brand-500 fill-brand-100" />
                    </div>
                  </div>

                  {/* Kart İçeriği */}
                  <div className="text-center flex-grow flex flex-col relative z-10 mt-2">
                    <span className="text-brand-500 font-black text-[0.65rem] tracking-[0.2em] uppercase mb-3 block">
                      {instructor.branch || instructor.title || "Eğitmen"}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">
                      {instructor.name}
                    </h3>
                    
                    <p className="text-slate-500 text-sm font-medium italic mb-8 leading-relaxed">
                      "{instructor.motto || "Eğitimde sınırları zorlayan, yenilikçi yaklaşımlar."}"
                    </p>

                    {/* Footer / Sosyal Medya & Departman */}
                    <div className="mt-auto pt-6 border-t border-slate-100/60 flex items-center justify-between">
                      <div className="inline-flex items-center justify-center bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl text-xs font-bold border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                        {instructor.department || "Diğer"}
                      </div>

                      {/* Çok şık minimalist sosyal medya ikonları */}
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-white hover:scale-110 transition-all duration-300 hover:-rotate-12">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </button>
                        <button className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-brand-500 hover:to-amber-500 hover:text-white hover:scale-110 transition-all duration-300 hover:rotate-12">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Eğitmen Bulunamadı</h3>
            <p className="text-slate-500">Arama kriterlerinize uygun bir eğitmen kadromuzda bulunmamaktadır.</p>
            <button 
              onClick={() => {setSearch(""); setActiveCategory("Tüm Kadro");}}
              className="mt-6 text-brand-600 font-semibold hover:text-brand-700 underline underline-offset-4"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
