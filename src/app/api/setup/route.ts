import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "@/lib/prisma";

const execAsync = promisify(exec);

const INSTRUCTORS = [
  {
    name: "Zuhal Bedirhan",
    title: "4 Temel Beceri",
    branch: "4 Temel Beceri",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    motto: "Eğitimde sınırları zorlayan, yenilikçi yaklaşımlar.",
  },
  {
    name: "Harun Dinçoğlu",
    title: "Yeni Türk Edebiyatı",
    branch: "Yeni Türk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    motto: "Edebiyatın derinliklerinde yeni bir yolculuğa hazır mısınız?",
  },
  {
    name: "Dr. İlker Hayat",
    title: "Eski Türk Edebiyatı",
    branch: "Eski Türk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
    motto: "Geçmişin bilgeliğini günümüzün sınav stratejisiyle birleştiriyoruz.",
  },
  {
    name: "Bülent Hoca",
    title: "Halk Edebiyatı",
    branch: "Halk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    motto: "Halkın sesini, sınavın ritmiyle yakalayın.",
  },
  {
    name: "Gizem Ural",
    title: "Çocuk Edebiyatı",
    branch: "Çocuk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    motto: "Geleceğin öğretmenlerine ilham veren çocuk edebiyatı dersleri.",
  },
  {
    name: "Mehmet Fatih Muş",
    title: "Edebiyat Teorileri",
    branch: "Edebiyat Teorileri",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    motto: "Teoriyi pratiğe, bilgiyi nete dönüştürmenin formülü.",
  },
  {
    name: "Soner Özkan",
    title: "Dil Bilim",
    branch: "Dil Bilim",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    motto: "Dilin şifrelerini çözüyor, sınavda fark yaratıyoruz.",
  },
  {
    name: "Murat Aytekin",
    title: "Eski Türk Edebiyatı",
    branch: "Eski Türk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1999&auto=format&fit=crop",
    motto: "Edebiyat tarihini ezberletmiyor, yaşatıyoruz.",
  },
  {
    name: "Ayşe Yılmaz",
    title: "Eğitim Bilimleri",
    branch: "Eğitim Bilimleri",
    department: "MEB-AGS",
    imageUrl: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=1936&auto=format&fit=crop",
    motto: "Eğitim bilimlerinde ezberi bozan, akılda kalıcı yöntemler.",
  }
];

export async function GET() {
  try {
    // 1. Run prisma db push to sync the schema
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss");
    
    // 2. Clear existing instructors just in case
    await prisma.instructor.deleteMany({});
    
    // 3. Seed new instructors
    for (const inst of INSTRUCTORS) {
      await prisma.instructor.create({
        data: inst
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database synced and instructors seeded successfully!",
      stdout 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error)
    }, { status: 500 });
  }
}
