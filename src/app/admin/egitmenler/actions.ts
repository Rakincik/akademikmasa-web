"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addInstructor(formData: FormData) {
  const name = formData.get("name") as string;
  const title = formData.get("title") as string;
  const branch = formData.get("branch") as string;
  const department = formData.get("department") as string;
  const motto = formData.get("motto") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  if (!name) return { success: false, error: "İsim zorunludur" };

  try {
    await prisma.instructor.create({
      data: { name, title, branch, department, motto, imageUrl }
    });
    revalidatePath("/admin/egitmenler");
    revalidatePath("/kadromuz");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}

export async function deleteInstructor(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await prisma.instructor.delete({ where: { id } });
    revalidatePath("/admin/egitmenler");
    revalidatePath("/kadromuz");
  } catch (e) {
    console.error(e);
  }
}

export async function updateInstructor(id: string, data: { name: string; title: string; branch: string; department: string; motto: string; imageUrl: string }) {
  if (!id) return { success: false, error: "ID eksik" };
  
  try {
    await prisma.instructor.update({
      where: { id },
      data
    });
    revalidatePath("/admin/egitmenler");
    revalidatePath("/kadromuz");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Bir hata oluştu" };
  }
}
