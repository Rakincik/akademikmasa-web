"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Upload, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Crop } from "lucide-react";
import { saveProduct } from "@/app/admin/kurslar/actions";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Instructor {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

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
  const [errorMsg, setErrorMsg] = useState("");

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
    isPublished: true,
    lmsCourseId: "",
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [pricingFeatures, setPricingFeatures] = useState<string[]>([]);
  const [instructorIds, setInstructorIds] = useState<string[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // Dropdown states
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] = useState(false);

  // Initialize data if editing
  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      if (initialData) {
        setFormData({
          id: initialData.id,
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          longDescription: initialData.longDescription || "",
          price: initialData.price ? new Intl.NumberFormat("tr-TR").format(initialData.price) : "",
          salePrice: initialData.salePrice ? new Intl.NumberFormat("tr-TR").format(initialData.salePrice) : "",
          badge: initialData.badge || "",
          priceBadge: initialData.priceBadge || "",
          rating: initialData.rating?.toString() || "5.0",
          reviewCount: initialData.reviewCount?.toString() || "0",
          studentCount: initialData.studentCount || "",
          isPublished: initialData.isPublished,
          lmsCourseId: initialData.lmsCourseId || "",
        });
        setFeatures(initialData.features || []);
        setPricingFeatures(initialData.pricingFeatures || []);
        setInstructorIds(initialData.instructors?.map((i: any) => i.id) || []);
        setCategoryIds(initialData.categories?.map((c: any) => c.id) || []);
        setPreview(initialData.imageUrl || null);
        setGalleryUrls(initialData.images || []);
      } else {
        // Reset
        setFormData({
          id: "", title: "", slug: "", description: "", longDescription: "", price: "", salePrice: "",
          badge: "", priceBadge: "", rating: "5.0", reviewCount: "0", studentCount: "", isPublished: true, lmsCourseId: "",
        });
        setFeatures([]);
        setPricingFeatures([]);
        setInstructorIds([]);
        setCategoryIds([]);
        setFile(null);
        setPreview(null);
        setGalleryUrls([]);
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
    if (!initialData) {
      setFormData({ ...formData, title: newTitle, slug: generateSlug(newTitle) });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: "price" | "salePrice") => {
    let val = e.target.value.replace(/\D/g, ""); // Sadece rakamları al
    if (val) {
      val = new Intl.NumberFormat("tr-TR").format(parseInt(val, 10)); // Binlik ayırıcı ekle (örn: 14.000)
    }
    setFormData({ ...formData, [field]: val });
  };

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newUrls: string[] = [];
      for (const f of filesArray) {
        const fileData = new FormData();
        fileData.append("file", f);
        try {
          const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData });
          if (uploadRes.ok) {
            const data = await uploadRes.json();
            newUrls.push(data.url);
          }
        } catch (err) {
          console.error("Gallery upload error:", err);
        }
      }
      setGalleryUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleInstructorToggle = (id: string) => {
    setInstructorIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setLoading(true);
    let imageUrl = preview; 

    // Temizlenmiş (noktasız) fiyat değerlerini al
    const cleanPrice = formData.price.replace(/\./g, "");
    const cleanSalePrice = formData.salePrice ? formData.salePrice.replace(/\./g, "") : "";

    if (!cleanPrice) {
      setErrorMsg("Lütfen geçerli bir fiyat giriniz.");
      setLoading(false);
      return;
    }

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
        price: cleanPrice,
        salePrice: cleanSalePrice,
        imageUrl,
        images: galleryUrls,
        features,
        pricingFeatures,
        instructorIds,
        categoryIds
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Kaydetme işlemi sırasında bir hata oluştu.");
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
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-48">
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">MURO LMS Grup / Kurs ID (Opsiyonel)</label>
                  <input type="text" value={formData.lmsCourseId} onChange={e => setFormData({...formData, lmsCourseId: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none bg-indigo-50/50" placeholder="Örn: yks-sayisal-2024" />
                  <p className="text-xs text-slate-500 mt-2">Öğrencinin satın aldıktan sonra sisteme kaydedileceği kurs ID'si. Boş bırakırsanız LMS entegrasyonu tetiklenmez.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategoriler (Birden fazla seçilebilir)</label>
                <div className="relative">
                  <div 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 outline-none bg-white flex flex-wrap gap-2 items-center cursor-pointer min-h-[50px]"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  >
                    {categoryIds.length === 0 ? (
                      <span className="text-slate-400 text-sm">Kategori Seçiniz...</span>
                    ) : (
                      categoryIds.map(id => {
                        const cat = categories.find(c => c.id === id);
                        return (
                          <span key={id} className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                            {cat?.name}
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-brand-800" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategoryIds(prev => prev.filter(cId => cId !== id));
                              }} 
                            />
                          </span>
                        );
                      })
                    )}
                  </div>
                  
                  {isCategoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                      <div className="relative z-20 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2">
                        {categories.map(cat => (
                          <label 
                            key={cat.id} 
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${categoryIds.includes(cat.id) ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
                              {categoryIds.includes(cat.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`font-medium ${categoryIds.includes(cat.id) ? 'text-brand-700' : 'text-slate-700'}`}>{cat.name}</span>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={categoryIds.includes(cat.id)}
                              onChange={() => {
                                setCategoryIds(prev => 
                                  prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                );
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kısa Açıklama</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="Hero alanında görünecek kısa açıklama..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Detaylı Açıklama (Eğitim Hakkında)</label>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.longDescription} 
                    onChange={val => setFormData({...formData, longDescription: val})} 
                    modules={quillModules}
                    className="h-64 pb-10" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Kapak Görseli</label>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Önerilen Boyut: 3:4 (Dikey)</span>
                  </div>
                  {!preview ? (
                    <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 cursor-pointer relative hover:border-brand-500 hover:text-brand-600">
                      <input type="file" accept="image/*" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Sürükle bırak veya seç</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors" title="Sil"><X className="w-4 h-4" /></button>
                       </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Ürün Görsel Galerisi (Slayt Görselleri)</label>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Önerilen Boyut: 3:4 (Dikey)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setGalleryUrls(prev => prev.filter((_, i) => i !== idx))} 
                            className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="relative h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:border-brand-500 hover:text-brand-600 transition-colors">
                      <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Plus className="w-5 h-5 mb-0.5" />
                      <span className="text-[10px] font-bold">Ekle</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-slate-900">Fiyatlandırma & Etiketler</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Normal Fiyat (₺)</label>
                  <input type="text" value={formData.price} onChange={e => handlePriceChange(e, "price")} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="18.000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">İndirimli Fiyat (₺)</label>
                  <input type="text" value={formData.salePrice} onChange={e => handlePriceChange(e, "salePrice")} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="14.000 (Boş bırakılabilir)" />
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
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-48">
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
                <div className="relative">
                  <div 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 outline-none bg-white flex flex-wrap gap-2 items-center cursor-pointer min-h-[50px]"
                    onClick={() => setIsInstructorDropdownOpen(!isInstructorDropdownOpen)}
                  >
                    {instructorIds.length === 0 ? (
                      <span className="text-slate-400 text-sm">Eğitmen Seçiniz...</span>
                    ) : (
                      instructorIds.map(id => {
                        const inst = instructors.find(i => i.id === id);
                        return (
                          <span key={id} className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                            {inst?.name}
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-brand-800" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setInstructorIds(prev => prev.filter(iId => iId !== id));
                              }} 
                            />
                          </span>
                        );
                      })
                    )}
                  </div>
                  
                  {isInstructorDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsInstructorDropdownOpen(false)}></div>
                      <div className="relative z-20 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-2">
                        {instructors.map(inst => (
                          <label 
                            key={inst.id} 
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${instructorIds.includes(inst.id) ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
                              {instructorIds.includes(inst.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`font-medium ${instructorIds.includes(inst.id) ? 'text-brand-700' : 'text-slate-700'}`}>{inst.name}</span>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={instructorIds.includes(inst.id)}
                              onChange={() => {
                                setInstructorIds(prev => 
                                  prev.includes(inst.id) ? prev.filter(id => id !== inst.id) : [...prev, inst.id]
                                );
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    </>
                  )}
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
          
          {errorMsg && (
            <div className="absolute bottom-24 left-8 right-8 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 font-medium text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              {errorMsg}
            </div>
          )}

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
