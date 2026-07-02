"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";

export function HeaderFooterWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const hideHeaderFooter = isDashboard || isAuth;

  return (
    <>
      {!hideHeaderFooter && <Header />}
      
      <main className="flex-1">
        <div key={pathname}>
          {children}
        </div>
      </main>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}
