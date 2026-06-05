"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.user.role);
        }
      } catch (err) {
        console.error("Failed to fetch user role");
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-40 h-12 transition-transform group-hover:scale-105">
            <Image 
              src="/images/logo-v2.png" 
              alt="Skill Sphere" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="hidden md:flex items-center gap-10 font-black uppercase tracking-widest text-sm absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center gap-1 hover:text-[#4F7DF3] transition-colors group">
            <Home className="w-4 h-4 mb-0.5 group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <Link href="/features" className="hover:text-[#4F7DF3] transition-colors">Features</Link>
          <Link href="/courses" className="hover:text-[#4F7DF3] transition-colors">Courses</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {userRole ? (
            <Link href={["superadmin", "institute_admin"].includes(userRole) ? "/dashboard/admin" : `/dashboard/${userRole}`}>
              <Button className="font-black neo-brutalism bg-[#34D399] h-10 px-6 text-white">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" className="font-black border-4 border-black h-10 px-4 hover:bg-black hover:text-white transition-all">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="font-black neo-brutalism bg-[#4F7DF3] h-10 px-6 text-white">Join Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
