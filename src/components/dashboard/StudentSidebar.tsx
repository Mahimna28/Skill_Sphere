"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Sparkles,
  School,
  UserCircle,
  Heart,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { isCommunityHubEnabled } from "@/lib/features";
import { SidebarItem, CommunityHubSidebarGroup } from "@/components/ui/SidebarItem";
import "@/styles/sidebar.css";

interface StudentSidebarProps {
  userName: string;
  unreadCount?: number;
  onLogout: () => void;
}

export default function StudentSidebar({
  userName = "Student User",
  unreadCount = 0,
  onLogout,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab");
  const hubEnabled = isCommunityHubEnabled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Automatically close mobile drawer on route transition
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  type NavItem = {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
  };

  const navItemsTop: NavItem[] = [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const navItemsBottom: NavItem[] = [
    { href: "/dashboard/student/ai-tutor", label: "AI Study Tutor", icon: Sparkles },
    { href: "/dashboard/student/institutions", label: "Institutions", icon: School },
    { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
    { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: unreadCount },
  ];

  const isItemActive = (href: string) => {
    if (href === "/dashboard/student") {
      return pathname === "/dashboard/student" || pathname === "/dashboard/student/overview";
    }
    if (href === "/dashboard/student/ai-tutor") {
      return pathname?.startsWith("/dashboard/student/ai-tutor") || pathname?.startsWith("/dashboard/student/aitutor");
    }
    if (href === "/dashboard/profile") {
      return pathname?.startsWith("/dashboard/profile") || pathname?.startsWith("/dashboard/student/profile");
    }
    if (href === "/dashboard/notifications") {
      return pathname?.startsWith("/dashboard/notifications") || pathname?.startsWith("/dashboard/student/notifications");
    }
    return pathname?.startsWith(href);
  };

  // Generate User Initials
  const initials = (userName || "Student User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const easing = [0.16, 1, 0.3, 1];

  const sidebarVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: easing,
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30, transition: { duration: 0.3 } },
  };

  const navItemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: easing },
    },
  };

  const sidebarContent = (
    <div
      className="sidebar-root glass-sidebar relative flex flex-col h-full select-none overflow-hidden"
      role="navigation"
      aria-label="Main sidebar"
    >
      {/* Brand Header */}
      <div className="relative z-10 px-3 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between mb-2">
        <Link href="/" className="flex items-center gap-3 group px-2">
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.08, rotate: [0, -4, 4, 0] }}
            transition={{ duration: 0.4, ease: easing }}
            className="relative w-8 h-8 rounded-xl overflow-hidden bg-white/40 dark:bg-white/10 backdrop-blur-md flex items-center justify-center border border-black/10 dark:border-white/20 shadow-sm shrink-0"
          >
            <Image
              src="/images/new-skill-sphere-logo.png"
              alt="Skill Sphere Logo"
              width={22}
              height={22}
              className="object-contain"
            />
          </motion.div>
          <span
            className="text-lg font-extrabold tracking-wide text-[#1E1B2E] dark:text-white group-hover:text-[#C9A96E] transition-colors truncate"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            Skill Sphere
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-gray-500 hover:text-black dark:hover:text-white rounded-lg transition-colors"
          aria-label="Close Menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Staggered Navigation Items List */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={sidebarVariants as any}
        className="sidebar-nav-scroll relative z-10 flex-1 space-y-1 overflow-y-auto pr-1"
      >
        {navItemsTop.map((item) => (
          <motion.div key={`${item.label}-${item.href}`} variants={navItemVariants as any}>
            <SidebarItem
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isItemActive(item.href)}
              badge={item.badge}
              shouldReduceMotion={shouldReduceMotion}
            />
          </motion.div>
        ))}

        <motion.div variants={navItemVariants as any}>
          <CommunityHubSidebarGroup />
        </motion.div>

        {/* Subtle Separator */}
        <div className="my-3 border-t border-black/5 dark:border-white/10 mx-2" />

        {navItemsBottom.map((item) => (
          <motion.div key={`${item.label}-${item.href}`} variants={navItemVariants as any}>
            <SidebarItem
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isItemActive(item.href)}
              badge={item.badge}
              shouldReduceMotion={shouldReduceMotion}
            />
          </motion.div>
        ))}
      </motion.nav>

      {/* Bottom Area: Inset Profile & Logout Card (matching reference image!) */}
      <div className="relative z-10 pt-3 mt-2 border-t border-black/5 dark:border-white/10">
        <div className="p-3 rounded-[18px] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-between gap-2.5 backdrop-blur-md shadow-inner">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C9A96E] to-[#E6CD98] text-[#1E1B2E] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/60 dark:ring-white/20">
              {initials}
            </div>
            <div className="min-w-0">
              <h4 className="font-sans text-xs font-bold text-[#1E1B2E] dark:text-white truncate leading-tight">
                {userName}
              </h4>
              <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#8E8E93]">
                Student
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-white/10 hover:bg-red-500 hover:text-white text-[#1E1B2E] dark:text-white font-bold text-xs shadow-sm border border-black/5 dark:border-white/10 transition-all duration-200 shrink-0 cursor-pointer"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Sidebar Card with Liquid Glass Aesthetics */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants as any}
        className="hidden md:flex md:w-60 md:flex-col md:fixed md:top-4 md:bottom-4 md:left-4 md:z-50 shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white/80 dark:bg-[#1E1B2E]/90 backdrop-blur-xl text-[#1E1B2E] dark:text-white border-b border-black/10 dark:border-white/10 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 relative shrink-0">
            <Image
              src="/images/new-skill-sphere-logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span
            className="font-bold text-lg text-[#1E1B2E] dark:text-white truncate"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            Skill Sphere
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#1E1B2E] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Slide-in Drawer with Glassmorphism & Spring Physics */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants as any}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden p-3"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
