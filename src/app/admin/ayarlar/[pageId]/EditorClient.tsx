"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Save, History, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { saveSiteContent } from "../actions";
import { useRouter } from "next/navigation";

interface EditorClientProps {
  pageId: string;
  initialTitle: string;
  initialData: any;
}

export default function EditorClient({ pageId, initialTitle, initialData }: EditorClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  // Sayfaya Göre Bölümler (Configs)
  const pageConfigs: Record<string, any[]> = {
    home: [
      { id: "hero", title: "Hero Bölümü", fields: "9/9 alan" },
      { id: "features", title: "Kurumsal Özellikler", fields: "3/3 alan" },
      { id: "stats", title: "İstatistikler", fields: "3/3 alan" }
    ],
    about: [
      { id: "hero", title: "Hakkımızda Hero", fields: "4/4 alan" },
      { id: "misyon", title: "Misyon", fields: "2/2 alan" },
      { id: "vizyon", title: "Vizyon", fields: "2/2 alan" }
    ],
    contact: [
      { id: "hero", title: "İletişim Bilgileri", fields: "5/5 alan" },
      { id: "map", title: "Harita Ayarları", fields: "1/1 alan" }
    ],
    instructors: [
      { id: "hero", title: "Kadromuz Hero", fields: "3/3 alan" }
    ],
    courses: [
      { id: "hero", title: "Kurslar Hero", fields: "3/3 alan" }
    ]
  };

  const sections = pageConfigs[pageId] || [{ id: "hero", title: "Genel Ayarlar", fields: "0/0 alan" }];

  // Akademik Masa Gerçek Varsayılan Verileri
  const defaultData: Record<string, any> = {
    home: {
      hero: {
        badge: "2027 Erken Kayıt Fırsatları Başladı",
        title1: "Geleceğinize",
        title2: "Akademik Masa",
        title3: "ile Hazırlanın.",
        description: "Uzman kadromuzla KPSS, ÖABT ve tüm akademik sınavlarda hedeflerinize en hızlı şekilde ulaşın. Hemen kaydolun, rakiplerinizin bir adım önüne geçin.",
        stats: [
          { value: "5.000+", label: "Mutlu Derece Öğrencisi" },
          { value: "%98.4", label: "Başarı Oranı" }
        ]
      }
    }
  };

  const [formData, setFormData] = useState<any>(initialData || defaultData[pageId] || { hero: {} });

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveSiteContent(pageId, initialTitle, formData);
    setIsSaving(false);
    
    if (result.success) {
      showToast("Başarıyla kaydedildi!", "success");
    } else {
      showToast(result.error || "Bir hata oluştu.", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleFieldChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...(formData.hero?.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, stats: newStats }
    }));
  };

  const addStat = () => {
    setFormData((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, stats: [...(prev.hero?.stats || []), { value: "", label: "" }] }
    }));
  };

  const removeStat = (index: number) => {
    const newStats = [...(formData.hero?.stats || [])];
    newStats.splice(index, 1);
    setFormData((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, stats: newStats }
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Özel Toast Bildirimi */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === "success" ? "bg-white border-emerald-100 text-slate-800" : "bg-white border-red-100 text-slate-800"}`}>
          {toast.type === "success" ? (
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <Trash2 className="w-6 h-6" /> {/* Trash2 is just an error placeholder, ideally XCircle */}
            </div>
          )}
          <div>
            <p className="font-bold">{toast.type === "success" ? "İşlem Başarılı" : "Hata Oluştu"}</p>
            <p className="text-sm text-slate-500 font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Sol Menü: Bölümler */}
      <div className="w-full lg:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <Link href="/admin/ayarlar" className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium mb-3">
              <ArrowLeft className="w-4 h-4" /> Geri Dön
            </Link>
            <h2 className="text-xl font-bold text-slate-900">{initialTitle}</h2>
            <p className="text-xs text-slate-500 mt-1">Sayfa İçerik Editörü</p>
          </div>
          <button className="text-slate-400 hover:text-brand-600 p-2 rounded-lg hover:bg-brand-50 transition-colors">
            <History className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sections.map(section => (
            <button 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${activeSection === section.id ? 'bg-white shadow-sm border border-brand-200 text-brand-700' : 'hover:bg-slate-100 text-slate-600 border border-transparent'}`}
            >
              <div>
                <div className="font-bold">{section.title}</div>
                <div className={`text-xs mt-0.5 ${activeSection === section.id ? 'text-brand-500' : 'text-slate-400'}`}>{section.fields}</div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${activeSection === section.id ? 'text-brand-500' : 'text-emerald-500'}`} />
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">Tamamlanma</span>
            <span className="text-sm font-bold text-emerald-600">%100</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full w-full mb-6 overflow-hidden">
            <div className="h-full bg-emerald-500 w-full rounded-full"></div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-500/25 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-pulse">Kaydediliyor...</span>
            ) : (
              <>
                <Save className="w-5 h-5" /> Kaydet
              </>
            )}
          </button>
          <p className="text-xs text-center text-amber-600 font-medium mt-3">• Kaydedilmemiş değişiklik var</p>
        </div>
      </div>

      {/* Orta Alan: Editör Formu */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-brand-500">✨</span> {sections.find(s => s.id === activeSection)?.title}
            </h3>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
              Düzenleniyor
            </span>
          </div>

          {/* Dinamik Form Alanları */}
          {activeSection === "hero" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Üst Rozet Yazısı (Pulse Efektli)</label>
                <input 
                  type="text" 
                  value={formData.hero?.badge || ""}
                  onChange={(e) => handleFieldChange("hero", "badge", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="Örn: 2027 Erken Kayıt Fırsatları Başladı"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Başlık Satır 1</label>
                  <input 
                    type="text" 
                    value={formData.hero?.title1 || ""}
                    onChange={(e) => handleFieldChange("hero", "title1", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-brand-500 transition-all"
                    placeholder="Geleceğinize"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Başlık Satır 2 (Renkli)</label>
                  <input 
                    type="text" 
                    value={formData.hero?.title2 || ""}
                    onChange={(e) => handleFieldChange("hero", "title2", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-brand-600 font-bold focus:outline-none focus:border-brand-500 transition-all"
                    placeholder="Akademik Masa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Başlık Satır 3</label>
                  <input 
                    type="text" 
                    value={formData.hero?.title3 || ""}
                    onChange={(e) => handleFieldChange("hero", "title3", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-brand-500 transition-all"
                    placeholder="ile Hazırlanın."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Açıklama</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                  {/* Fake Toolbar */}
                  <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2 overflow-x-auto">
                    <select className="bg-white border border-slate-200 rounded text-sm font-medium px-2 py-1 text-slate-600 outline-none">
                      <option>Normal Metin</option>
                      <option>Başlık 1</option>
                    </select>
                    <div className="w-px h-5 bg-slate-300 mx-1"></div>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-700 font-bold">B</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-700 italic">I</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-700 underline">U</button>
                  </div>
                  <textarea 
                    value={formData.hero?.description || ""}
                    onChange={(e) => handleFieldChange("hero", "description", e.target.value)}
                    className="w-full h-32 bg-white px-4 py-3 text-slate-700 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Kurumsal İstatistikler (Alt Bölüm)</label>
                <div className="space-y-3">
                  {(formData.hero?.stats || []).map((stat: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2 shadow-sm group">
                      <div className="text-slate-300 cursor-move p-2 hover:text-slate-500">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Değer (Örn: %98.4)"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, "value", e.target.value)}
                        className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center font-bold text-slate-900 outline-none focus:border-brand-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Açıklama (Örn: Başarı Oranı)"
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, "label", e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 outline-none focus:border-brand-500"
                      />
                      <button 
                        onClick={() => removeStat(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addStat}
                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:border-brand-300 hover:text-brand-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Yeni İstatistik Ekle
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 flex flex-col items-center">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-lg text-slate-700 mb-2">Bu bölüm henüz yapılandırılmadı.</p>
              <p className="text-sm">Diğer bölümlerin alanları sisteme eklendiğinde buradan düzenlenebilecek.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
