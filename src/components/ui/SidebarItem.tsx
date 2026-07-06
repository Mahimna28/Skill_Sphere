"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
    <Link href={href} className="block">
      <div className={`sidebar-item-glass ${active ? "active" : ""}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="sidebar-icon-badge">
            <Icon size={16} />
          </div>
          <span className="tracking-tight truncate">{label}</span>
        </div>

        {/* Notification Badge */}
        {typeof badge === "number" && badge > 0 && (
          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-[#C9A96E] to-[#E5C992] text-[#1E1B2E] shadow-sm">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export function CommunityHubSidebarGroup() {
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
        <Link
          href="/dashboard/student/chat"
          className={`sidebar-child ${isChatActive ? "active" : ""}`}
          aria-current={isChatActive ? "page" : undefined}
        >
          <MessageCircle size={15} className="shrink-0 opacity-80" />
          <span>Chat</span>
        </Link>
        <Link
          href="/dashboard/qa"
          className={`sidebar-child ${isForumActive ? "active" : ""}`}
          aria-current={isForumActive ? "page" : undefined}
        >
          <HelpCircle size={15} className="shrink-0 opacity-80" />
          <span>Forum</span>
        </Link>
        <Link
          href="/dashboard/chat/direct"
          className={`sidebar-child ${isMessagesActive ? "active" : ""}`}
          aria-current={isMessagesActive ? "page" : undefined}
        >
          <MessageSquare size={15} className="shrink-0 opacity-80" />
          <span>Messages</span>
        </Link>
      </div>
    </div>
  );
}
