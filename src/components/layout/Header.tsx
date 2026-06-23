"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, BookOpen, Sparkles, Newspaper, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardPath = ["superadmin", "institute_admin"].includes(userRole ?? "")
    ? "/dashboard/admin"
    : `/dashboard/${userRole}`;

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled && !menuOpen;

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-400 apple-ease",
      isTransparent ? "bg-transparent py-6" : "bg-[#1E1B2E]/85 backdrop-blur-xl py-4 shadow-[0_4px_24px_rgba(30,27,46,0.08)] border-b border-white/5"
    )}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <span className="font-heading font-black text-2xl tracking-tight text-white transition-transform group-hover:scale-105">
            Skill Sphere.
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-sans font-medium text-sm absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={cn(
            "flex items-center gap-1 transition-colors group",
            isTransparent ? "text-white/90 hover:text-white" : "text-[#F5F1EB]/80 hover:text-[#C9A96E]"
          )}>
            Home
          </Link>
          <Link href="/features" className={cn(
            "transition-colors",
            isTransparent ? "text-white/90 hover:text-white" : "text-[#F5F1EB]/80 hover:text-[#C9A96E]"
          )}>
            Features
          </Link>
          <Link href="/courses" className={cn(
            "transition-colors",
            isTransparent ? "text-white/90 hover:text-white" : "text-[#F5F1EB]/80 hover:text-[#C9A96E]"
          )}>
            Courses
          </Link>
          <Link href="/blog" className={cn(
            "transition-colors",
            isTransparent ? "text-white/90 hover:text-white" : "text-[#F5F1EB]/80 hover:text-[#C9A96E]"
          )}>
            Blog
          </Link>
          <Link href="/about" className={cn(
            "transition-colors",
            isTransparent ? "text-white/90 hover:text-white" : "text-[#F5F1EB]/80 hover:text-[#C9A96E]"
          )}>
            About
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {userRole ? (
            <Link href={dashboardPath}>
              <Button variant="default">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Log in</Button>
              </Link>
              <Link href="/register">
                <Button variant="default">Join Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1E1B2E] border-t border-white/10 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col px-4 py-6 gap-4 font-sans font-medium text-sm text-[#F5F1EB]">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Home size={18} className="text-[#C9A96E]" /> Home
            </Link>
            <Link href="/features" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Sparkles size={18} className="text-[#C9A96E]" /> Features
            </Link>
            <Link href="/courses" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <BookOpen size={18} className="text-[#C9A96E]" /> Courses
            </Link>
            <Link href="/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Newspaper size={18} className="text-[#C9A96E]" /> Blog
            </Link>
            <Link href="/about" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <Info size={18} className="text-[#C9A96E]" /> About
            </Link>
            
            <div className="h-px bg-white/10 my-2" />
            
            {userRole ? (
              <Link href={dashboardPath}>
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Join Free</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
