import { Target, Lightbulb, ShieldCheck, Users, Award, BookOpen, GraduationCap, ChevronRight, MonitorPlay, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Aktif Öğrenci", value: "10.000+" },
    { label: "Video İçerik", value: "5.000+ Saat" },
    { label: "Uzman Eğitmen", value: "45+" },
    { label: "Öğrenci Memnuniyeti", value: "%98" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-left"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-xs mb-6 border border-brand-500/30">
              Biz Kimiz?
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Sınavlara Hazırlıkta <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400">
                Dijital Dönüşüm
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Akademik Masa olarak, eğitimde kaliteyi ve teknolojiyi bir araya getiriyor, Türkiye'nin dört bir yanındaki binlerce adayı hedeflerine ulaştırıyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/20 border border-slate-100 text-center transform transition-transform hover:-translate-y-2 duration-300">
              <h3 className="text-4xl font-extrabold text-brand-600 mb-2">{stat.value}</h3>
              <p className="text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story & Mission Section */}
      <div className="container mx-auto px-4 mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-100 to-amber-50 rounded-[3rem] -z-10 transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Akademik Masa Ekip" 
              className="rounded-[2.5rem] shadow-2xl object-cover aspect-square"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">En İyi Platform</p>
                  <p className="text-sm text-slate-500">2026 Eğitim Ödülü</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Hikayemiz</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Geleneksel dershane anlayışının kalıplarını kırmak ve kaliteli eğitimi Türkiye'nin en ücra köşesindeki adaya bile aynı standartta ulaştırmak amacıyla yola çıktık. Akademik Masa, sadece bir video izleme platformu değil; öğrenciyi merkezine alan, interaktif ve yaşayan bir ekosistemdir.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Misyonumuz</h4>
                  <p className="text-slate-600 leading-relaxed">Öğrencilerimize en güncel sınav müfredatını, alanının en iyisi eğitimcilerle, zaman ve mekandan bağımsız olarak sunmak.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Vizyonumuz</h4>
                  <p className="text-slate-600 leading-relaxed">Uzaktan eğitim teknolojilerinde yapay zeka ve veri analizini en efektif kullanan, sektörün yön belirleyici lider markası olmak.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Neden Akademik Masa?</h2>
            <p className="text-slate-400 text-lg">Rakiplerimizden bizi ayıran ve öğrencilerin bizi tercih etmesini sağlayan temel değerlerimiz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-4">Şampiyonların Kadrosu</h4>
              <p className="text-slate-400 leading-relaxed">Yalnızca kendi alanında marka olmuş, on binlerce öğrenciyi dereceye taşımış duayen hocalarla çalışıyoruz.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full"></div>
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <MonitorPlay className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-4 relative z-10">Akıllı Altyapı</h4>
              <p className="text-slate-400 leading-relaxed relative z-10">Kesintisiz 4K canlı dersler, anında tekrar izleme fırsatı ve size özel ilerleme analizleriyle zamanınızı verimli kullanın.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-4">Rehberlik ve Takip</h4>
              <p className="text-slate-400 leading-relaxed">Sizi asla videoyla baş başa bırakmıyoruz. WhatsApp grupları ve birebir koçluk ile motivasyonunuzu hep diri tutuyoruz.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Başarıya Giden Yolda İlk Adımı Atın</h2>
          <p className="text-lg text-brand-100 mb-10 max-w-2xl mx-auto relative z-10">
            Hayallerinizdeki kariyere ulaşmak için daha fazla beklemeyin. Size en uygun eğitim paketini seçin ve hemen çalışmaya başlayın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/kurslar" className="bg-white text-brand-600 font-bold py-4 px-8 rounded-full hover:bg-slate-50 transition-transform hover:scale-105 flex items-center justify-center gap-2">
              Eğitimleri İncele <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/iletisim" className="bg-brand-500/20 text-white font-bold py-4 px-8 rounded-full border border-white/30 hover:bg-brand-500/40 transition-colors flex items-center justify-center">
              Rehberlik Al
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
