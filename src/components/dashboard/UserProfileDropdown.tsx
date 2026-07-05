"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserProfileDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    image: string | null;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser({
              name: data.user.name || "User",
              email: data.user.email || "",
              role: data.user.role || "student",
              image: data.user.image || null,
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user session", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Handle outside click and escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsOpen(false);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse border-2 border-[rgba(30,27,46,0.08)]" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl border border-[#C9A96E] text-[#C9A96E] text-sm font-medium hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-colors font-sans flex items-center h-9"
      >
        Sign In
      </Link>
    );
  }

  const getRoleDisplayName = (r: string) => {
    const lower = r.toLowerCase();
    if (lower === "superadmin" || lower === "admin") return "Super Admin";
    if (lower === "institute_admin") return "Institute Admin";
    if (lower === "teacher") return "Teacher";
    if (lower === "parent") return "Parent";
    return "Student";
  };

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-dropdown-trigger w-9 h-9 rounded-full border-2 border-[rgba(30,27,46,0.08)] hover:border-[#C9A96E] transition-colors overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span className="text-sm font-heading text-[#C9A96E] bg-[rgba(201,169,110,0.15)] w-full h-full flex items-center justify-center font-semibold">
            {initials}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="user-dropdown-menu absolute right-0 top-[44px] z-50 bg-white rounded-2xl border border-[rgba(30,27,46,0.06)] shadow-[0_12px_40px_rgba(0,0,0,0.12)] min-w-[240px] py-2"
          >
            {/* Header Section */}
            <div className="px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-[#C9A96E] font-heading text-sm shrink-0 overflow-hidden border border-[rgba(201,169,110,0.2)]">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1E1B2E] truncate">{user.name}</p>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[rgba(201,169,110,0.12)] text-[#C9A96E] font-medium shrink-0">
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="h-px bg-[rgba(30,27,46,0.06)] mx-3 my-1" />

            {/* My Profile */}
            <Link
              href="/dashboard/profile"
              className="user-dropdown-item flex items-center gap-3 px-5 py-2.5 text-sm text-[#1E1B2E] hover:bg-[rgba(201,169,110,0.06)] hover:text-[#C9A96E] transition-colors rounded-lg mx-1.5"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-[#8E8E93]" />
              My Profile
            </Link>

            {/* Settings */}
            <Link
              href="/dashboard/settings"
              className="user-dropdown-item flex items-center gap-3 px-5 py-2.5 text-sm text-[#1E1B2E] hover:bg-[rgba(201,169,110,0.06)] hover:text-[#C9A96E] transition-colors rounded-lg mx-1.5"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 text-[#8E8E93]" />
              Settings
            </Link>

            <div className="h-px bg-[rgba(30,27,46,0.06)] mx-3 my-1" />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="user-dropdown-item danger flex items-center gap-3 px-5 py-2.5 text-sm text-[#DC2626] hover:bg-[rgba(220,38,38,0.06)] transition-colors rounded-lg w-[calc(100%-12px)] mx-1.5 text-left font-medium"
            >
              <LogOut className="w-4 h-4 text-[#DC2626]" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
