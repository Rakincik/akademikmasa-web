"use server";

import { prisma } from "@/lib/prisma";

export async function validateCoupon(code: string, userEmail?: string, cartSubtotal?: number) {
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

  // Check minimum cart amount condition
  if (coupon.minOrderAmount && cartSubtotal !== undefined && cartSubtotal < coupon.minOrderAmount) {
    return { 
      success: false, 
      message: `Bu kupon kodu en az ${coupon.minOrderAmount.toLocaleString("tr-TR")} ₺ tutarındaki siparişlerde geçerlidir.` 
    };
  }

  // Check allowed specific user emails condition
  if (coupon.allowedUserEmails && coupon.allowedUserEmails.length > 0) {
    if (!userEmail || !coupon.allowedUserEmails.some(email => email.toLowerCase() === userEmail.toLowerCase())) {
      return { 
        success: false, 
        message: "Bu özel kupon kodu adınıza veya e-posta adresinize tanımlı değil." 
      };
    }
  }

  // Check previous buyers (loyalty coupon) condition
  if (coupon.onlyPreviousBuyers) {
    if (!userEmail) {
      return { 
        success: false, 
        message: "Bu sadakat kuponunu kullanabilmek için lütfen giriş yapın." 
      };
    }

    const previousOrder = await prisma.order.findFirst({
      where: {
        user: { email: userEmail.toLowerCase() },
        status: "COMPLETED"
      }
    });

    if (!previousOrder) {
      return { 
        success: false, 
        message: "Bu özel indirim kuponu yalnızca daha önce eğitim satın almış öğrencilerimize özeldir." 
      };
    }
  }

  return { 
    success: true, 
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      allowedProductIds: coupon.allowedProductIds || []
    }
  };
}

export async function getRecommendedProducts(cartProductIds: string[] = []) {
  try {
    // 1. Get the recommendationIds from the products currently in the cart
    const cartProducts = await prisma.product.findMany({
      where: {
        id: { in: cartProductIds },
      },
      select: {
        recommendationIds: true,
      },
    });

    // 2. Gather all recommendationIds, remove duplicates
    const recommendedIds = Array.from(
      new Set(cartProducts.flatMap(p => p.recommendationIds || []))
    );

    // 3. Filter out items that are already in the cart
    const filteredRecommendedIds = recommendedIds.filter(id => !cartProductIds.includes(id));

    // 4. Fetch the recommended products from the database
    let products = await prisma.product.findMany({
      where: {
        id: { in: filteredRecommendedIds },
        isPublished: true,
      },
      include: {
        instructors: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Fallback: If no products are explicitly selected for cross-sell (or all of them are already in the cart), show general active ones
    if (products.length === 0) {
      products = await prisma.product.findMany({
        where: {
          isPublished: true,
          id: { notIn: cartProductIds }, // don't recommend what is already in the cart
        },
        include: {
          instructors: true,
        },
        orderBy: {
          order: 'asc',
        },
        take: 4,
      });
    }

    return {
      success: true,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        salePrice: p.salePrice,
        image: p.imageUrl || "",
        slug: p.slug,
        instructor: p.instructors?.[0]?.name || "Akademik Masa",
      })),
    };
  } catch (error) {
    console.error("Failed to fetch recommended products:", error);
    return { success: false, products: [] };
  }
}
