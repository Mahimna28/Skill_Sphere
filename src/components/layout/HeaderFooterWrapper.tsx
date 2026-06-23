"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function HeaderFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const hideHeaderFooter = isDashboard || isAuth;

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
