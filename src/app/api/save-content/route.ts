import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { pageId, title, contentData } = await req.json();

    const jsonString = JSON.stringify(contentData);

    await prisma.siteContent.upsert({
      where: { pageId },
      update: {
        title,
        content: jsonString
      },
      create: {
        pageId,
        title,
        content: jsonString
      }
    });

    // Cache'i temizle
    revalidatePath("/");
    revalidatePath("/hakkimizda");
    revalidatePath(`/admin/ayarlar/${pageId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Site content API save error:", error);
    return NextResponse.json({ success: false, error: "Kaydedilirken bir hata oluştu." }, { status: 500 });
  }
}
