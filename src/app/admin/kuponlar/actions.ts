"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveCoupon(data: any) {
  const { 
    id, code, discountType, discountValue, isActive, 
    isInfluencer, influencerName, influencerEmail,
    startDate, endDate, usageLimit, allowedProductIds
  } = data;

  const baseData = {
    code: code.toUpperCase().trim(),
    discountType,
    discountValue: parseFloat(discountValue),
    isActive,
    isInfluencer: Boolean(isInfluencer),
    influencerName: isInfluencer ? influencerName : null,
    influencerEmail: isInfluencer ? influencerEmail : null,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
    allowedProductIds: allowedProductIds || [],
  };

  if (id) {
    await prisma.coupon.update({
      where: { id },
      data: baseData
    });
  } else {
    await prisma.coupon.create({
      data: baseData
    });
  }

  revalidatePath("/admin/kuponlar");
  revalidatePath("/admin/influencer");
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/kuponlar");
  revalidatePath("/admin/influencer");
}
