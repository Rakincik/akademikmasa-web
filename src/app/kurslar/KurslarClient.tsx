"use client";
import { ArrowRight, Search, SlidersHorizontal, ArrowUpDown, CheckCircle2, ChevronRight, Filter, ChevronDown, Star } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function KurslarClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sort, setSort] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    let result = [...initialProducts];
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(lowerSearch) || 
        c.description.toLowerCase().includes(lowerSearch)
      );
    }
    if (selectedCategory !== "Tümü") {
      result = result.filter(c => c.category?.id === selectedCategory);
    }
    
    if (sort === "price-asc") {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === "price-desc") {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [search, selectedCategory, sort, initialProducts]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner (Dark Corporate Style) */}
      <div className="bg-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600 rounded-full filter blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-brand-400 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Eğitim Paketleri</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Eğitim Paketlerimiz</h1>
              <p className="text-lg text-slate-300">Kariyer hedeflerinize ulaşmak için uzman eğitmenler tarafından hazırlanan eksiksiz programları keşfedin.</p>
            </div>
            
            {/* Arama Çubuğu */}
            <div className="w-full md:w-96 relative">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Eğitim, kategori veya kelime..." 
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent backdrop-blur-sm transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sol Kısım - Filtreler (Sidebar) */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-8">
              
              <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg border-b border-slate-100 pb-4">
                <Filter className="w-5 h-5 text-brand-600" /> Filtreler
              </div>

              {/* Kategoriler */}
              <div className="mb-8">
                <h4 className="font-bold tracking-widest text-xs uppercase text-slate-900 mb-4">KATEGORİ</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="category" checked={selectedCategory === "Tümü"} onChange={() => setSelectedCategory("Tümü")} className="peer appearance-none w-5 h-5 rounded border border-slate-300 checked:bg-brand-600 checked:border-brand-600 transition-colors" />
                      <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Tümü</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input type="radio" name="category" checked={selectedCategory === cat.id} onChange={() => setSelectedCategory(cat.id)} className="peer appearance-none w-5 h-5 rounded border border-slate-300 checked:bg-brand-600 checked:border-brand-600 transition-colors" />
                        <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100" />
                      </div>
                      <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kısım - Ürün Listesi */}
          <div className="flex-1">
            
            {/* Üst Bar (Sıralama ve Sonuç Sayısı) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-slate-600 font-medium">
                <span className="text-slate-900 font-bold text-lg">{filteredCourses.length}</span> eğitim listeleniyor
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 transition-colors w-full sm:w-auto justify-between"
                >
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  {sort === "default" && "Önerilen Sıralama"}
                  {sort === "price-asc" && "Fiyat: Düşükten Yükseğe"}
                  {sort === "price-desc" && "Fiyat: Yüksekten Düşüğe"}
                  {sort === "newest" && "En Yeniler"}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full sm:w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden">
                    <button onClick={() => { setSort("default"); setIsSortOpen(false); }} className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${sort === "default" ? "text-brand-600 bg-brand-50/50" : "text-slate-700"}`}>Önerilen Sıralama</button>
                    <button onClick={() => { setSort("price-asc"); setIsSortOpen(false); }} className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${sort === "price-asc" ? "text-brand-600 bg-brand-50/50" : "text-slate-700"}`}>Fiyat: Düşükten Yükseğe</button>
                    <button onClick={() => { setSort("price-desc"); setIsSortOpen(false); }} className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${sort === "price-desc" ? "text-brand-600 bg-brand-50/50" : "text-slate-700"}`}>Fiyat: Yüksekten Düşüğe</button>
                    <button onClick={() => { setSort("newest"); setIsSortOpen(false); }} className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${sort === "newest" ? "text-brand-600 bg-brand-50/50" : "text-slate-700"}`}>En Yeniler</button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="group bg-white rounded-[2rem] border border-slate-200 hover:border-brand-200 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300 overflow-hidden flex flex-col relative">
                  
                  {course.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> {course.badge}
                      </div>
                    </div>
                  )}

                  <Link href={`/kurslar/${course.slug}`} className="relative aspect-[3/4] overflow-hidden block bg-slate-100">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">Kapak Yok</div>
                    )}
                    
                    {course.category && (
                      <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                        {course.category.name}
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <Link href={`/kurslar/${course.slug}`}>
                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{course.title}</h4>
                    </Link>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
                    
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        {course.salePrice ? (
                          <>
                            <span className="text-xs text-slate-400 line-through font-semibold mb-0.5">₺{course.price.toLocaleString('tr-TR')}</span>
                            <span className="text-xl font-black text-slate-900">₺{course.salePrice.toLocaleString('tr-TR')}</span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-slate-900">₺{course.price.toLocaleString('tr-TR')}</span>
                        )}
                      </div>
                      <Link href={`/kurslar/${course.slug}`} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-brand-600 flex items-center justify-center text-slate-600 hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCourses.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sonuç Bulunamadı</h3>
                  <p className="text-slate-500">Arama kriterlerinize uygun eğitim paketi bulunmamaktadır.</p>
                  <button 
                    onClick={() => { setSearch(""); setSelectedCategory("Tümü"); }}
                    className="mt-6 px-6 py-2.5 bg-brand-50 text-brand-600 hover:bg-brand-100 font-bold rounded-xl transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
