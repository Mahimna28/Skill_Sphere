"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode, useEffect } from "react";

export function HeaderFooterWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isCertificates = pathname?.startsWith("/certificates");
  const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const hideHeaderFooter = isDashboard || isAuth;

  useEffect(() => {
    if (hideHeaderFooter) {
      const main = document.querySelector("main");
      if (main) main.style.marginBottom = "0px";
      return;
    }
    
    const setMargin = () => {
      const main = document.querySelector("main");
      const footer = document.querySelector("footer");
      if (main && footer) {
        main.style.marginBottom = `${footer.offsetHeight}px`;
      }
    };
    
    setMargin();
    // Re-calculate after a slight delay in case content shifts
    setTimeout(setMargin, 100);
    setTimeout(setMargin, 500);
    
    window.addEventListener("resize", setMargin);
    return () => window.removeEventListener("resize", setMargin);
  }, [hideHeaderFooter, pathname]);

  if (hideHeaderFooter) {
    return (
      <main className="flex-1">
        <div key={pathname}>{children}</div>
      </main>
    );
  }

  return (
    <>
      <main className={`flex-1 relative z-[2] ${isCertificates ? 'bg-[#0F0D1A]' : 'bg-[#F5F1EB]'} shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
        <Header />
        <div key={pathname}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
