"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function MainLayout({ children, footerContent, whatsappButton }: { children: React.ReactNode, footerContent: React.ReactNode, whatsappButton: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/panel");

  if (isDashboard) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      {footerContent}
      {whatsappButton}
    </>
  );
}
