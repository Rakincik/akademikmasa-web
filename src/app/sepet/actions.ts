"use server";

import { prisma } from "@/lib/prisma";

export async function validateCoupon(code: string) {
  if (!code) {
    return { success: false, message: "Lütfen bir kupon kodu girin." };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { success: false, message: "Geçersiz kupon kodu." };
  }

  if (!coupon.isActive) {
    return { success: false, message: "Bu kupon kodunun süresi dolmuş veya pasif." };
  }

  const now = new Date();
  
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    return { success: false, message: "Bu kupon henüz aktif değil." };
  }
  
  if (coupon.endDate && new Date(coupon.endDate) < now) {
    return { success: false, message: "Bu kuponun süresi dolmuş." };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { success: false, message: "Bu kuponun kullanım sınırı dolmuş." };
  }

  return { 
    success: true, 
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    }
  };
}
