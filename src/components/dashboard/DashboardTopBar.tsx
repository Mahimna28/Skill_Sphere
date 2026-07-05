"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface DashboardTopBarProps {
  userRole?: string | null;
  userName?: string;
  unreadCount?: number;
}

export default function DashboardTopBar({
  userRole = "student",
  userName = "User",
  unreadCount = 0,
}: DashboardTopBarProps) {
  const pathname = usePathname();

  const formatRoleBadge = (role?: string | null) => {
    if (!role) return "STUDENT";
    const lower = role.toLowerCase();
    if (lower === "superadmin" || lower === "admin") return "SUPER ADMIN";
    if (lower === "institute_admin") return "INSTITUTE ADMIN";
    if (lower === "teacher") return "TEACHER";
    if (lower === "parent") return "PARENT";
    return "STUDENT";
  };

  const getPageTitle = (path: string | null) => {
    if (!path) return "Dashboard";
    if (path.includes("/courses")) return "Courses";
    if (path.includes("/leaderboard")) return "Leaderboard";
    if (path.includes("/ai-tutor") || path.includes("/aitutor")) return "AI Study Tutor";
    if (path.includes("/institutions") || path.includes("/institute")) return "Institutions";
    if (path.includes("/profile")) return "My Profile";
    if (path.includes("/feedback")) return "Feedback";
    if (path.includes("/notifications")) return "Notifications";
    if (path.includes("/students")) return "My Students";
    if (path.includes("/qa")) return "Q&A Forum";
    if (path.includes("/system")) return "System Control";
    if (path.includes("/promote")) return "Promote Admins";
    if (path.includes("/chat")) return "Messages";
    return "Overview";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[rgba(30,27,46,0.06)] px-4 sm:px-6 md:px-10 py-3.5 flex items-center justify-between gap-4 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Left side: Page Title */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <h2 className="text-xl font-bold text-[#1E1B2E] tracking-tight shrink-0 font-sans">
          {getPageTitle(pathname)}
        </h2>
      </div>

      {/* Right side: Role Badge, Bell Icon, Profile Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Role Badge in Header */}
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[rgba(201,169,110,0.12)] text-[#C9A96E] font-semibold text-[11px] tracking-wider uppercase border border-[rgba(201,169,110,0.2)] font-sans">
          {formatRoleBadge(userRole)}
        </span>

        {/* Bell Icon */}
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 rounded-full border-2 border-[rgba(30,27,46,0.08)] hover:border-[#C9A96E] transition-colors flex items-center justify-center text-[#1E1B2E] hover:text-[#C9A96E] bg-white sm:bg-transparent shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        
        {/* Avatar Placement: To the right of the bell icon */}
        <UserProfileDropdown />
      </div>
    </header>
  );
}
