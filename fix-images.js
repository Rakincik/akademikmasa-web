import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fix() {
  const products = await prisma.product.findMany();
  let count = 0;
  for (const p of products) {
    if (p.imageUrl && p.imageUrl.startsWith("blob:")) {
      await prisma.product.update({
        where: { id: p.id },
        data: { imageUrl: null }
      });
      count++;
    }
  }
  console.log(`Fixed ${count} broken image URLs.`);
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
