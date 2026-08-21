"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { spawn } from "child_process";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    return { success: false, error: "Sipariş bulunamadı" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });

  // Eğer sipariş onaylanmışsa (COMPLETED) LMS kuyruğuna ekle
  if (newStatus.startsWith("COMPLETED") && !order.status.startsWith("COMPLETED")) {
    
    // Kopya/yarım kalmış "Bekliyor" siparişleri iptal et
    try {
      await prisma.order.updateMany({
        where: {
          userId: order.userId,
          status: "PENDING",
          id: { not: order.id }
        },
        data: { status: "FAILED" }
      });
    } catch (err) {
      console.error("Kopya siparişler temizlenirken hata:", err);
    }

    const hasLmsCourse = order.items.some((item) => {
      const prod: any = item.product;
      return prod?.lmsCourseId || (Array.isArray(prod?.lmsCourseIds) && prod.lmsCourseIds.length > 0);
    });
    
    if (hasLmsCourse) {
      const existingJob = await prisma.lmsQueue.findUnique({ where: { orderId: order.id } });
      if (!existingJob) {
        await prisma.lmsQueue.create({
          data: { orderId: order.id, status: "PENDING" }
        });
      }

      // Arka planda LMS kuyruğunu eritmek için worker'ı tetikle
      try {
        const workerPath = ['src', 'workers', 'lms-queue-worker.js'].join('/');
        const child = spawn("node", [workerPath, "--once"], {
          detached: true,
          stdio: "ignore"
        });
        child.unref();
      } catch (spawnErr) {
        console.error("LMS Worker spawn error:", spawnErr);
      }
    }
  }

  revalidatePath("/admin/siparisler");
  revalidatePath("/panel/siparislerim");
  return { success: true };
}

export async function deleteOrders(orderIds: string[]) {
  if (!orderIds || orderIds.length === 0) return { success: false, error: "Silinecek sipariş seçilmedi." };
  
  try {
    // Note: Due to foreign keys, prisma deleteMany might fail if not cascaded,
    // but assuming OrderItem is cascade deleted or we delete items first.
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: orderIds } }
    });
    
    await prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    });
    
    revalidatePath("/admin/siparisler");
    return { success: true };
  } catch (err: any) {
    console.error("Delete orders error:", err);
    return { success: false, error: "Siparişler silinirken hata oluştu." };
  }
}
