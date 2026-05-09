"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Code, Share2, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
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
    <footer className="border-t-4 border-black bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="relative w-48 h-12 mb-6">
              <Image src="/images/logo-v2.png" alt="Skill Sphere" fill className="object-contain" />
            </div>
            <p className="font-bold text-muted-foreground leading-relaxed mb-6">
              AI-powered Learning Management System designed for the next generation of professionals.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 border-2 border-black rounded-lg hover:bg-[#F5C84C] transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 border-2 border-black rounded-lg hover:bg-[#4F7DF3] hover:text-white transition-colors">
                <Code className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 border-2 border-black rounded-lg hover:bg-[#34D399] transition-colors">
                <Share2 className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-tighter text-xl mb-6">Platform</h4>
            <ul className="flex flex-col gap-4 font-bold">
              <li><Link href="/" className="hover:text-[#4F7DF3] transition-colors">Home</Link></li>
              <li><Link href="/features" className="hover:text-[#4F7DF3] transition-colors">Features</Link></li>
              <li><Link href="/courses" className="hover:text-[#4F7DF3] transition-colors">All Courses</Link></li>
              <li><Link href="/about" className="hover:text-[#4F7DF3] transition-colors">About Team</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-black uppercase tracking-tighter text-xl mb-6">{userRole ? "My Account" : "Join Us"}</h4>
            <ul className="flex flex-col gap-4 font-bold">
              {userRole ? (
                <li><Link href={`/dashboard/${userRole}`} className="hover:text-[#4F7DF3] transition-colors">Dashboard</Link></li>
              ) : (
                <>
                  <li><Link href="/login" className="hover:text-[#4F7DF3] transition-colors">Login</Link></li>
                  <li><Link href="/register" className="hover:text-[#4F7DF3] transition-colors">Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black uppercase tracking-tighter text-xl mb-6">Stay Connected</h4>
            <p className="font-bold text-muted-foreground mb-4">Get the latest updates and course drops.</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold">
                <Mail className="w-5 h-5 text-[#4F7DF3]" />
                <span>skillspheretest@gmail.com</span>
              </div>
              <div className="mt-4">
                <Link href="/register">
                  <div className="inline-block bg-[#F5C84C] border-2 border-black px-4 py-2 font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                    Subscribe Now
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-black text-xs uppercase tracking-[0.2em] opacity-60 text-center md:text-left">
            &copy; {currentYear} Skill Sphere. All Rights Reserved.
          </p>
          <div className="flex gap-8 font-bold text-xs uppercase opacity-60">
            <Link href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
