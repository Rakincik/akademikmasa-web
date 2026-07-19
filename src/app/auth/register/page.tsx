"use client";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* İnce, Kurumsal Izgara (Grid) Arka Plan Deseni */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="w-full max-w-[500px] relative z-10">
        
        {/* Devasa ve Ortalanmış Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/">
            <img src="/logo-transparent.png" alt="Akademik Masa" className="h-20 w-auto mb-8 drop-shadow-sm hover:scale-105 transition-transform duration-500" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            Hesap Oluşturun
          </h2>
          <p className="mt-3 text-center text-slate-500 font-medium text-base">
            Akademik Masa eğitimlerine erişmek için hemen kaydolun. Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors">
              Giriş Yapın
            </Link>
          </p>
        </div>

        {/* Kurumsal Form Kartı */}
        <div className="bg-white py-10 px-8 sm:px-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-slate-100">
          <form className="space-y-6">
            
            {/* Ad & Soyad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">Ad</label>
                <input 
                  id="firstName" 
                  type="text" 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Adınız"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">Soyad</label>
                <input 
                  id="lastName" 
                  type="text" 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            {/* E-Posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresi</label>
              <input 
                id="email" 
                type="email" 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="ornek@kurum.com"
              />
            </div>

            {/* Telefon Numarası */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Telefon Numarası</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-bold border-r border-slate-200 pr-3">+90</span>
                <input 
                  id="phone" 
                  type="tel" 
                  className="w-full pl-16 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="5XX XXX XX XX"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">Şifre</label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="En az 6 karakter"
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

            {/* Sözleşmeler */}
            <div className="pt-2 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center mt-1 shrink-0">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" />
                </div>
                <span className="text-sm font-medium text-slate-500 leading-snug">
                  <Link href="#" className="text-slate-900 font-bold hover:underline hover:text-brand-600 transition-colors">Kullanıcı Sözleşmesi</Link>'ni ve <Link href="#" className="text-slate-900 font-bold hover:underline hover:text-brand-600 transition-colors">Gizlilik Politikası</Link>'nı okudum, onaylıyorum.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center mt-1 shrink-0">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" />
                </div>
                <span className="text-sm font-medium text-slate-500 leading-snug">
                  Kampanyalar hakkında bilgilendirme e-postaları almak istiyorum.
                </span>
              </label>
            </div>

            {/* Kayıt Butonu */}
            <div className="pt-4">
              <button type="button" className="w-full bg-slate-900 hover:bg-brand-600 text-white py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group shadow-sm">
                Hesabımı Oluştur
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Güvenlik Bilgisi */}
            <p className="text-center text-xs text-slate-400 font-medium mt-6">
              Bilgileriniz 256-bit SSL sertifikası ile şifrelenerek korunmaktadır.
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}
