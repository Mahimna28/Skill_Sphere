"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Bell, MessageSquare, UserCheck, UserX, CheckCheck, 
  Trash2, Clock, Sparkles, Check, X
} from "lucide-react";
import Link from "next/link";

const easing = [0.25, 0.1, 0.25, 1.0] as const;

const containerVariant = {
  hidden: { opacity: 0, scale: 0.98, y: 15 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: easing } 
  }
};

const listVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const rowVariant = {
  hidden: { opacity: 0, x: 40 },
  show: (i: number = 0) => ({ 
    opacity: 1, 
    x: 0, 
    transition: { delay: i * 0.06, duration: 0.36, ease: easing } 
  })
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const prefersReduced = useReducedMotion() ?? false;
  const listRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        return data.notifications || [];
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
    return [];
  }

  useEffect(() => {
    let mounted = true;
    fetchNotifications().then(data => { 
      if (mounted && data) setNotifications(data); 
    });
    return () => { mounted = false; };
  }, []);

  async function markRead(id: string) {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  }

  async function markAllRead() {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  }

  async function dismiss(id: string) {
    try {
      const target = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (target && !target.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to dismiss notification", err);
    }
  }

  async function clearAll() {
    try {
      setNotifications([]);
      setUnreadCount(0);
      await fetch("/api/notifications?clearAll=true", {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "chat_request": return <UserCheck className="text-[#3B82F6] w-5 h-5" />;
      case "chat_accepted": return <CheckCheck className="text-[#22C55E] w-5 h-5" />;
      case "chat_rejected": return <UserX className="text-[#EF4444] w-5 h-5" />;
      case "new_message": return <MessageSquare className="text-[#A855F7] w-5 h-5" />;
      default: return <Bell className="text-[#C9A96E] w-5 h-5" />;
    }
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <motion.main
      className="p-6 md:p-8 w-full max-w-screen-xl mx-auto h-[calc(100vh-100px)] flex flex-col overflow-hidden font-sans"
      initial={prefersReduced ? false : "hidden"}
      animate={prefersReduced ? false : "show"}
      variants={containerVariant}
      aria-labelledby="notifications-heading"
    >
      <header className="mb-6 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            id="notifications-heading"
            className="text-[28px] sm:text-3xl font-bold text-[#1E1B2E] leading-tight flex items-center gap-2.5"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            <span>Notifications</span>
          </h1>
          <p className="text-sm font-medium text-[#8E8E93] mt-1">
            Recent activity and alerts {unreadCount > 0 && `(${unreadCount} unread)`}
          </p>
        </div>

        {unreadCount > 0 && (
          <motion.button
            onClick={markAllRead}
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            className="h-10 px-5 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_18px_rgba(201,169,110,0.6)] transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </motion.button>
        )}
      </header>

      <section
        className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(30,27,46,0.06)] border border-white/80 p-4 md:p-6 flex-1 flex flex-col overflow-hidden min-h-0"
        role="region"
        aria-label="Notifications list"
      >
        <div className="flex items-center justify-between mb-4 shrink-0 pb-3 border-b border-[#1E1B2E]/10">
          <div className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <span>Activity Feed</span>
          </div>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <button
                type="button"
                className="text-xs font-bold text-[#8E8E93] hover:text-[#EF4444] px-3 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] cursor-pointer"
                onClick={clearAll}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto min-h-0 min-w-0 space-y-3 pr-2 scrollbar-thin"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#8E8E93] animate-pulse">
              <Bell className="w-8 h-8 text-[#C9A96E]" />
              <span className="text-xs font-bold">Loading your notifications…</span>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[#8E8E93] py-16 space-y-3"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#1E1B2E]/5 flex items-center justify-center mx-auto text-[#8E8E93]">
                    <Bell className="w-8 h-8 opacity-40" />
                  </div>
                  <h3 className="text-base font-bold text-[#1E1B2E]">No notifications</h3>
                  <p className="text-xs font-medium max-w-xs mx-auto">
                    When your instructors or peers message you or assign tasks, alerts will appear right here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={listVariant}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {notifications.map((n, idx) => {
                    const isUnread = !n.read && !n.unread === false;

                    return (
                      <motion.article
                        key={n.id || idx}
                        custom={idx}
                        variants={rowVariant}
                        whileHover={
                          prefersReduced
                            ? {}
                            : {
                                scale: 1.01,
                                transition: { duration: 0.2, ease: easing },
                              }
                        }
                        exit={{ opacity: 0, x: 20 }}
                        className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
                          isUnread
                            ? "bg-[#C9A96E]/10 border-[#C9A96E]/40 border-l-4 border-l-[#C9A96E]"
                            : "bg-white/60 border-white/80 hover:bg-white/90"
                        }`}
                        role="listitem"
                        aria-label={`${n.title || "Notification"} ${isUnread ? "unread" : "read"}`}
                      >
                        <div className="shrink-0 pt-0.5">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-2xs ${
                              isUnread
                                ? "bg-[#1E1B2E] text-[#C9A96E] ring-2 ring-[#C9A96E]/40"
                                : "bg-[#1E1B2E]/5 text-[#1E1B2E]"
                            }`}
                          >
                            {getIcon(n.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-[#1E1B2E] truncate flex items-center gap-2">
                                <span>{n.title || "System Alert"}</span>
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-[#C9A96E] shrink-0" />
                                )}
                              </h3>
                              <p className="text-xs font-medium text-[#8E8E93] mt-1 line-clamp-2 leading-relaxed">
                                {n.body || n.message || "New activity detected."}
                              </p>
                            </div>
                            <div className="text-[11px] font-semibold text-[#8E8E93] whitespace-nowrap flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              <span>{timeAgo(n.createdAt || n.time)}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#1E1B2E]/5">
                            <div>
                              {n.linkUrl && (
                                <Link
                                  href={n.linkUrl}
                                  className="text-xs font-bold text-[#C9A96E] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded"
                                >
                                  View Details →
                                </Link>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {isUnread && (
                                <button
                                  type="button"
                                  onClick={() => markRead(n.id)}
                                  className="text-xs font-bold px-3 py-1 rounded-lg bg-white/90 hover:bg-white text-[#1E1B2E] shadow-2xs border border-[#1E1B2E]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] transition-colors cursor-pointer flex items-center gap-1"
                                  aria-label={`Mark ${n.title} as read`}
                                >
                                  <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                                  <span>Mark read</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => dismiss(n.id)}
                                className="text-xs font-bold px-3 py-1 rounded-lg bg-transparent hover:bg-[#EF4444]/10 text-[#8E8E93] hover:text-[#EF4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] transition-colors cursor-pointer flex items-center gap-1"
                                aria-label={`Dismiss ${n.title}`}
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Dismiss</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </motion.main>
  );
}
