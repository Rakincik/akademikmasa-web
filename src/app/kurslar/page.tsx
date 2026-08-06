import { prisma } from "@/lib/prisma";
import KurslarClient from "./KurslarClient";
import { Suspense } from "react";

export default async function CoursesPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        categories: true,
        instructors: true
      },
      orderBy: { order: "asc" }
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-24 text-center">Yükleniyor...</div>}>
      <KurslarClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}

