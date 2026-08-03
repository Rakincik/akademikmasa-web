"use client";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser } from "./actions";
import { KULLANICI_SOZLESMESI, GIZLILIK_SOZLESMESI } from "./agreements";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tc, setTc] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeAgreement, setActiveAgreement] = useState<'user' | 'privacy' | null>(null);
  const [hasReadUser, setHasReadUser] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);

  const isValidTC = (value: string) => {
    if (!/^[1-9]\d{10}$/.test(value)) return false;
    const digits = value.split("").map(Number);
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const digit10 = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
    if (digit10 !== digits[9]) return false;
    const totalSum = digits.slice(0, 10).reduce((acc, curr) => acc + curr, 0);
    if (totalSum % 10 !== digits[10]) return false;
    return true;
  };

  const formatPhone = (val: string) => {
    let clean = val.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = clean.substring(1);
    }
    clean = clean.slice(0, 10);
    if (clean.length > 8) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
    } else if (clean.length > 6) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 8)}`;
    } else if (clean.length > 3) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)}`;
    }
    return clean;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Lütfen Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı onaylayın.");
      return;
    }

    if (!tc) {
      setError("Lütfen T.C. Kimlik Numaranızı giriniz.");
      return;
    }

    if (!isValidTC(tc)) {
      setError("Geçersiz T.C. Kimlik Numarası girdiniz.");
      return;
    }

    if (!address || address.trim().length < 10) {
      setError("Lütfen açık adresinizi tam ve eksiksiz olarak giriniz (en az 10 karakter).");
      return;
    }

    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    const res = await registerUser({
      firstName,
      lastName,
      email,
      phone,
      tc,
      address,
      password,
    });

    if (!res.success) {
      setError(res.error || "Kayıt olurken bir hata oluştu.");
      setLoading(false);
      return;
    }

    // Başarılı kayıt sonrası otomatik giriş yap
    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginRes?.error) {
      setError("Kayıt başarılı ancak giriş yapılamadı. Lütfen giriş yap sayfasını kullanın.");
      setLoading(false);
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || "/panel");
      router.refresh();
    }
  };

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
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            {/* Ad & Soyad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">Ad</label>
                <input 
                  id="firstName" 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Adınız"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">Soyad</label>
                <input 
                  id="lastName" 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="w-full pl-16 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="5XX XXX XX XX"
                />
              </div>
            </div>

            {/* T.C. Kimlik Numarası */}
            <div>
              <label htmlFor="tc" className="block text-sm font-bold text-slate-700 mb-2">T.C. Kimlik Numarası</label>
              <input 
                id="tc" 
                type="text" 
                maxLength={11}
                value={tc}
                onChange={(e) => setTc(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="11 Haneli T.C. Kimlik Numaranız"
              />
            </div>

            {/* Açık Adres */}
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2">Açık Adres</label>
              
              {/* Adres Uyarısı - Dikkat Çekici */}
              <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2.5 shadow-sm">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <strong className="text-amber-900 block mb-0.5">Kargo/Kitap Gönderim Bilgisi</strong>
                  Adresinize basılı kaynak ve kitap gönderimi yapılacaktır. Lütfen mahalle, cadde, sokak, dış kapı/daire no, il ve ilçe bilgilerini eksiksiz, genel ve açık bir şekilde yazınız.
                </div>
              </div>

              <textarea 
                id="address" 
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400 resize-none font-medium" 
                placeholder="Örn: Hürriyet Mah. Vatan Cad. No: 12 Daire: 4 Kadıköy / İstanbul"
              />
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">Şifre</label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => {
                      const canAgree = hasReadUser && hasReadPrivacy;
                      if (!canAgree) {
                        setError("Lütfen önce Kullanıcı Sözleşmesi'ni ve Gizlilik Politikası'nı tıklayarak okuyunuz.");
                        return;
                      }
                      setError("");
                      setAgreed(e.target.checked);
                    }}
                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" 
                  />
                </div>
                <span className="text-sm font-medium text-slate-500 leading-snug">
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); setActiveAgreement('user'); setHasReadUser(true); }}
                    className={`font-bold hover:underline transition-colors cursor-pointer ${hasReadUser ? "text-emerald-600 hover:text-emerald-700" : "text-slate-900 hover:text-brand-600"}`}
                  >
                    Kullanıcı Sözleşmesi {hasReadUser && "✓"}
                  </button>'ni ve <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); setActiveAgreement('privacy'); setHasReadPrivacy(true); }}
                    className={`font-bold hover:underline transition-colors cursor-pointer ${hasReadPrivacy ? "text-emerald-600 hover:text-emerald-700" : "text-slate-900 hover:text-brand-600"}`}
                  >
                    Gizlilik Politikası {hasReadPrivacy && "✓"}
                  </button>'nı okudum, onaylıyorum.
                  {!(hasReadUser && hasReadPrivacy) && (
                    <span className="block text-xs text-amber-600 font-semibold mt-1">
                      * İşaretlemeden önce lütfen sözleşmeleri açıp okuyunuz.
                    </span>
                  )}
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
              <button disabled={loading} type="submit" className="w-full bg-slate-900 hover:bg-brand-600 text-white py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Hesabınız Oluşturuluyor..." : "Hesabımı Oluştur"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>

            {/* Güvenlik Bilgisi */}
            <p className="text-center text-xs text-slate-400 font-medium mt-6">
              Bilgileriniz 256-bit SSL sertifikası ile şifrelenerek korunmaktadır.
            </p>

          </form>
        </div>

      </div>

      {activeAgreement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">
                {activeAgreement === 'user' ? 'Kullanıcı Sözleşmesi ve Kullanım Koşulları' : 'Gizlilik Politikası ve Aydınlatma Metni'}
              </h3>
              <button 
                onClick={() => setActiveAgreement(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                {activeAgreement === 'user' ? KULLANICI_SOZLESMESI : GIZLILIK_SOZLESMESI}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setActiveAgreement(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer text-sm"
              >
                Okudum, Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
