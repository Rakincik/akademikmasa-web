"use server";

import { prisma } from "@/lib/prisma";

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  tc?: string;
  address?: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Bu e-posta adresi zaten kullanılıyor." };
    }

    const name = `${data.firstName} ${data.lastName}`.trim();

    await prisma.user.create({
      data: {
        name,
        email: data.email,
        phone: data.phone || null,
        password: data.password || "123456",
        tc: data.tc || null,
        address: data.address || null,
        role: "STUDENT",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Kayıt olurken bir hata oluştu." };
  }
}
