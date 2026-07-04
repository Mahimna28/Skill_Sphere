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
      {/* Top Brand Area: Only SkillSphere in big bold letters, no logo */}
      <div className="relative z-10 px-3 py-5 border-b border-white/10 mb-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="block">
            <span
              className="text-2xl font-black tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading, serif)" }}
            >
              SkillSphere
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-white/60 hover:text-white rounded transition-colors"
            aria-label="Close Menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Staggered Navigation Items List */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={sidebarVariants as any}
        className="sidebar-nav-scroll relative z-10 flex-1 space-y-0.5 overflow-y-auto pr-1 flex flex-col"
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

        <div className="my-2 border-t border-white/10 mx-2" />

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

        {/* Bottom Section: Notifications, User Info & Reddish Logout Button */}
        <div className="mt-auto pt-3 border-t border-white/10 space-y-2">
          <SidebarItem
            href="/dashboard/notifications"
            label="Notifications"
            icon={Bell}
            active={isItemActive("/dashboard/notifications")}
            badge={unreadCount}
            shouldReduceMotion={shouldReduceMotion}
          />

          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-9 h-9 rounded-full bg-[#C9A96E] text-[#1E1B2E] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate leading-tight">
                  {userName}
                </h4>
                <span className="block text-[10px] font-bold text-[#C9A96E] tracking-wider uppercase truncate mt-0.5">
                  LEVEL 2 EXPLORER
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 transition-all duration-200 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>
    </div>
  );

  return (
    <>
      {/* Desktop Native macOS Vibrant Sidebar (Exact 280px Width) */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants as any}
        className="hidden md:flex md:w-[280px] md:flex-col md:fixed md:top-0 md:bottom-0 md:left-0 md:z-50 shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Top Header: Only SkillSphere heading in bold letters */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#1E1B2E] text-white border-b border-white/10 sticky top-0 z-40">
        <Link href="/" className="block">
          <span
            className="font-black text-xl text-white tracking-tight"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            SkillSphere
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
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
