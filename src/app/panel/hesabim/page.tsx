import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { User } from "lucide-react";

export default async function HesabimPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hesap Bilgilerim</h1>
          <p className="text-slate-500 font-medium text-sm">
            Kişisel bilgilerinizi ve iletişim detaylarınızı buradan güncelleyebilirsiniz.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <ProfileForm user={{
            name: user.name,
            tc: (user as any).tc || "",
            email: user.email,
            phone: user.phone || "",
            address: (user as any).address || ""
          }} />
        </div>
      </div>
    </div>
  );
}
