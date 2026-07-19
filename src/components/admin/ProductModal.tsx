"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Upload, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Crop } from "lucide-react";
import { saveProduct } from "@/app/admin/kurslar/actions";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

interface Instructor {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructors: Instructor[];
  categories: Category[];
  initialData?: any;
}

export default function ProductModal({ isOpen, onClose, instructors, categories, initialData }: ProductModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    price: "",
    salePrice: "",
    badge: "",
    priceBadge: "",
    rating: "5.0",
    reviewCount: "0",
    studentCount: "",
    categoryId: "",
    isPublished: true,
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [pricingFeatures, setPricingFeatures] = useState<string[]>([]);
  const [instructorIds, setInstructorIds] = useState<string[]>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Initialize data if editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          longDescription: initialData.longDescription || "",
          price: initialData.price.toString(),
          salePrice: initialData.salePrice ? initialData.salePrice.toString() : "",
          badge: initialData.badge || "",
          priceBadge: initialData.priceBadge || "",
          rating: initialData.rating?.toString() || "5.0",
          reviewCount: initialData.reviewCount?.toString() || "0",
          studentCount: initialData.studentCount || "",
          categoryId: initialData.categoryId || "",
          isPublished: initialData.isPublished,
        });
        setFeatures(initialData.features || []);
        setPricingFeatures(initialData.pricingFeatures || []);
        setInstructorIds(initialData.instructors?.map((i: any) => i.id) || []);
        setPreview(initialData.imageUrl || null);
      } else {
        // Reset
        setFormData({
          id: "", title: "", slug: "", description: "", longDescription: "", price: "", salePrice: "",
          badge: "", priceBadge: "", rating: "5.0", reviewCount: "0", studentCount: "", categoryId: "", isPublished: true,
        });
        setFeatures([]);
        setPricingFeatures([]);
        setInstructorIds([]);
        setFile(null);
        setPreview(null);
      }
      setStep(1);
    }
  }, [isOpen, initialData]);

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    // Eğer düzenleme modundaysa veya kullanıcı slug'ı kendisi elle girmişse otomatik değiştirme
    if (!initialData) {
      setFormData({ ...formData, title: newTitle, slug: generateSlug(newTitle) });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setPreview(URL.createObjectURL(droppedFile));
      setIsCropping(true);
    }
  };

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (!preview || !croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(preview, croppedAreaPixels);
      setFile(croppedFile);
      setPreview(URL.createObjectURL(croppedFile));
      setIsCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleArrayAdd = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (val.trim()) {
      setter(prev => [...prev, val.trim()]);
    }
  };

  const handleArrayRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) => {
    setter(prev => prev.filter((_, i) => i !== idx));
  };

  const handleInstructorToggle = (id: string) => {
    setInstructorIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    let imageUrl = preview; // Keep existing image if no new file

    try {
      if (file) {
        const fileData = new FormData();
        fileData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.url;
        }
      }

      await saveProduct({
        ...formData,
        imageUrl,
        features,
        pricingFeatures,
        instructorIds
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}</h2>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 w-12 rounded-full ${step >= s ? 'bg-brand-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-slate-900">Temel Bilgiler</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Eğitim Adı</label>
                  <input type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="2027 Türkçe ÖABT Canlı Ders Paketi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" placeholder="turkce-oabt-canli-ders" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none">
                  <option value="">Kategori Seçiniz</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kısa Açıklama</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="Hero alanında görünecek kısa açıklama..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Detaylı Açıklama (Eğitim Hakkında)</label>
                <textarea rows={4} value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="Eğitim detay sayfasındaki uzun metin..." />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Kapak Görseli</label>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Önerilen Boyut: 3:4 (Dikey, Örn: 1080x1440px)</span>
              </div>
                {!preview ? (
                  <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 cursor-pointer relative hover:border-brand-500 hover:text-brand-600">
                    <input type="file" accept="image/*" onChange={e => { if(e.target.files?.[0]) { setPreview(URL.createObjectURL(e.target.files[0])); setIsCropping(true); } }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Sürükle bırak veya seç</span>
                  </div>
                ) : isCropping ? (
                  <div className="space-y-3">
                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-slate-900">
                      <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <input 
                        type="range" 
                        value={zoom} 
                        min={1} 
                        max={3} 
                        step={0.1} 
                        aria-labelledby="Zoom" 
                        onChange={(e) => setZoom(Number(e.target.value))} 
                        className="w-1/2" 
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setPreview(null); setIsCropping(false); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">İptal</button>
                        <button onClick={handleApplyCrop} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"><Crop className="w-4 h-4" /> Kırp ve Uygula</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button onClick={() => setIsCropping(true)} className="bg-white text-slate-900 p-2 rounded-full shadow-lg hover:bg-slate-100 transition-colors" title="Yeniden Kırp"><Crop className="w-4 h-4" /></button>
                       <button onClick={() => { setFile(null); setPreview(null); }} className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors" title="Sil"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-slate-900">Fiyatlandırma & Etiketler</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Normal Fiyat (₺)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="8500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">İndirimli Fiyat (₺)</label>
                  <input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="6900 (Boş bırakılırsa indirim yok)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Üst Rozet (Hero Badge)</label>
                  <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="ERKEN KAYIT İNDİRİMİ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fiyat Rozeti (Price Box Badge)</label>
                  <input type="text" value={formData.priceBadge} onChange={e => setFormData({...formData, priceBadge: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="KISA SÜRELİ" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-slate-900">Meta ve Eğitmenler</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Yıldız Puanı (Örn: 4.9)</label>
                  <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Yorum Sayısı (Örn: 128)</label>
                  <input type="number" value={formData.reviewCount} onChange={e => setFormData({...formData, reviewCount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Öğrenci Sayısı (Metin)</label>
                  <input type="text" value={formData.studentCount} onChange={e => setFormData({...formData, studentCount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="1,240+ Öğrenci" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Eğitmenler (Birden fazla seçilebilir)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {instructors.map(inst => (
                    <label key={inst.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${instructorIds.includes(inst.id) ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${instructorIds.includes(inst.id) ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
                        {instructorIds.includes(inst.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="font-medium text-slate-900">{inst.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Neler Kazanacaksınız? (Ana Özellikler)</h3>
                <div className="space-y-3">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-brand-500" />
                        <span className="text-sm font-medium">{feat}</span>
                      </div>
                      <button onClick={() => handleArrayRemove(setFeatures, idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <input type="text" id="newFeature" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Örn: 250+ Saat Canlı Konu Anlatımı" onKeyDown={e => { if(e.key==='Enter'){ e.preventDefault(); handleArrayAdd(setFeatures, e.currentTarget.value); e.currentTarget.value=''; } }} />
                    <button onClick={() => { const input = document.getElementById('newFeature') as HTMLInputElement; handleArrayAdd(setFeatures, input.value); input.value=''; }} type="button" className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl flex items-center gap-2"><Plus className="w-5 h-5" /> Ekle</button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Fiyat Kutusu Özellikleri</h3>
                <div className="space-y-3">
                  {pricingFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium">{feat}</span>
                      </div>
                      <button onClick={() => handleArrayRemove(setPricingFeatures, idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <input type="text" id="newPricingFeature" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Örn: Anında Erişime Açılır" onKeyDown={e => { if(e.key==='Enter'){ e.preventDefault(); handleArrayAdd(setPricingFeatures, e.currentTarget.value); e.currentTarget.value=''; } }} />
                    <button onClick={() => { const input = document.getElementById('newPricingFeature') as HTMLInputElement; handleArrayAdd(setPricingFeatures, input.value); input.value=''; }} type="button" className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl flex items-center gap-2"><Plus className="w-5 h-5" /> Ekle</button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500" />
                  <span className="font-medium text-slate-900">Eğitimi Yayına Al (Aktif)</span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={handlePrev} className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Geri
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button onClick={handleNext} className="px-6 py-3 rounded-xl font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors flex items-center gap-2">
              İleri <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {initialData ? 'Değişiklikleri Kaydet' : 'Eğitimi Oluştur'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
