"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Sparkles,
  School,
  Heart,
  Home,
  Menu,
  X,
  Users,
  HelpCircle,
  MessageSquare,
  Settings,
  ShieldAlert,
  Shield,
  PenTool,
} from "lucide-react";
import { isCommunityHubEnabled } from "@/lib/features";
import { SidebarItem, CommunityHubSidebarGroup } from "@/components/ui/SidebarItem";
import "@/styles/sidebar.css";

interface StudentSidebarProps {
  userName?: string;
  userRole?: string;
  userImage?: string | null;
  unreadCount?: number;
  onLogout: () => void;
}

export default function StudentSidebar({
  userName = "Student User",
  userRole = "student",
  userImage = null,
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

  // Determine nav items based on userRole
  const getNavItems = () => {
    if (userRole === "teacher") {
      return {
        top: [
          { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/teacher/courses", label: "Manage Courses", icon: BookOpen },
          { href: "/dashboard/teacher/students", label: "My Students", icon: Users },
          { href: "/dashboard/teacher/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/teacher/blog", label: "Upload Blog", icon: PenTool },
        ] as NavItem[],
        bottom: [
          { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
        ] as NavItem[],
      };
    }

    if (userRole === "parent") {
      return {
        top: [
          { href: "/dashboard/parent", label: "Overview", icon: LayoutDashboard },
        ] as NavItem[],
        bottom: [
          { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
        ] as NavItem[],
      };
    }

    if (userRole === "superadmin" || userRole === "admin") {
      return {
        top: [
          { href: "/dashboard/admin", label: "Master Panel", icon: LayoutDashboard },
          { href: "/dashboard/admin/system", label: "System Control", icon: Settings },
          { href: "/dashboard/admin/courses", label: "Global Courses", icon: BookOpen },
          { href: "/dashboard/admin/feedback", label: "Review Feedback", icon: Heart },
          { href: "/dashboard/admin/promote", label: "Promote Admins", icon: ShieldAlert },
          { href: "/dashboard/admin/blog", label: "Upload Blog", icon: PenTool },
        ] as NavItem[],
        bottom: [
          { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
        ] as NavItem[],
      };
    }

    if (userRole === "institute_admin") {
      return {
        top: [
          { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/teacher/courses", label: "Manage Courses", icon: BookOpen },
          { href: "/dashboard/teacher/students", label: "My Students", icon: Users },
          { href: "/dashboard/teacher/institutions", label: "Institutions", icon: School },
          { href: "/dashboard/admin/institute", label: "My Institute", icon: Shield },
          { href: "/dashboard/teacher/blog", label: "Upload Blog", icon: PenTool },
        ] as NavItem[],
        bottom: [
          { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
        ] as NavItem[],
      };
    }

    // Default: Student Portal
    return {
      top: [
        { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/student/courses", label: "My Courses", icon: BookOpen },
        { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
      ] as NavItem[],
      bottom: [
        { href: "/dashboard/student/ai-tutor", label: "AI Study Tutor", icon: Sparkles },
        { href: "/dashboard/student/institutions", label: "Institutions", icon: School },
        { href: "/dashboard/feedback", label: "Give Feedback", icon: Heart },
      ] as NavItem[],
    };
  };

  const navItems = getNavItems();

  const isItemActive = (href: string) => {
    if (href === "/dashboard/student" || href === "/dashboard/teacher" || href === "/dashboard/parent" || href === "/dashboard/admin") {
      return pathname === href || pathname === `${href}/overview`;
    }
    if (href === "/dashboard/student/ai-tutor") {
      return pathname?.startsWith("/dashboard/student/ai-tutor") || pathname?.startsWith("/dashboard/student/aitutor");
    }
    if (href === "/dashboard/admin/courses") {
      return pathname?.startsWith("/dashboard/admin/courses") || 
             (pathname?.startsWith("/dashboard/teacher/courses/") && pathname !== "/dashboard/teacher/courses");
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };



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
      {/* Top Brand Area: "Skill Sphere" logo — Playfair Display, 20px, white */}
      <div className="relative z-10 px-3 py-5 border-b border-[rgba(255,255,255,0.08)] mb-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="block">
            <span
              className="text-[20px] font-bold tracking-tight text-white font-heading"
            >
              Skill Sphere
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
        {navItems.top.map((item) => (
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

        {/* Community Hub for everyone */}
        <motion.div variants={navItemVariants as any}>
          <CommunityHubSidebarGroup userRole={userRole} />
        </motion.div>

        <div className="my-2 border-t border-[rgba(255,255,255,0.08)] mx-2" />

        {navItems.bottom.map((item) => (
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

        {/* Bottom Section: Home Button (replacing user info) */}
        <div className="mt-auto pt-3 border-t border-[rgba(255,255,255,0.08)] px-2 pb-2">
          <SidebarItem
            href="/"
            label="Home"
            icon={Home}
            active={pathname === "/"}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      </motion.nav>
    </div>
  );

  return (
    <>
      {/* Desktop Native macOS Vibrant Sidebar (Exact 260px Width) */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sidebarVariants as any}
        className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:top-0 md:bottom-0 md:left-0 md:z-50 shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#1E1B2E] text-white border-b border-[rgba(255,255,255,0.08)] sticky top-0 z-40">
        <Link href="/" className="block">
          <span
            className="font-bold text-[20px] text-white tracking-tight font-heading"
          >
            Skill Sphere
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

      {/* Mobile Slide-in Drawer */}
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
