import { prisma } from "@/lib/prisma";
import KurslarClient from "./KurslarClient";

export default async function CoursesPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        instructors: true
      },
      orderBy: { order: "asc" }
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return <KurslarClient initialProducts={products} categories={categories} />;
}
