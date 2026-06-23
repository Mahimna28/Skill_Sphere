"use client";

import Link from "next/link";
import { MessageCircle, Camera, Mail, Globe } from "lucide-react";
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
    <footer className="bg-[#1E1B2E] text-[#F5F1EB] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-heading font-black text-3xl tracking-tight text-white">
                Skill Sphere.
              </span>
            </Link>
            <p className="font-sans text-[#F5F1EB]/70 leading-relaxed mb-8">
              Education, crafted for how you think. An AI-powered learning platform designed for the next generation.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="text-white/60 hover:text-[#C9A96E] transition-colors duration-200">
                <MessageCircle size={20} />
              </Link>
              <Link href="#" className="text-white/60 hover:text-[#C9A96E] transition-colors duration-200">
                <Globe size={20} />
              </Link>
              <Link href="#" className="text-white/60 hover:text-[#C9A96E] transition-colors duration-200">
                <Camera size={20} />
              </Link>
              <Link href="#" className="text-white/60 hover:text-[#C9A96E] transition-colors duration-200">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Platform</h4>
            <ul className="flex flex-col gap-4 font-sans text-[#F5F1EB]/70">
              <li><Link href="/" className="hover:text-[#C9A96E] transition-colors">Home</Link></li>
              <li><Link href="/features" className="hover:text-[#C9A96E] transition-colors">Features</Link></li>
              <li><Link href="/courses" className="hover:text-[#C9A96E] transition-colors">All Courses</Link></li>
              <li><Link href="/pricing" className="hover:text-[#C9A96E] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Resources</h4>
            <ul className="flex flex-col gap-4 font-sans text-[#F5F1EB]/70">
              <li><Link href="/blog" className="hover:text-[#C9A96E] transition-colors">Blog</Link></li>
              <li><Link href="/help" className="hover:text-[#C9A96E] transition-colors">Help Center</Link></li>
              <li><Link href="/guides" className="hover:text-[#C9A96E] transition-colors">Student Guides</Link></li>
              <li><Link href="/contact" className="hover:text-[#C9A96E] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal & Account */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">{userRole ? "Account" : "Legal"}</h4>
            <ul className="flex flex-col gap-4 font-sans text-[#F5F1EB]/70">
              {userRole ? (
                <>
                  <li><Link href={["superadmin", "institute_admin"].includes(userRole) ? "/dashboard/admin" : `/dashboard/${userRole}`} className="hover:text-[#C9A96E] transition-colors">Dashboard</Link></li>
                  <li><Link href="/profile" className="hover:text-[#C9A96E] transition-colors">Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/privacy" className="hover:text-[#C9A96E] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#C9A96E] transition-colors">Terms of Service</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-sm text-[#F5F1EB]/50">
            &copy; {currentYear} Skill Sphere. All Rights Reserved.
          </p>
          <p className="font-heading italic text-[#C9A96E]">
            Crafted with care
          </p>
        </div>
      </div>
    </footer>
  );
}
