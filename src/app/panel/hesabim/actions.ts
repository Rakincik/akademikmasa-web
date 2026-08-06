"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; tc?: string; phone: string; password?: string; address?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Oturum bulunamadı." };
    }

    const updateData: any = {
      name: data.name,
      phone: data.phone,
      tc: data.tc || null,
      address: data.address || null,
    };

    if (data.password && data.password.trim() !== "") {
      if (data.password.length < 6) {
        return { success: false, error: "Şifre en az 6 karakter olmalıdır." };
      }
      updateData.password = data.password;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    revalidatePath("/panel");
    revalidatePath("/panel/hesabim");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Profil güncellenirken bir hata oluştu." };
  }
}
