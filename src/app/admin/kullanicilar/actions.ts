"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUser(userId: string, data: { name: string, email: string, password?: string, role: string, tc?: string, address?: string }) {
  try {
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      tc: data.tc || null,
      address: data.address || null,
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

export async function createUser(data: { name: string, email: string, password?: string, role: string, tc?: string, address?: string }) {
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
        tc: data.tc || null,
        address: data.address || null,
      },
    });

    revalidatePath("/admin/kullanicilar");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Kullanıcı oluşturulurken bir hata oluştu." };
  }
}

export async function deleteUsers(userIds: string[]) {
  if (!userIds || userIds.length === 0) {
    return { success: false, error: "Silinecek kullanıcı seçilmedi." };
  }

  try {
    // 1. Find all orders belonging to these users
    const orders = await prisma.order.findMany({
      where: { userId: { in: userIds } },
      select: { id: true }
    });
    const orderIds = orders.map((o) => o.id);

    if (orderIds.length > 0) {
      // 2. Delete LMS queue items for these orders
      await prisma.lmsQueue.deleteMany({
        where: { orderId: { in: orderIds } }
      });

      // 3. Delete order items
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: orderIds } }
      });

      // 4. Delete orders
      await prisma.order.deleteMany({
        where: { id: { in: orderIds } }
      });
    }

    // 5. Delete users
    await prisma.user.deleteMany({
      where: { id: { in: userIds } }
    });

    revalidatePath("/admin/kullanicilar");
    return { success: true };
  } catch (error) {
    console.error("Error deleting users:", error);
    return { success: false, error: "Kullanıcı(lar) silinirken bir hata oluştu." };
  }
}

export async function deleteUser(userId: string) {
  return deleteUsers([userId]);
}

