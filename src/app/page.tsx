import { ArrowRight, CheckCircle2, PlayCircle, Star, ShieldCheck, Users, BookOpen, Trophy, Medal, FileText } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const dbCourses = await prisma.product.findMany({
    where: { isPublished: true },
    take: 6,
    orderBy: { order: 'asc' }
  });

  const homeContent = await prisma.siteContent.findUnique({
    where: { pageId: 'home' }
  });

  // Varsayılan veriler (CMS'ten gelmezse)
  let heroData = {
    badge: "2027 Erken Kayıt Fırsatları Başladı",
    title1: "Geleceğinize",
    title2: "Akademik Masa",
    title3: "ile Hazırlanın.",
    description: "Uzman kadromuzla KPSS, ÖABT ve tüm akademik sınavlarda hedeflerinize en hızlı şekilde ulaşın. Hemen kaydolun, rakiplerinizin bir adım önüne geçin.",
    stats: [
      { value: "5.000+", label: "Mutlu Derece Öğrencisi" },
      { value: "%98.4", label: "Başarı Oranı" }
    ]
  };

  if (homeContent) {
    try {
      const parsed = JSON.parse(homeContent.content);
      if (parsed.hero) heroData = parsed.hero;
    } catch (e) {
      console.error("Home content parse error:", e);
    }
  }
  
  return (
    <div className="flex flex-col">
      {/* KURUMSAL & PREMIUM HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50">
        
        {/* Subtle Corporate Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-brand-50 to-transparent pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-100/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Sol Taraf: Metinler (Kurumsal, Net, Güçlü) */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 font-semibold text-sm mb-2">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                {heroData.badge}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                {heroData.title1} <br className="hidden md:block"/>
                <span className="text-brand-600">{heroData.title2}</span> {heroData.title3}
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {heroData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/kurslar" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-brand-600/30 flex items-center justify-center gap-2">
                  Eğitimleri İncele <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#nasil-calisir" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5 text-slate-400" /> Nasıl Çalışır?
                </Link>
              </div>

              {/* Kurumsal Güven Göstergeleri */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 pt-10 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-50 p-2.5 rounded-lg text-brand-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-900 font-bold text-sm">Türkiye'nin En İyi</p>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Eğitim Kadrosu</p>
                  </div>
                </div>
                
                <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2.5 rounded-lg text-amber-500">
                    <Star className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-900 font-bold text-sm">{heroData.stats[0]?.value || "5.000+"}</p>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{heroData.stats[0]?.label || "Mutlu Öğrenci"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sağ Taraf: Kurumsal, Şık Görsel Sunum */}
            <div className="flex-1 w-full mt-16 lg:mt-0 relative">
              <div className="relative z-10 rounded-[2rem] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                  alt="Öğrenciler" 
                  className="rounded-[1.5rem] w-full object-cover aspect-[4/3]"
                />
                
                {/* Floating Corporate Badge: Başarı Oranı */}
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">{heroData.stats[1]?.label || "Başarı Oranı"}</p>
                    <p className="text-2xl font-black text-slate-900">{heroData.stats[1]?.value || "%98.4"}</p>
                  </div>
                </div>


              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Featured Courses Section (Horizontal Scroll Carousel) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-3">Eğitim Programları</h2>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-4">Size En Uygun Kursu Seçin</h3>
              <p className="text-slate-600 text-lg">Alanında uzman hocalarımızla hazırladığımız, tamamen sınav odaklı profesyonel paketlerimiz.</p>
            </div>
            <Link href="/kurslar" className="hidden md:inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors">
              Tümünü Gör <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* HORIZONTAL CAROUSEL CONTAINER */}
          <div className="flex gap-6 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {dbCourses.map((course) => (
              <div key={course.id} className="w-[85vw] sm:w-[360px] shrink-0 snap-center group bg-white rounded-[2rem] border border-slate-200 hover:border-brand-200 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300 overflow-hidden flex flex-col relative">
                
                {course.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> {course.badge}
                    </div>
                  </div>
                )}

                <Link href={`/kurslar/${course.slug}`} className="relative h-56 overflow-hidden block bg-slate-100">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">Kapak Yok</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-sm">Eğitim Paketi</div>
                </Link>
                
                <div className="p-8 flex flex-col flex-grow">
                  <Link href={`/kurslar/${course.slug}`}>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">{course.title}</h4>
                  </Link>
                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      {course.salePrice ? (
                        <>
                          <span className="text-xs text-slate-400 line-through font-semibold mb-0.5">₺{course.price.toLocaleString('tr-TR')}</span>
                          <span className="text-2xl font-black text-slate-900">₺{course.salePrice.toLocaleString('tr-TR')}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black text-slate-900">₺{course.price.toLocaleString('tr-TR')}</span>
                      )}
                    </div>
                    <Link href={`/kurslar/${course.slug}`} className="bg-slate-50 hover:bg-brand-600 text-slate-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                      İncele <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* View All Card */}
            <div className="w-[85vw] sm:w-[360px] shrink-0 snap-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-brand-300 hover:bg-brand-50/50 transition-all">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-8 h-8 text-brand-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Tüm Eğitimler</h4>
              <p className="text-slate-500 text-center text-sm font-medium">Hedefinize uygun onlarca farklı eğitim paketini inceleyin.</p>
              <Link href="/kurslar" className="mt-8 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-slate-700 hover:text-brand-600 shadow-sm">
                Kataloğa Git
              </Link>
            </div>

          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/kurslar" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-base border border-slate-200 transition-all shadow-sm w-full">
              Tüm Eğitimleri İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Şampiyonlar Ligi (Başarı Hikayeleri) */}
      <section className="py-32 bg-slate-50 relative overflow-hidden border-y border-slate-200">
        {/* Lüks Arka Plan Atmosferi (Light Mode) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-amber-400/10 rounded-full blur-[150px] mix-blend-multiply opacity-50"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-400/5 rounded-full blur-[150px] mix-blend-multiply opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="flex justify-center mb-8">
              <img src="/logo-transparent.png" alt="Akademik Masa" className="h-16 sm:h-20 object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Gurur <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">Tablomuz</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium">
              Türkiye derecesi yapan öğrencilerimizin arasına katılın. Onlar başardı, sıradaki neden siz olmayasınız?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Türkiye 3.sü */}
            <div className="group bg-white border border-slate-200 shadow-sm p-8 rounded-[2rem] hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-200 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="absolute -top-10 -left-10 text-[10rem] font-black text-slate-900/[0.03] group-hover:text-brand-600/15 transition-colors pointer-events-none select-none">3</div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50/50 border border-brand-100 rounded-2xl mb-8">
                  <Medal className="w-5 h-5 text-brand-600" />
                  <span className="text-brand-700 font-black tracking-tight text-lg">Türkiye 3.sü</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-xl shrink-0">
                    ÖÖ
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg">Özlem Ö.</h4>
                    <p className="text-slate-500 text-sm font-medium">Türkçe ÖABT</p>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed italic relative z-10 text-lg mb-6 mt-4">
                  "Akademik Masa ile nokta atışı!"
                </p>
                {/* Sonuç Belgesi Fotoğrafı */}
                <div className="w-full h-28 rounded-xl border border-slate-200 overflow-hidden relative group/doc cursor-pointer mt-auto">
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/30 shadow-sm">Belgeyi Gör</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" alt="Sınav Sonucu" className="w-full h-full object-cover opacity-70 group-hover/doc:opacity-100 group-hover/doc:scale-105 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center gap-1 shadow-sm">
                    <FileText className="w-3 h-3 text-brand-600" /> ÖSYM Sonuç Belgesi
                  </div>
                </div>
              </div>
            </div>

            {/* Türkiye 5.si */}
            <div className="group bg-white border border-slate-200 shadow-sm p-8 rounded-[2rem] hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-200 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px] lg:translate-y-8">
              <div className="absolute -top-10 -left-10 text-[10rem] font-black text-slate-900/[0.03] group-hover:text-brand-600/15 transition-colors pointer-events-none select-none">5</div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50/50 border border-brand-100 rounded-2xl mb-8">
                  <Medal className="w-5 h-5 text-brand-600" />
                  <span className="text-brand-700 font-black tracking-tight text-lg">Türkiye 5.si</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-xl shrink-0">
                    İS
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg">İnci Merve S.</h4>
                    <p className="text-slate-500 text-sm font-medium">Türkçe ÖABT</p>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed italic relative z-10 text-lg mb-6 mt-4">
                  "Canlı dersler çok faydalıydı."
                </p>
                {/* Sonuç Belgesi Fotoğrafı */}
                <div className="w-full h-28 rounded-xl border border-slate-200 overflow-hidden relative group/doc cursor-pointer mt-auto">
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/30 shadow-sm">Belgeyi Gör</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" alt="Sınav Sonucu" className="w-full h-full object-cover opacity-70 group-hover/doc:opacity-100 group-hover/doc:scale-105 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center gap-1 shadow-sm">
                    <FileText className="w-3 h-3 text-brand-600" /> ÖSYM Sonuç Belgesi
                  </div>
                </div>
              </div>
            </div>

            {/* Türkiye 7.si */}
            <div className="group bg-white border border-slate-200 shadow-sm p-8 rounded-[2rem] hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-200 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="absolute -top-10 -left-10 text-[10rem] font-black text-slate-900/[0.03] group-hover:text-brand-600/15 transition-colors pointer-events-none select-none">7</div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50/50 border border-brand-100 rounded-2xl mb-8">
                  <Medal className="w-5 h-5 text-brand-600" />
                  <span className="text-brand-700 font-black tracking-tight text-lg">Türkiye 7.si</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-xl shrink-0">
                    YK
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg">Yasin K.</h4>
                    <p className="text-slate-500 text-sm font-medium">Türkçe ÖABT</p>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed italic relative z-10 text-lg mb-6 mt-4">
                  "Hayallerime ulaştım. Sınava hazırlanan her öğretmenime başarılar dilerim."
                </p>
                {/* Sonuç Belgesi Fotoğrafı */}
                <div className="w-full h-28 rounded-xl border border-slate-200 overflow-hidden relative group/doc cursor-pointer mt-auto">
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/30 shadow-sm">Belgeyi Gör</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" alt="Sınav Sonucu" className="w-full h-full object-cover opacity-70 group-hover/doc:opacity-100 group-hover/doc:scale-105 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center gap-1 shadow-sm">
                    <FileText className="w-3 h-3 text-brand-600" /> ÖSYM Sonuç Belgesi
                  </div>
                </div>
              </div>
            </div>

            {/* Türkiye 9.su */}
            <div className="group bg-white border border-slate-200 shadow-sm p-8 rounded-[2rem] hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-200 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px] lg:translate-y-8">
              <div className="absolute -top-10 -left-10 text-[10rem] font-black text-slate-900/[0.03] group-hover:text-brand-600/15 transition-colors pointer-events-none select-none">9</div>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50/50 border border-brand-100 rounded-2xl mb-8">
                  <Medal className="w-5 h-5 text-brand-600" />
                  <span className="text-brand-700 font-black tracking-tight text-lg">Türkiye 9.su</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-xl shrink-0">
                    FT
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg">Furkan T.</h4>
                    <p className="text-slate-500 text-sm font-medium">Türkçe ÖABT</p>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed italic relative z-10 text-lg mb-6 mt-4">
                  "Doğru kaynak, doğru sonuç."
                </p>
                {/* Sonuç Belgesi Fotoğrafı */}
                <div className="w-full h-28 rounded-xl border border-slate-200 overflow-hidden relative group/doc cursor-pointer mt-auto">
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <span className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/30 shadow-sm">Belgeyi Gör</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" alt="Sınav Sonucu" className="w-full h-full object-cover opacity-70 group-hover/doc:opacity-100 group-hover/doc:scale-105 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center gap-1 shadow-sm">
                    <FileText className="w-3 h-3 text-brand-600" /> ÖSYM Sonuç Belgesi
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
