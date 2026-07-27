"use client";

import { useState } from "react";
import { Edit2, Trash2, X, Save, Upload, Loader2 } from "lucide-react";
import { Instructor } from "@prisma/client";
import { deleteInstructor, updateInstructor } from "./actions";

interface EgitmenlerClientProps {
  instructors: Instructor[];
}

export default function EgitmenlerClient({ instructors }: EgitmenlerClientProps) {
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    branch: "",
    department: "",
    motto: "",
    imageUrl: ""
  });

  const openEditModal = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFile(null);
    setPreview(instructor.imageUrl || null);
    setEditForm({
      name: instructor.name,
      title: instructor.title || "",
      branch: instructor.branch || "",
      department: instructor.department || "",
      motto: instructor.motto || "",
      imageUrl: instructor.imageUrl || ""
    });
  };

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

  const handleSave = async () => {
    if (!editingInstructor) return;
    setIsSaving(true);
    
    let finalImageUrl = editForm.imageUrl;

    try {
      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          finalImageUrl = data.url;
        }
        setIsUploading(false);
      }

      const res = await updateInstructor(editingInstructor.id, { ...editForm, imageUrl: finalImageUrl });
      if (res.success) {
        setEditingInstructor(null);
      } else {
        alert(res.error);
      }
    } catch (e) {
      alert("Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {instructors.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <h4 className="text-lg font-bold text-slate-800 mb-2">Henüz Eğitmen Eklenmemiş</h4>
          <p className="text-slate-500">Veritabanınızda hiç eğitmen bulunmuyor. Yeni bir eğitmen ekleyerek başlayabilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map(instructor => (
            <div key={instructor.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow group relative bg-white">
              <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                {instructor.imageUrl ? (
                  <img src={instructor.imageUrl} alt={instructor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                    {instructor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-16">
                <h4 className="font-bold text-slate-900 truncate">{instructor.name}</h4>
                <p className="text-sm text-slate-500 truncate">{instructor.title || instructor.branch || "Unvan/Branş Belirtilmemiş"}</p>
                {instructor.department && <p className="text-xs text-brand-600 font-medium">{instructor.department}</p>}
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => openEditModal(instructor)}
                  className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <form action={deleteInstructor}>
                  <input type="hidden" name="id" value={instructor.id} />
                  <button type="submit" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingInstructor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Eğitmen Düzenle</h3>
              <button 
                onClick={() => setEditingInstructor(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ad Soyad</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Unvan</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Branş</label>
                  <input 
                    type="text" 
                    value={editForm.branch}
                    onChange={e => setEditForm({...editForm, branch: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Departman / Kategori</label>
                  <input 
                    type="text" 
                    value={editForm.department}
                    onChange={e => setEditForm({...editForm, department: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Eğitmen Mottosu</label>
                  <textarea 
                    value={editForm.motto}
                    onChange={e => setEditForm({...editForm, motto: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Fotoğraf Yükle</label>
                  {!preview ? (
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-600 transition-colors cursor-pointer relative bg-slate-50"
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Resmi buraya sürükleyin veya seçmek için tıklayın</span>
                    </div>
                  ) : (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setFile(null); setPreview(null); setEditForm({...editForm, imageUrl: ""}); }}
                        className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors backdrop-blur-sm shadow-sm"
                        title="Fotoğrafı Kaldır"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setEditingInstructor(null)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                disabled={isSaving || isUploading}
              >
                İptal
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 min-w-[140px] justify-center"
              >
                {(isSaving || isUploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {isUploading ? "Yükleniyor..." : "Kaydediliyor..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
