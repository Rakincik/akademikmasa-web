"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveProduct(data: any) {
  const {
    id,
    title,
    slug,
    description,
    longDescription,
    price,
    salePrice,
    imageUrl,
    images = [],
    badge,
    priceBadge,
    rating,
    reviewCount,
    studentCount,
    features,
    pricingFeatures,
    isPublished,
    showInCrossSell,
    instructorIds,
    categoryIds = [], // default to empty array
    lmsCourseId
  } = data;

  const generatedSlug = slug || title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const baseData = {
    title,
    slug: generatedSlug,
    description,
    longDescription,
    price: parseFloat(price),
    salePrice: salePrice ? parseFloat(salePrice) : null,
    imageUrl,
    images,
    badge,
    priceBadge,
    rating: parseFloat(rating),
    reviewCount: parseInt(reviewCount, 10),
    studentCount,
    features,
    pricingFeatures,
    isPublished,
    showInCrossSell: Boolean(showInCrossSell),
    lmsCourseId: lmsCourseId || null,
  };

  if (id) {
    // Update existing
    await prisma.product.update({
      where: { id },
      data: {
        ...baseData,
        instructors: { set: instructorIds.map((id: string) => ({ id })) },
        categories: { set: categoryIds.map((id: string) => ({ id })) }
      }
    });
  } else {
    // Create new
    await prisma.product.create({
      data: {
        ...baseData,
        instructors: { connect: instructorIds.map((id: string) => ({ id })) },
        categories: { connect: categoryIds.map((id: string) => ({ id })) }
      }
    });
  }

  revalidatePath("/admin/kurslar");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/kurslar");
}

export async function updateProductOrder(orderedIds: string[]) {
  try {
    const transactions = orderedIds.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { order: index }
      })
    );
    await prisma.$transaction(transactions);
    
    revalidatePath("/");
    revalidatePath("/kurslar");
    revalidatePath("/admin/kurslar");
    
    return { success: true };
  } catch (error) {
    console.error("Product order update error:", error);
    return { success: false, error: "Sıralama güncellenemedi." };
  }
}
