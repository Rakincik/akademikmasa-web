const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@akademikmasa.com';
  const adminPassword = 'Ufuk.Zu.2026';

  console.log(`Veritabanına bağlanılıyor...`);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
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
