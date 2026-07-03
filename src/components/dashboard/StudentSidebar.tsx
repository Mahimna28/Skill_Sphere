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
  MessageSquare,
  Sparkles,
  School,
  HelpCircle,
  UserCircle,
  Heart,
  Bell,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { isCommunityHubEnabled } from "@/lib/features";

// Global easing and physics
const easing = [0.25, 0.1, 0.25, 1.0] as any;

interface StudentSidebarProps {
  userName?: string;
  userEmail?: string;
  unreadCount?: number;
  onLogout: () => void;
}

export default function StudentSidebar({
  userName = "Student User",
  userEmail = "student@skillsphere.edu",
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

  const navItems = [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/courses", label: "My Courses", icon: BookOpen },
    { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
    ...(hubEnabled
      ? [
          { href: "/dashboard/student/community?tab=chat", label: "Community Hub", icon: Users },
          { href: "/dashboard/student/community?tab=chat", label: "Course Chat", icon: MessageSquare },
          { href: "/dashboard/student/ai-tutor", label: "AI Study Tutor", icon: Sparkles },
          { href: "/dashboard/student/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/student/community?tab=forum", label: "Q&A Forum", icon: HelpCircle },
          { href: "/dashboard/student/community?tab=messages", label: "Messages", icon: MessageSquare },
        ]
      : [
          { href: "/dashboard/student/chat", label: "Course Chat", icon: MessageSquare },
          { href: "/dashboard/student/ai-tutor", label: "AI Study Tutor", icon: Sparkles },
          { href: "/dashboard/student/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/qa", label: "Q&A Forum", icon: HelpCircle },
          { href: "/dashboard/chat/direct", label: "Messages", icon: MessageSquare },
        ]),
    { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
    { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: unreadCount },
  ];

  const isItemActive = (href: string) => {
    if (href === "/dashboard/student") {
      return pathname === "/dashboard/student" || pathname === "/dashboard/student/overview";
    }
    if (href === "/dashboard/student/community") {
      return pathname?.startsWith("/dashboard/student/community") && !currentTab;
    }
    if (href === "/dashboard/student/community?tab=chat") {
      return pathname?.startsWith("/dashboard/student/community") && (currentTab === "chat" || !currentTab);
    }
    if (href === "/dashboard/student/community?tab=forum") {
      return pathname?.startsWith("/dashboard/student/community") && currentTab === "forum";
    }
    if (href === "/dashboard/student/community?tab=messages") {
      return pathname?.startsWith("/dashboard/student/community") && currentTab === "messages";
    }
    if (href === "/dashboard/student/ai-tutor") {
      return pathname?.startsWith("/dashboard/student/ai-tutor") || pathname?.startsWith("/dashboard/student/aitutor");
    }
    if (href === "/dashboard/qa") {
      return pathname?.startsWith("/dashboard/qa") || pathname?.startsWith("/dashboard/student/forum");
    }
    if (href === "/dashboard/chat/direct") {
      return pathname?.startsWith("/dashboard/chat/direct") || pathname?.startsWith("/dashboard/student/messages");
    }
    if (href === "/dashboard/profile") {
      return pathname?.startsWith("/dashboard/profile") || pathname?.startsWith("/dashboard/student/profile");
    }
    if (href === "/dashboard/notifications") {
      return pathname?.startsWith("/dashboard/notifications") || pathname?.startsWith("/dashboard/student/notifications");
    }
    return pathname?.startsWith(href);
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Framer Motion Variants for Sidebar Entrance & Child Staggering
  const sidebarVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0.2 }
        : {
            type: "spring",
            stiffness: 200,
            damping: 25,
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
    },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          x: "-100%",
          opacity: 0,
          transition: { duration: 0.25, ease: easing },
        },
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
    <div className="relative flex flex-col h-full bg-gradient-to-b from-[#1E1B2E]/95 via-[#1E1B2E]/90 to-[#1E1B2E]/95 backdrop-blur-2xl text-[#FFFFFF] border-r border-[#FFFFFF]/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] select-none overflow-hidden">
      {/* Ambient Glass Orb Highlights */}
      <div className="absolute top-10 -left-16 w-48 h-48 bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-16 w-56 h-56 bg-[#4F7DF3]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 px-6 py-6 border-b border-[#FFFFFF]/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.08, rotate: [0, -4, 4, 0] }}
            transition={{ duration: 0.4, ease: easing }}
            className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#FFFFFF]/10 backdrop-blur-md flex items-center justify-center border border-[#C9A96E]/40 group-hover:border-[#C9A96E] shadow-[0_4px_12px_rgba(201,169,110,0.2)] transition-colors shrink-0"
          >
            <Image
              src="/images/new-skill-sphere-logo.png"
              alt="Skill Sphere Logo"
              width={26}
              height={26}
              className="object-contain"
            />
          </motion.div>
          <span
            className="text-xl font-bold tracking-wide text-[#FFFFFF] group-hover:text-[#C9A96E] transition-colors truncate"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            Skill Sphere
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 text-[#8E8E93] hover:text-[#FFFFFF] rounded-lg transition-colors"
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
        className="relative z-10 flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FFFFFF]/10"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href);

          return (
            <motion.div key={item.href} variants={navItemVariants as any}>
              <Link href={item.href} className="block">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: 3 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2, ease: easing }}
                  className={`relative group flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-medium overflow-hidden transition-all duration-300 cursor-pointer ${
                    active
                      ? "text-[#C9A96E] font-semibold"
                      : "text-[#8E8E93] hover:text-[#FFFFFF]"
                  }`}
                >
                  {/* Liquid Glass Ripple Background Highlight */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      active
                        ? "bg-[#F5F1EB]/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                        : "opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#FFFFFF]/10 via-[#FFFFFF]/5 to-transparent backdrop-blur-sm"
                    }`}
                  />

                  {/* Pulsing Gold Left Accent Border for Active Item */}
                  {active ? (
                    <motion.div
                      layoutId="activeLeftBorder"
                      className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#C9A96E] shadow-[0_0_12px_#C9A96E]"
                      animate={{ opacity: [0.85, 1, 0.85], scaleY: [0.95, 1, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#C9A96E] opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  )}

                  <div className="relative z-10 flex items-center gap-3.5 pl-1.5">
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { rotateZ: [-3, 3, 0], scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors duration-300 ${
                          active
                            ? "text-[#C9A96E] drop-shadow-[0_0_8px_rgba(201,169,110,0.5)]"
                            : "text-[#8E8E93] group-hover:text-[#FFFFFF]"
                        }`}
                      />
                    </motion.div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {/* Notification Badge */}
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-[#C9A96E] to-[#E5C992] text-[#1E1B2E] shadow-[0_2px_8px_rgba(201,169,110,0.4)]"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Bottom Area: Logout & User Profile */}
      <div className="relative z-10 p-4 border-t border-[#FFFFFF]/10 space-y-3 bg-[#1E1B2E]/40 backdrop-blur-xl">
        {/* Logout CTA */}
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: 2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onLogout}
          className="w-full relative group overflow-hidden flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-sans text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all cursor-pointer border border-transparent hover:border-red-500/30"
        >
          <LogOut size={18} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </motion.button>

        {/* Liquid Glass User Mini-Profile Card */}
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-[#FFFFFF]/10 to-[#FFFFFF]/5 backdrop-blur-xl border border-[#FFFFFF]/15 flex items-center gap-3.5 overflow-hidden shadow-lg cursor-pointer"
        >
          {/* Reflection Sweep Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* Avatar Circle with Hover Tilt */}
          <motion.div
            whileHover={shouldReduceMotion ? {} : { rotate: [-5, 5, 0], scale: 1.08 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A96E] to-[#E6CD98] text-[#1E1B2E] font-bold text-sm flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(201,169,110,0.3)] ring-2 ring-[#FFFFFF]/20"
          >
            {initials}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h4 className="font-sans text-sm font-bold text-[#FFFFFF] truncate leading-tight group-hover:text-[#C9A96E] transition-colors">
              {userName}
            </h4>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E]">
              Student
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar with Spring Entrance Animation */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants as any}
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50 shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#1E1B2E]/95 backdrop-blur-xl text-[#FFFFFF] border-b border-[#FFFFFF]/10 sticky top-0 z-40">
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
            className="font-bold text-lg text-[#FFFFFF] truncate"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            Skill Sphere
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#FFFFFF] hover:bg-[#FFFFFF]/10 rounded-xl transition-colors"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants as any}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
