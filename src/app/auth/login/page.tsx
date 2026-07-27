"use client";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (res?.error) {
      setError("Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.");
      setLoading(false);
    } else {
      // Eğer giren kişi adminse /admin tarafına, öğrenciyse /panel tarafına gönder
      if (email === "admin@akademikmasa.com") {
        router.push("/admin");
      } else {
        router.push("/panel");
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* İnce, Kurumsal Izgara (Grid) Arka Plan Deseni */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="w-full max-w-[450px] relative z-10">
        
        {/* Devasa ve Ortalanmış Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/">
            <img src="/logo-transparent.png" alt="Akademik Masa" className="h-20 w-auto mb-8 drop-shadow-sm hover:scale-105 transition-transform duration-500" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            Hoş Geldiniz
          </h2>
          <p className="mt-3 text-center text-slate-500 font-medium text-base">
            Eğitimlerinize kaldığınız yerden devam edin. Hesabınız yok mu?{' '}
            <Link href="/auth/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors">
              Hesap Oluşturun
            </Link>
          </p>
        </div>

        {/* Kurumsal Form Kartı */}
        <div className="bg-white py-10 px-8 sm:px-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* E-Posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresi</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="adiniz@email.com"
              />
            </div>

            {/* Şifre */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">Şifre</label>
                <Link href="#" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Şifrenizi girin"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Beni Hatırla */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center shrink-0">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" />
                </div>
                <span className="text-sm font-medium text-slate-600 leading-snug">
                  Beni Hatırla
                </span>
              </label>
            </div>

            {/* Giriş Butonu */}
            <div className="pt-4">
              <button disabled={loading} type="submit" className="w-full bg-slate-900 hover:bg-brand-600 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            {/* Güvenlik Bilgisi */}
            <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 font-medium mt-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Güvenli Giriş Paneli</span>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
