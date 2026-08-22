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
    recommendationIds = [],
    instructorIds,
    categoryIds = [], // default to empty array
    lmsCourseId,
    lmsCourseIds = []
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

  // Format array and fallback string
  const cleanLmsCourseIds = Array.isArray(lmsCourseIds)
    ? Array.from(new Set(lmsCourseIds.map((s: string) => s.trim()).filter(Boolean)))
    : (lmsCourseId ? [lmsCourseId.trim()] : []);

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
    recommendationIds,
    lmsCourseId: cleanLmsCourseIds[0] || lmsCourseId || null,
    lmsCourseIds: cleanLmsCourseIds,
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

export async function syncMuroPackages() {
  try {
    const { getMuroPackages } = await import("@/lib/muro");
    const packages = await getMuroPackages();

    if (!Array.isArray(packages) || packages.length === 0) {
      return { 
        success: false, 
        message: "MURO'dan aktif paket bulunamadı veya API bağlantısı yanıt vermedi. Lütfen MURO panelinizde eğitim paketlerinizin ve paket kodlarınızın tanımlı olduğundan emin olun." 
      };
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const pkg of packages) {
      const packageCode = (pkg.code || pkg.identifier || pkg.id?.toString() || "").trim();
      if (!packageCode) continue;

      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { lmsCourseId: packageCode },
            { lmsCourseIds: { has: packageCode } }
          ]
        }
      });

      const title = pkg.name || pkg.title || packageCode;
      const price = typeof pkg.price === "number" ? pkg.price : (pkg.price ? parseFloat(String(pkg.price)) : 0);
      const description = pkg.description || `${title} eğitim paketi`;
      const features = Array.isArray(pkg.courseTitles) ? pkg.courseTitles : [];

      if (existingProduct) {
        const combinedIds: string[] = [...(existingProduct.lmsCourseIds || []), packageCode].filter((id): id is string => Boolean(id));
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            price: price > 0 ? price : existingProduct.price,
            lmsCourseId: packageCode,
            lmsCourseIds: Array.from(new Set(combinedIds)),
            features: features.length > 0 ? features : existingProduct.features
          }
        });
        updatedCount++;
      } else {
        // Generate unique slug
        const rawSlug = title
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
          .replace(/-+/g, "-") || "kurs";

        let uniqueSlug = rawSlug;
        let counter = 1;
        while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${rawSlug}-${counter++}`;
        }

        await prisma.product.create({
          data: {
            title,
            slug: uniqueSlug,
            description,
            price,
            features,
            lmsCourseId: packageCode,
            lmsCourseIds: [packageCode],
            isPublished: true
          }
        });
        createdCount++;
      }
    }

    revalidatePath("/");
    revalidatePath("/kurslar");
    revalidatePath("/admin/kurslar");

    return {
      success: true,
      message: `Senkronizasyon tamamlandı: ${createdCount} yeni paket eklendi, ${updatedCount} paket güncellendi.`
    };
  } catch (error: any) {
    console.error("MURO Sync Error:", error);
    return { success: false, message: error.message || "Senkronizasyon sırasında hata oluştu." };
  }
}

