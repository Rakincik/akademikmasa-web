const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@akademikmasa.com';
  const adminPassword = 'admin'; // Şifrelenmeden direkt düz metin (auth.ts öyle bekliyor)

  console.log(`Veritabanına bağlanılıyor...`);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log(`Admin kullanıcısı zaten mevcut: ${adminEmail}`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: 'Yönetici',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
    }
  });

  console.log(`✅ Admin kullanıcısı başarıyla oluşturuldu!`);
  console.log(`Giriş Bilgileri:`);
  console.log(`Email: ${adminEmail}`);
  console.log(`Şifre: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
