"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Belirtilen sayfa ID'sine ait JSON içeriğini getirir.
 * Eğer veritabanında yoksa, default boş bir obje veya temel bir taslak döndürebiliriz.
 */
export async function getSiteContent(pageId: string) {
  try {
    const data = await prisma.siteContent.findUnique({
      where: { pageId }
    });

    if (!data) {
      // Sayfa veritabanında henüz yoksa null döndür
      return null;
    }

    return {
      title: data.title,
      content: JSON.parse(data.content)
    };
  } catch (error) {
    console.error("Site content get error:", error);
    return null;
  }
}

/**
 * Sayfa içeriğini günceller veya yoksa oluşturur (Upsert)
 */
export async function saveSiteContent(pageId: string, title: string, contentData: any) {
  try {
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

    // Ana sayfa veya güncellenen sayfanın cache'ini temizle
    revalidatePath("/");
    revalidatePath("/hakkimizda");
    revalidatePath(`/admin/ayarlar/${pageId}`);

    return { success: true };
  } catch (error) {
    console.error("Site content save error:", error);
    return { success: false, error: "Kaydedilirken bir hata oluştu." };
  }
}
