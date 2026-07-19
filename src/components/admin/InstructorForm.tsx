"use client";

import { useState } from "react";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InstructorForm({ action }: { action: any }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    let imageUrl = "";

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.url;
        }
      }

      const formDataForAction = new FormData();
      formDataForAction.append("name", name);
      formDataForAction.append("title", title);
      formDataForAction.append("imageUrl", imageUrl);
      
      await action(formDataForAction);
      
      // Reset form
      setName("");
      setTitle("");
      setFile(null);
      setPreview(null);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-brand-600" /> Yeni Eğitmen Ekle
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Eğitmen Adı Soyadı</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            placeholder="Örn: Zuhal Bedirhan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Unvan / Branş</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            placeholder="Örn: Türkçe Öğretmeni"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Eğitmen Fotoğrafı</label>
        
        {!preview ? (
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-600 transition-colors cursor-pointer relative"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm">Resmi buraya sürükleyin veya seçmek için tıklayın</span>
          </div>
        ) : (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => { setFile(null); setPreview(null); }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={loading || !name}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          Eğitmeni Kaydet
        </button>
      </div>
    </form>
  );
}
