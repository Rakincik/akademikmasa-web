"use client";

import { useState } from "react";
import { Eye, ArrowUpDown, ChevronDown, ChevronUp, Edit2, X, Save, Search } from "lucide-react";
import Link from "next/link";
import { User } from "@prisma/client";
import { updateUser, createUser } from "./actions";

interface KullanicilarClientProps {
  users: User[];
}

export default function KullanicilarClient({ users }: KullanicilarClientProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", role: "STUDENT", tc: "", address: "" });

  // Filter users by search term (case-insensitive with Turkish character support)
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLocaleLowerCase("tr-TR").trim();
    if (!search) return true;
    return (
      user.name.toLocaleLowerCase("tr-TR").includes(search) ||
      user.email.toLocaleLowerCase("tr-TR").includes(search) ||
      (user.phone && user.phone.includes(search)) ||
      (user.tc && user.tc.includes(search))
    );
  });

  // Sort by name if asc, else by createdAt
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name, "tr");
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const toggleSort = () => {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({ 
      name: user.name, 
      email: user.email, 
      password: user.password, 
      role: user.role,
      tc: user.tc || "",
      address: user.address || ""
    });
    setIsModalOpen(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", password: "", role: "STUDENT", tc: "", address: "" });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editForm.name || !editForm.email) {
      alert("Lütfen ad ve e-posta alanlarını doldurun.");
      return;
    }
    
    setIsSaving(true);
    try {
      let res;
      if (editingUser) {
        res = await updateUser(editingUser.id, editForm);
      } else {
        res = await createUser(editForm);
      }
      
      if (res.success) {
        setIsModalOpen(false);
        setEditingUser(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kullanıcılar</h1>
          <p className="text-slate-500">Sistemdeki tüm kullanıcıları ve yöneticileri buradan yönetebilirsiniz.</p>
        </div>
        <button 
          onClick={handleNewUser}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Arama Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="İsim, e-posta, telefon veya T.C. No ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-medium text-slate-900 placeholder:text-slate-400 text-sm"
          />
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 w-full sm:w-auto text-center shrink-0">
          Bulunan: <span className="text-brand-600 font-bold">{filteredUsers.length}</span> / {users.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    Ad Soyad
                    <div className="text-slate-400 group-hover:text-brand-600 transition-colors">
                      {sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4" />}
                    </div>
                  </div>
                </th>
                <th className="px-6 py-4">E-posta</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 bg-brand-50 text-brand-700">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Şifre
                  </div>
                </th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Henüz kayıtlı kullanıcı bulunmuyor.
                  </td>
                </tr>
              ) : (
                sortedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <Link href={`/admin/kullanicilar/${user.id}`} className="hover:text-brand-600 hover:underline">
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-slate-100 px-3 py-1.5 rounded text-sm font-mono text-slate-800 border border-slate-200 inline-block">
                        {user.password}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">E-posta</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Rol</label>
                  <div className="relative">
                    <div 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 outline-none bg-white flex justify-between items-center cursor-pointer transition-all"
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    >
                      <span className="font-medium text-slate-700">{editForm.role === "ADMIN" ? "Yönetici" : "Öğrenci"}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                    </div>
                    
                    {isRoleDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)}></div>
                        <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                          <div 
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 transition-colors border-b border-slate-100"
                            onClick={() => {
                              setEditForm({...editForm, role: "STUDENT"});
                              setIsRoleDropdownOpen(false);
                            }}
                          >
                            Öğrenci
                          </div>
                          <div 
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer font-medium text-slate-700 transition-colors"
                            onClick={() => {
                              setEditForm({...editForm, role: "ADMIN"});
                              setIsRoleDropdownOpen(false);
                            }}
                          >
                            Yönetici
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">T.C. Kimlik No</label>
                  <input 
                    type="text" 
                    maxLength={11}
                    value={editForm.tc}
                    onChange={e => setEditForm({...editForm, tc: e.target.value.replace(/\D/g, "")})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Açık Adres</label>
                  <textarea 
                    rows={2}
                    value={editForm.address}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Şifre</label>
                  <input 
                    type="text" 
                    value={editForm.password}
                    onChange={e => setEditForm({...editForm, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                disabled={isSaving}
              >
                İptal
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? "Kaydediliyor..." : (
                  <>
                    <Save className="w-4 h-4" /> Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
