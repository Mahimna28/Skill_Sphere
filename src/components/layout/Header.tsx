"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user.role);
        }
      } catch { /* not logged in */ }
    };
    fetchUser();
  }, []);

  const dashboardPath = ["superadmin", "institute_admin"].includes(userRole ?? "")
    ? "/dashboard/admin"
    : `/dashboard/${userRole}`;

  return (
    <header className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <div className="relative w-32 md:w-40 h-10 md:h-12 transition-transform group-hover:scale-105">
            <Image
              src="/images/logo-v2.png"
              alt="Skill Sphere"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation — centered */}
        <nav className="hidden md:flex items-center gap-10 font-black uppercase tracking-widest text-sm absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center gap-1 hover:text-[#4F7DF3] transition-colors group">
            <Home className="w-4 h-4 mb-0.5 group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <Link href="/features" className="hover:text-[#4F7DF3] transition-colors">Features</Link>
          <Link href="/courses" className="hover:text-[#4F7DF3] transition-colors">Courses</Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {userRole ? (
            <Link href={dashboardPath}>
              <Button className="font-black neo-brutalism bg-[#34D399] h-10 px-6 text-white">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="font-black border-4 border-black h-10 px-4 hover:bg-black hover:text-white transition-all">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="font-black neo-brutalism bg-[#4F7DF3] h-10 px-6 text-white">Join Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: auth button + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {userRole ? (
            <Link href={dashboardPath}>
              <Button size="sm" className="font-black neo-brutalism bg-[#34D399] text-white px-3 h-9 text-xs">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline" className="font-black border-2 border-black h-9 px-3 text-xs">Login</Button>
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t-4 border-black bg-white animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col px-4 py-4 gap-1 font-black uppercase tracking-widest text-sm">
            <Link href="/" className="flex items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors">
              <Home size={16} /> Home
            </Link>
            <Link href="/features" className="p-3 rounded-xl hover:bg-muted transition-colors">Features</Link>
            <Link href="/courses" className="p-3 rounded-xl hover:bg-muted transition-colors">Courses</Link>
            {!userRole && (
              <Link href="/register" className="mt-2">
                <Button className="w-full neo-brutalism bg-[#4F7DF3] text-white font-black">Join Free</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
