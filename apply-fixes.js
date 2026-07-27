const fs = require('fs');
const path = require('path');

// Hedef dizini komut satırından al (Örn: node apply-fixes.js ../diger-proje)
const targetProjectDir = process.argv[2];

if (!targetProjectDir) {
  console.error("HATA: Lütfen hedef proje dizinini belirtin.");
  console.error("Kullanım: node apply-fixes.js <hedef-proje-dizini>");
  console.error("Örnek: node apply-fixes.js ../akademikmasa-clone");
  process.exit(1);
}

const sourceDir = __dirname;
const targetDir = path.resolve(process.cwd(), targetProjectDir);

if (!fs.existsSync(targetDir)) {
  console.error(`HATA: Hedef dizin bulunamadı: ${targetDir}`);
  process.exit(1);
}

// Aktarılacak kritik dosyaların listesi
const filesToSync = [
  "src/components/admin/DeleteConfirmModal.tsx", // Yeni oluşturulan dosya
  "src/components/admin/ProductModal.tsx",       // Kırpma iptal edilen dosya
  "src/app/admin/kuponlar/KuponlarClient.tsx",   // Modal entegre edilen
  "src/app/admin/kurslar/KurslarClient.tsx",     // Modal entegre edilen
  "src/app/admin/kullanicilar/actions.ts",       // createUser eklenen
  "src/app/admin/kullanicilar/KullanicilarClient.tsx", // Custom listbox + Ekle butonu
  "src/components/Header.tsx"                    // Mobil menü eklenen
];

let successCount = 0;

console.log("🚀 Akademik Masa Güncellemeleri Aktarılıyor...\n");

filesToSync.forEach(relativeFilePath => {
  const sourcePath = path.join(sourceDir, relativeFilePath);
  const targetPath = path.join(targetDir, relativeFilePath);

  if (fs.existsSync(sourcePath)) {
    // Hedef klasörleri yoksalar oluştur
    const targetFileDir = path.dirname(targetPath);
    if (!fs.existsSync(targetFileDir)) {
      fs.mkdirSync(targetFileDir, { recursive: true });
    }

    // Dosyayı kopyala
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Başarılı: ${relativeFilePath}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Hata (${relativeFilePath}):`, err.message);
    }
  } else {
    console.error(`⚠️ Uyarı: Kaynak dosya bulunamadı: ${sourcePath}`);
  }
});

console.log(`\n🎉 İşlem Tamamlandı! Toplam ${successCount} dosya başarıyla hedef projeye aktarıldı.`);
