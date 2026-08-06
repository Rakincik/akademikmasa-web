"use client";

import { useState } from "react";
import { FolderTree, Trash2, Plus, Eye, EyeOff, CornerDownRight, Edit2, X, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  order: number;
  showInMenu: boolean;
  _count?: { products: number };
  subcategories?: Category[];
}

interface KategorilerClientProps {
  rootCategories: Category[];
  mainCategoriesList: Category[];
  addCategoryAction: (formData: FormData) => Promise<void>;
  updateCategoryAction: (formData: FormData) => Promise<void>;
  toggleShowInMenuAction: (formData: FormData) => Promise<void>;
  deleteCategoryAction: (formData: FormData) => Promise<void>;
}

export default function KategorilerClient({
  rootCategories,
  mainCategoriesList,
  addCategoryAction,
  updateCategoryAction,
  toggleShowInMenuAction,
  deleteCategoryAction,
}: KategorilerClientProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kategori ve Menü Yönetimi</h1>
        <p className="text-slate-500">
          Sitedeki tüm eğitim kategorilerini ve üst menüdeki (Eğitim Paketleri) alt menü yapısını buradan tam yetkiyle yönetebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Taraf: Yeni Kategori Ekleme Formu */}
        <div className="md:col-span-1">
          <form
            action={async (formData) => {
              await addCategoryAction(formData);
            }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-600" /> Yeni Kategori Ekle
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kategori Adı *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                placeholder="Örn: ÖABT veya Türkçe ÖABT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Üst Kategori (Alt Kategori Yapmak İçin)
              </label>
              <select
                name="parentId"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white"
              >
                <option value="">-- Ana Kategori Olsun --</option>
                {mainCategoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    📁 {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Boş bırakırsanız bağımsız bir Ana Kategori olur. Bir üst kategori seçerseniz onun alt menüsü olur.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sıra No
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                />
              </div>

              <div className="pt-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="showInMenu"
                  id="showInMenu"
                  defaultChecked
                  className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <label htmlFor="showInMenu" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Menüde Göster
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm shadow-sm"
            >
              Kategoriyi Kaydet
            </button>
          </form>
        </div>

        {/* Sağ Taraf: Kategoriler Ağaç Listesi */}
        <div className="md:col-span-2 space-y-4">
          {rootCategories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-slate-200 text-center text-slate-500">
              Henüz kategori eklenmemiş. Soldaki formdan ilk kategorinizi ekleyebilirsiniz.
            </div>
          ) : (
            rootCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
              >
                {/* Ana Kategori Header */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100/80 text-brand-600 rounded-xl flex items-center justify-center">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">{cat.name}</h4>
                        <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                          Sıra: {cat.order}
                        </span>
                        {cat.showInMenu ? (
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Menüde
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Gizli
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        /{cat.slug} • {cat._count?.products || 0} Doğrudan Eğitim • {cat.subcategories?.length || 0} Alt Kategori
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Kategoriyi Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <form action={toggleShowInMenuAction}>
                      <input type="hidden" name="id" value={cat.id} />
                      <input type="hidden" name="currentStatus" value={String(cat.showInMenu)} />
                      <button
                        type="submit"
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                          cat.showInMenu
                            ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                        title={cat.showInMenu ? "Menüden Gizle" : "Menüde Göster"}
                      >
                        {cat.showInMenu ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </form>

                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Alt Kategoriler Listesi */}
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div className="p-4 space-y-2 bg-white">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/60 border border-slate-100 transition-colors ml-4"
                      >
                        <div className="flex items-center gap-3">
                          <CornerDownRight className="w-4 h-4 text-brand-500 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-800">{sub.name}</span>
                              <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                Sıra: {sub.order}
                              </span>
                              {sub.showInMenu ? (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                  Menüde
                                </span>
                              ) : (
                                <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-medium">
                                  Gizli
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              /{sub.slug} • {sub._count?.products || 0} Eğitim
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCategory(sub)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 rounded hover:bg-brand-50 transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <form action={toggleShowInMenuAction}>
                            <input type="hidden" name="id" value={sub.id} />
                            <input type="hidden" name="currentStatus" value={String(sub.showInMenu)} />
                            <button
                              type="submit"
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-white transition-colors"
                              title={sub.showInMenu ? "Menüden Gizle" : "Menüde Göster"}
                            >
                              {sub.showInMenu ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </form>

                          <form action={deleteCategoryAction}>
                            <input type="hidden" name="id" value={sub.id} />
                            <button
                              type="submit"
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                              title="Alt Kategoriyi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 px-6 text-xs text-slate-400 italic">
                    Henüz bu ana kategoriye bağlı bir alt kategori yok.
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-brand-600" /> Kategoriyi Düzenle
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await updateCategoryAction(formData);
                setEditingCategory(null);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={editingCategory.id} />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory.name}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Üst Kategori
                </label>
                <select
                  name="parentId"
                  defaultValue={editingCategory.parentId || ""}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm bg-white"
                >
                  <option value="">-- Ana Kategori Olsun --</option>
                  {mainCategoriesList
                    .filter((c) => c.id !== editingCategory.id) // Cannot select self as parent
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        📁 {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Sıra No
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingCategory.order}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm"
                  />
                </div>

                <div className="pt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="showInMenu"
                    id="editShowInMenu"
                    defaultChecked={editingCategory.showInMenu}
                    className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <label htmlFor="editShowInMenu" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Menüde Göster
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
