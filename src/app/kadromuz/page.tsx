import { prisma } from "@/lib/prisma";
import KadromuzClient from "./KadromuzClient";

export const metadata = {
  title: "Kadromuz | Akademik Masa",
  description: "Türkiye'nin dört bir yanındaki binlerce adayı hedeflerine ulaştıran duayen eğitim kadromuzla tanışın.",
};

const STATIC_INSTRUCTORS = [
  {
    id: "static-1",
    name: "Zuhal Bedirhan",
    title: "4 Temel Beceri",
    branch: "4 Temel Beceri",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    motto: "Eğitimde sınırları zorlayan, yenilikçi yaklaşımlar.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-2",
    name: "Harun Dinçoğlu",
    title: "Yeni Türk Edebiyatı",
    branch: "Yeni Türk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    motto: "Edebiyatın derinliklerinde yeni bir yolculuğa hazır mısınız?",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-3",
    name: "Dr. İlker Hayat",
    title: "Eski Türk Edebiyatı",
    branch: "Eski Türk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
    motto: "Geçmişin bilgeliğini günümüzün sınav stratejisiyle birleştiriyoruz.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-4",
    name: "Bülent Hoca",
    title: "Halk Edebiyatı",
    branch: "Halk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    motto: "Halkın sesini, sınavın ritmiyle yakalayın.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-5",
    name: "Gizem Ural",
    title: "Çocuk Edebiyatı",
    branch: "Çocuk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    motto: "Geleceğin öğretmenlerine ilham veren çocuk edebiyatı dersleri.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-6",
    name: "Mehmet Fatih Muş",
    title: "Edebiyat Teorileri",
    branch: "Edebiyat Teorileri",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    motto: "Teoriyi pratiğe, bilgiyi nete dönüştürmenin formülü.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-7",
    name: "Soner Özkan",
    title: "Dil Bilim",
    branch: "Dil Bilim",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    motto: "Dilin şifrelerini çözüyor, sınavda fark yaratıyoruz.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-8",
    name: "Murat Aytekin",
    title: "Eski Türk Edebiyatı",
    branch: "Eski Türk Edebiyatı",
    department: "Türkçe ÖABT",
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1999&auto=format&fit=crop",
    motto: "Edebiyat tarihini ezberletmiyor, yaşatıyoruz.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "static-9",
    name: "Ayşe Yılmaz",
    title: "Eğitim Bilimleri",
    branch: "Eğitim Bilimleri",
    department: "MEB-AGS",
    imageUrl: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=1936&auto=format&fit=crop",
    motto: "Eğitim bilimlerinde ezberi bozan, akılda kalıcı yöntemler.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default async function KadromuzPage() {
  const instructors = await prisma.instructor.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const finalInstructors = instructors.length > 0 ? instructors : STATIC_INSTRUCTORS;

  return <KadromuzClient instructors={finalInstructors as any} />;
}
