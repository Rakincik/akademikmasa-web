import { getSiteContent } from "../actions";
import EditorClient from "./EditorClient";

export default async function SettingsEditorPage({ params }: { params: Promise<{ pageId: string }> }) {
  const resolvedParams = await params;
  const { pageId } = resolvedParams;

  const pageTitles: Record<string, string> = {
    home: "Ana Sayfa",
    about: "Hakkımızda",
    contact: "İletişim",
    instructors: "Kadromuz",
    courses: "Kurslar"
  };

  const title = pageTitles[pageId] || "Sayfa İçeriği";
  
  // Veritabanından içeriği çek (Eğer yoksa null dönecek, client varsayılanı kullanacak)
  const data = await getSiteContent(pageId);

  return (
    <div className="-m-8 h-[calc(100vh-4rem)] bg-slate-100 p-8 overflow-hidden">
      <EditorClient 
        pageId={pageId}
        initialTitle={title}
        initialData={data?.content || null}
      />
    </div>
  );
}
