import { prisma } from "@/lib/prisma";
import InstructorForm from "@/components/admin/InstructorForm";
import { Users, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function addInstructor(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  if (!name) return;

  await prisma.instructor.create({
    data: { name, title, imageUrl }
  });

  revalidatePath("/admin/egitmenler");
}

async function deleteInstructor(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.instructor.delete({ where: { id } });
  revalidatePath("/admin/egitmenler");
}

export default async function EgitmenlerPage() {
  const instructors = await prisma.instructor.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eğitmenler</h1>
          <p className="text-slate-500">Sistemdeki eğitmen kadrosunu buradan yönetebilirsiniz.</p>
        </div>
      </div>

      <InstructorForm action={addInstructor} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600" /> Kayıtlı Eğitmenler
        </h3>
        
        {instructors.length === 0 ? (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            Henüz eğitmen eklenmemiş.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map(instructor => (
              <div key={instructor.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow group relative">
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                  {instructor.imageUrl ? (
                    <img src={instructor.imageUrl} alt={instructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                      {instructor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{instructor.name}</h4>
                  <p className="text-sm text-slate-500 truncate">{instructor.title || "Unvan Belirtilmemiş"}</p>
                </div>
                
                <form action={deleteInstructor} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input type="hidden" name="id" value={instructor.id} />
                  <button type="submit" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
