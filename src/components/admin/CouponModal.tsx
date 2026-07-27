"use client";
import { useState, useEffect } from "react";
import { X, Tag, Percent, DollarSign, Loader2 } from "lucide-react";
import { saveCoupon } from "@/app/admin/kuponlar/actions";

export default function CouponModal({ isOpen, onClose, initialData, isInfluencerMode = false }: { isOpen: boolean, onClose: () => void, initialData?: any, isInfluencerMode?: boolean }) {
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    discountType: "FIXED",
    discountValue: "",
    isActive: true,
    isInfluencer: isInfluencerMode,
    influencerName: "",
    influencerEmail: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      if (initialData) {
        setFormData({
          id: initialData.id,
          code: initialData.code,
          discountType: initialData.discountType,
          discountValue: initialData.discountValue.toString(),
          isActive: initialData.isActive,
          isInfluencer: initialData.isInfluencer || false,
          influencerName: initialData.influencerName || "",
          influencerEmail: initialData.influencerEmail || "",
          startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "",
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "",
          usageLimit: initialData.usageLimit ? initialData.usageLimit.toString() : "",
        });
      } else {
        setFormData({
          id: "",
          code: "",
          discountType: "FIXED",
          discountValue: "",
          isActive: true,
          isInfluencer: isInfluencerMode,
          influencerName: "",
          influencerEmail: "",
          startDate: "",
          endDate: "",
          usageLimit: "",
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (!formData.code || !formData.discountValue) {
        throw new Error("Lütfen zorunlu alanları doldurun.");
      }

      await saveCoupon({
        ...formData,
        discountValue: parseFloat(formData.discountValue),
      });

      onClose();
    } catch (error: any) {
      setErrorMsg(error.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? 'Kuponu Düzenle' : 'Yeni Kupon Ekle'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Code */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kupon Kodu</label>
            <input 
              type="text" 
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              placeholder="Örn: YAZ100"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all uppercase"
              required
            />
          </div>

          {/* Type */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, discountType: "FIXED"})}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.discountType === "FIXED" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
            >
              <DollarSign className="w-6 h-6" />
              <span className="font-bold text-sm">Sabit İndirim</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, discountType: "PERCENTAGE"})}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.discountType === "PERCENTAGE" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
            >
              <Percent className="w-6 h-6" />
              <span className="font-bold text-sm">Yüzdelik İndirim</span>
            </button>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">İndirim Miktarı {formData.discountType === "PERCENTAGE" ? "(%)" : "(₺)"}</label>
            <input 
              type="number" 
              value={formData.discountValue}
              onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
              placeholder={formData.discountType === "PERCENTAGE" ? "Örn: 15" : "Örn: 250"}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Kupon Durumu</p>
              <p className="text-xs text-slate-500">Müşteriler bu kuponu kullanabilsin mi?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Constraints */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Başlangıç Tarihi</label>
              <input 
                type="datetime-local" 
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bitiş Tarihi</label>
              <input 
                type="datetime-local" 
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Kullanım Sınırı (Adet)</label>
              <input 
                type="number" 
                value={formData.usageLimit}
                onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                placeholder="Örn: 100 (Boş bırakırsanız sınırsız olur)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Influencer Toggle (Only show if not strictly influencer mode) */}
          {!isInfluencerMode && (
            <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl border border-brand-100">
              <div>
                <p className="font-bold text-brand-900">Influencer Kuponu mu?</p>
                <p className="text-xs text-brand-700">Kuponu özel bir iş ortağına atayın.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.isInfluencer}
                  onChange={(e) => setFormData({...formData, isInfluencer: e.target.checked})}
                />
                <div className="w-11 h-6 bg-brand-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          )}

          {/* Influencer Details */}
          {formData.isInfluencer && (
            <div className="space-y-4 p-4 border border-brand-100 rounded-xl bg-white">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">İş Ortağı / Influencer Adı</label>
                <input 
                  type="text" 
                  value={formData.influencerName}
                  onChange={(e) => setFormData({...formData, influencerName: e.target.value})}
                  placeholder="Örn: Ayşe Yılmaz"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                  required={formData.isInfluencer}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresi (İsteğe Bağlı)</label>
                <input 
                  type="email" 
                  value={formData.influencerEmail}
                  onChange={(e) => setFormData({...formData, influencerEmail: e.target.value})}
                  placeholder="Örn: ayse@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                />
              </div>
            </div>
          )}


          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? 'Değişiklikleri Kaydet' : 'Kuponu Oluştur'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
