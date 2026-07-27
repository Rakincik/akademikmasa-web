import { prisma } from "@/lib/prisma";
import InstructorForm from "@/components/admin/InstructorForm";
import EgitmenlerClient from "./EgitmenlerClient";
import { Users } from "lucide-react";
import { addInstructor } from "./actions";

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
        
        <EgitmenlerClient instructors={instructors} />
      </div>
    </div>
  );
}
