const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.updateMany({
  where: { slug: '' },
  data: { slug: 'test-slug-123' }
}).then(p => { console.log(p); prisma.$disconnect(); });
