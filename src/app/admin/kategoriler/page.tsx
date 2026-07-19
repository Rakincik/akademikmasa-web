import { prisma } from "@/lib/prisma";
import { Folder, Trash2, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

async function addCategory(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  if (!name) return;

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/admin/kategoriler");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategoriler");
}

export default async function KategorilerPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kategori Yönetimi</h1>
        <p className="text-slate-500">
          Sitedeki tüm eğitim kategorilerini buradan belirleyebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Taraf: Kategori Ekleme */}
        <div className="md:col-span-1">
          <form
            action={addCategory}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-600" /> Yeni Kategori
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  placeholder="Örn: Eğitim Bilimleri"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Kategoriyi Kaydet
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Taraf: Kategoriler Listesi */}
        <div className="md:col-span-2 space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-slate-200 text-center text-slate-500">
              Henüz kategori eklenmemiş.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                    <Folder className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-slate-500">
                      /{cat.slug} • {cat._count.products} Eğitim
                    </p>
                  </div>
                </div>

                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button
                    type="submit"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
