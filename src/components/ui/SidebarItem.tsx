"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Users, MessageSquare, HelpCircle, MessageCircle } from "lucide-react";

export interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  badge?: number;
  shouldReduceMotion?: boolean;
}

export function SidebarItem({
  href,
  label,
  icon: Icon,
  active = false,
  badge,
}: SidebarItemProps) {
  return (
    <Link href={href} className="block relative">
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 bg-[rgba(201,169,110,0.08)] border-l-[3px] border-[#C9A96E] rounded-[4px]"
          initial={false}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <div className={`sidebar-item-glass relative z-10 ${active ? "active" : ""}`}>
        <div className="flex items-center gap-3 min-w-0 w-full">
          <div className="sidebar-icon-badge">
            <Icon size={16} />
          </div>
          <span className="tracking-tight truncate flex-1">{label}</span>
        </div>

        {/* Notification Badge */}
        {typeof badge === "number" && badge > 0 && (
          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-[#C9A96E] to-[#E5C992] text-[#1E1B2E] shadow-sm ml-auto shrink-0">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export function CommunityHubSidebarGroup({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab");

  const isChatActive =
    Boolean(pathname?.startsWith("/dashboard/student/chat")) ||
    (Boolean(pathname?.startsWith("/dashboard/student/community")) &&
      (currentTab === "chat" || !currentTab));
  const isForumActive =
    Boolean(pathname?.startsWith("/dashboard/qa")) ||
    Boolean(pathname?.startsWith("/dashboard/student/forum")) ||
    (Boolean(pathname?.startsWith("/dashboard/student/community")) && currentTab === "forum");
  const isMessagesActive =
    Boolean(pathname?.startsWith("/dashboard/chat/direct")) ||
    Boolean(pathname?.startsWith("/dashboard/student/messages")) ||
    (Boolean(pathname?.startsWith("/dashboard/student/community")) && currentTab === "messages");

  const isChildActive = isChatActive || isForumActive || isMessagesActive;

  const [open, setOpen] = useState<boolean>(isChildActive);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("sidebar_community_hub_open");
      if (stored !== null) {
        setOpen(stored === "true" || isChildActive);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("sidebar_community_hub_open", String(open));
    } catch {}
  }, [open, isMounted]);

  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div className={`sidebar-group ${open ? "open" : ""} ${isChildActive ? "active" : ""}`}>
      <button
        type="button"
        className="sidebar-group-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="sidebar-icon-badge">
            <Users size={16} />
          </div>
          <span className="sidebar-label tracking-tight truncate">Community Hub</span>
        </div>
        <span className={`chevron ${open ? "open" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      <div
        className={`sidebar-group-children ${open ? "open" : ""}`}
        role="group"
        aria-hidden={!open}
      >
        {userRole !== "parent" && (
          <Link
            href="/dashboard/student/chat"
            className={`sidebar-child relative ${isChatActive ? "active" : ""}`}
            aria-current={isChatActive ? "page" : undefined}
          >
            {isChatActive && (
              <motion.div
                layoutId="sidebar-active-indicator-child"
                className="absolute inset-0 bg-[#C9A96E] rounded-md"
                initial={false}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-3 min-w-0 w-full">
              <MessageCircle size={15} className="shrink-0 opacity-80" />
              <span>Chat</span>
            </div>
          </Link>
        )}
        <Link
          href="/dashboard/qa"
          className={`sidebar-child relative ${isForumActive ? "active" : ""}`}
          aria-current={isForumActive ? "page" : undefined}
        >
          {isForumActive && (
            <motion.div
              layoutId="sidebar-active-indicator-child"
              className="absolute inset-0 bg-[#C9A96E] rounded-md"
              initial={false}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-3 min-w-0 w-full">
            <HelpCircle size={15} className="shrink-0 opacity-80" />
            <span>Forum</span>
          </div>
        </Link>
        <Link
          href="/dashboard/chat/direct"
          className={`sidebar-child relative ${isMessagesActive ? "active" : ""}`}
          aria-current={isMessagesActive ? "page" : undefined}
        >
          {isMessagesActive && (
            <motion.div
              layoutId="sidebar-active-indicator-child"
              className="absolute inset-0 bg-[#C9A96E] rounded-md"
              initial={false}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-3 min-w-0 w-full">
            <MessageSquare size={15} className="shrink-0 opacity-80" />
            <span>Messages</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
