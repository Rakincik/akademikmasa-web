"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { Save, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function ProfileForm({ 
  user 
}: { 
  user: { name: string, email: string, phone: string, tc: string, address: string } 
}) {
  const router = useRouter();
  const nameParts = user.name.split(" ");
  const initialLastName = nameParts.length > 1 ? nameParts.pop() || "" : "";
  const initialFirstName = nameParts.join(" ") || user.name;

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [tc, setTc] = useState(user.tc || "");
  const [phone, setPhone] = useState(formatPhone(user.phone || ""));
  const [address, setAddress] = useState(user.address || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const res = await updateProfile({
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      tc: tc.trim(),
      phone,
      address: address.trim(),
      password: password.trim() !== "" ? password : undefined
    });

    if (!res.success) {
      setError(res.error || "Güncelleme sırasında bir hata oluştu.");
    } else {
      setSuccess(true);
      setPassword(""); // Clear password field on success
      router.refresh();
      
      // 3 saniye sonra başarı mesajını gizle
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Bilgileriniz başarıyla güncellendi.
        </div>
      )}

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
        
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresi</label>
          <input 
            id="email" 
            type="email" 
            value={user.email}
            disabled
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" 
          />
          <p className="text-xs text-slate-400 mt-1 font-medium">E-posta adresi değiştirilemez.</p>
        </div>

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

        <div>
          <label htmlFor="tc" className="block text-sm font-bold text-slate-700 mb-2">TC Kimlik No (Fatura bilgisi için)</label>
          <input 
            id="tc" 
            type="text" 
            maxLength={11}
            value={tc}
            onChange={(e) => setTc(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
            placeholder="11 haneli TC kimlik numaranız"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre (İsteğe Bağlı)</label>
          <input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400" 
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2">
            Açık Adres (Eğitim kitapçıkları gönderimleri için)
          </label>
          <textarea 
            id="address" 
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400 resize-none text-sm" 
            placeholder="Kitap ve basılı materyal gönderimi için açık adresinizi detaylı olarak yazın."
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          disabled={loading}
          type="submit" 
          className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-brand-600/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Kaydediliyor..." : (
            <>
              <Save className="w-5 h-5" />
              Değişiklikleri Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
}
