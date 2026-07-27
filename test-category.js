const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const name = "CANLI DERS";
    const slug = name
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

    const category = await prisma.category.create({
      data: { name, slug },
    });
    console.log("Created category:", category);
  } catch (error) {
    console.error("Error creating category:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
