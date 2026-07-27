"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUser(userId: string, data: { name: string, email: string, password?: string, role: string }) {
  try {
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
    };
    
    if (data.password) {
      updateData.password = data.password;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/admin/kullanicilar");
    revalidatePath(`/admin/kullanicilar/${userId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Kullanıcı güncellenirken bir hata oluştu." };
  }
}

export async function createUser(data: { name: string, email: string, password?: string, role: string }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return { success: false, error: "Bu e-posta adresi zaten kullanılıyor." };
    }

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || "123456", // Default password if empty
        role: data.role as any, // "ADMIN" | "STUDENT" etc.
      },
    });

    revalidatePath("/admin/kullanicilar");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Kullanıcı oluşturulurken bir hata oluştu." };
  }
}
