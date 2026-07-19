import { prisma } from "@/lib/prisma";
import KurslarClient from "./KurslarClient";

export default async function KurslarPage() {
  const [products, instructors, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        instructors: true,
        category: true
      },
      orderBy: { order: 'asc' }
    }),
    prisma.instructor.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  return <KurslarClient products={products} instructors={instructors} categories={categories} />;
}
