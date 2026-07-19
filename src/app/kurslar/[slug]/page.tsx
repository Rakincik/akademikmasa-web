import { ArrowRight, CheckCircle2, Clock, FileText, MonitorPlay, ShieldCheck, Star, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "./AddToCartButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const course = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      instructors: true,
      category: true
    }
  });

  if (!course) {
    return notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Top Breadcrumb & MİND-BLOWING Hero Area */}
      <div className="bg-slate-900 text-white pt-12 pb-40 relative overflow-hidden">
        
        {/* Animated Glowing Orbs Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Subtle Image Reflection */}
        <div 
          className="absolute inset-0 opacity-10 blur-3xl scale-125" 
          style={{ backgroundImage: `url(${course.imageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-bold tracking-wide">
            <Link href="/" className="hover:text-brand-400 transition-colors">ANA SAYFA</Link>
            <span className="opacity-50">/</span>
            <Link href="/kurslar" className="hover:text-brand-400 transition-colors">EĞİTİM PAKETLERİ</Link>
            <span className="opacity-50">/</span>
            <span className="text-brand-500">{course.category?.name || "KATEGORİSİZ"}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Sol Taraf: Metinler */}
            <div className="relative z-20">
              {course.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 font-bold text-xs mb-6 border border-brand-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(191,29,48,0.3)]">
                  <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-ping"></span>
                  <span className="absolute flex h-2 w-2 rounded-full bg-brand-400"></span>
                  {course.badge}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] text-white drop-shadow-2xl tracking-tight">
                {course.title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl font-medium">
                {course.description}
              </p>

              {/* Eğitmen Kartı (Çoklu Eğitmen Desteği & Kadromuz Linki) */}
              <Link href="/kadromuz" className="flex items-center gap-4 mb-10 bg-white/5 border border-white/10 hover:border-brand-500/50 hover:bg-white/10 transition-all duration-300 rounded-[2rem] p-3 pr-8 w-fit backdrop-blur-xl shadow-xl group cursor-pointer block">
                <div className="flex -space-x-4">
                  {course.instructors.map((inst, idx) => (
                    <img 
                      key={idx}
                      src={inst.imageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(inst.name)} 
                      alt={inst.name} 
                      className="w-14 h-14 rounded-full border-2 border-slate-900 shadow-[0_0_15px_rgba(191,29,48,0.5)] group-hover:border-brand-500 group-hover:scale-110 transition-all duration-300 object-cover relative" 
                      style={{ zIndex: course.instructors.length - idx }}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[0.65rem] text-brand-300 font-black uppercase tracking-widest mb-0.5">
                    {course.instructors.length > 1 ? "KURS EĞİTMENLERİ" : "KURS EĞİTMENİ"}
                  </p>
                  <p className="text-base text-white font-bold">
                    {course.instructors.map(i => i.name).join(", ")}
                  </p>
                </div>
              </Link>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 mt-12 text-slate-300 font-medium text-sm">
                {course.studentCount && (
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md">
                    <Users className="w-5 h-5 text-brand-400" /> {course.studentCount} Öğrenci
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> {course.rating} ({course.reviewCount || 0} Değerlendirme)
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md">
                  <MonitorPlay className="w-5 h-5 text-sky-400" /> %100 Online
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Çıldırmış Görsel Alanı (Pop-out & Glow) */}
            <div className="relative group perspective-1000 mt-12 lg:mt-0 z-10 w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
              {/* Devasa Arkadan Vuran Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600 via-amber-500 to-brand-500 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-70 transition duration-700 group-hover:duration-300 animate-gradient-x"></div>
              
              {/* Resim Container - Yukarı kalkar ve büyür */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-amber-500 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full object-cover rounded-[2.5rem] border-8 border-slate-800 shadow-2xl relative z-10" 
                    style={{ aspectRatio: '3/4' }}
                  />
                ) : (
                  <div 
                    className="w-full rounded-[2.5rem] border-8 border-slate-800 shadow-2xl relative z-10 flex items-center justify-center bg-slate-800 text-slate-500 font-bold"
                    style={{ aspectRatio: '3/4' }}
                  >
                    Görsel Bulunmuyor
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column (Content) */}
          <div className="w-full lg:w-2/3 bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-white">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <span className="w-2 h-8 bg-brand-500 rounded-full"></span> Eğitim Hakkında
            </h2>
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 mb-16 whitespace-pre-line leading-relaxed font-medium">
              {course.longDescription}
            </div>

            {/* Neler Kazanacaksınız? */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" />
                Bu Eğitimde Neler Kazanacaksınız?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {course.features && course.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 border border-slate-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/40 transition-colors duration-500"></div>
              <div className="w-20 h-20 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-2xl text-white transform group-hover:rotate-12 transition-transform duration-500">
                <MonitorPlay className="w-10 h-10" />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h4 className="text-2xl font-black text-white mb-3">Hemen Başlamak İster misiniz?</h4>
                <p className="text-slate-300 text-base font-medium">Satın aldığınız an panelinize erişim açılır ve geçmiş ders kayıtlarını bilgisayar, tablet veya telefonunuzdan anında izlemeye başlayabilirsiniz.</p>
              </div>
            </div>
          </div>

          {/* Right Column (ULTRA PREMIUM Sticky Checkout Box) */}
          <div className="w-full lg:w-1/3 sticky top-28">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-500/30 to-amber-500/20 rounded-[3rem] blur-xl transition duration-500 group-hover:opacity-100 opacity-50"></div>
              
              <div className="relative bg-white/90 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[3rem] p-10 border-2 border-white transform transition-transform duration-500 hover:-translate-y-2">
                
                {course.priceBadge && (
                  <div className="bg-emerald-50 text-emerald-700 text-sm font-bold px-4 py-2 rounded-xl mb-6 inline-flex items-center gap-2 border border-emerald-100">
                    <Clock className="w-4 h-4" /> {course.priceBadge}
                  </div>
                )}
                
                <div className="flex flex-col mb-8">
                  {course.salePrice ? (
                    <>
                      <span className="text-slate-400 line-through font-semibold text-lg mb-1">₺{course.price.toLocaleString('tr-TR')}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tight">₺{course.salePrice.toLocaleString('tr-TR')}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-6xl font-black text-slate-900 tracking-tight">₺{course.price.toLocaleString('tr-TR')}</span>
                  )}
                </div>

                <div className="space-y-5 mb-10 text-sm font-bold text-slate-600 px-2">
                  {course.pricingFeatures && course.pricingFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="bg-brand-50 p-2 rounded-xl text-brand-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <AddToCartButton product={course} />
                
                <p className="text-center text-xs text-slate-400 font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> 256-Bit SSL Şifreleme ile %100 Güvenli Ödeme
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
