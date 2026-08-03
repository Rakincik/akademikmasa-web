import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PanelSidebar from "@/components/panel/PanelSidebar";
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header, MainLayout üzerinden global olarak geliyor */}

      <div className="flex flex-1">
        {/* Masaüstü Sidebar */}
        <PanelSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Müşteri Paneli Header'ı kaldırıldı, global Header kullanılıyor */}
          
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
