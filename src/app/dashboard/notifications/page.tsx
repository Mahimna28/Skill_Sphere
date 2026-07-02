"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, MessageSquare, UserCheck, UserX, CheckCheck, 
  Loader2, Clock
} from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    fetchNotifications();
  };

  const getIconProps = (type: string) => {
    switch (type) {
      case "chat_request": return { icon: UserCheck, color: "#1E1B2E", bg: "rgba(30,27,46,0.06)" };
      case "chat_accepted": return { icon: CheckCheck, color: "#22C55E", bg: "rgba(201,169,110,0.1)" };
      case "chat_rejected": return { icon: UserX, color: "#DC2626", bg: "rgba(220,38,38,0.1)" };
      case "new_message": return { icon: MessageSquare, color: "#1E1B2E", bg: "rgba(30,27,46,0.06)" };
      default: return { icon: Bell, color: "#1E1B2E", bg: "rgba(30,27,46,0.06)" };
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-[#C9A96E]" size={32} /></div>;

  return (
    <div className="font-sans flex flex-col h-full text-[#1E1B2E]">
      <div className="flex flex-col flex-1">
        
        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-6 px-8 pb-5 flex items-center justify-between shrink-0"
        >
          <p className="text-[14px] text-[#8E8E93]">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
          {unreadCount > 0 && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllRead} 
              className="h-[36px] px-4 rounded-xl border border-[#1E1B2E] text-[#1E1B2E] text-[13px] font-medium flex items-center gap-2 hover:bg-[#1E1B2E] hover:text-white transition-colors"
            >
              <CheckCheck size={14} /> Mark All Read
            </motion.button>
          )}
        </motion.div>

        {/* Notifications List */}
        <div className="px-8 pb-8 space-y-3">
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="bg-white rounded-[16px] p-[60px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-center flex flex-col items-center max-w-[640px] mx-auto mt-4"
            >
              <Bell size={48} className="text-[#1E1B2E] opacity-20 mb-4" />
              <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2">No Notifications</h3>
              <p className="text-[14px] text-[#8E8E93] max-w-[360px]">
                You're all caught up! We'll notify you when something important happens.
              </p>
            </motion.div>
          ) : (
            notifications.map((notif, i) => {
              const { icon: Icon, color, bg } = getIconProps(notif.type);
              const isUnread = !notif.read;
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
                  key={notif.id}
                  onClick={() => isUnread && markRead(notif.id)}
                  className={`
                    flex items-start gap-4 p-5 md:px-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300
                    ${isUnread ? "bg-[rgba(201,169,110,0.03)] border-l-[3px] border-l-[#C9A96E] cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]" : "bg-white border-l-[3px] border-l-transparent"}
                  `}
                >
                  {/* Icon Area */}
                  <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: bg }}>
                    <Icon size={18} style={{ color }} />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[14px] font-medium text-[#1E1B2E] mb-1 transition-opacity ${!isUnread ? 'opacity-90' : ''}`}>{notif.title}</h4>
                    <p className={`text-[13px] text-[#8E8E93] leading-[1.5] transition-opacity ${!isUnread ? 'opacity-90' : ''}`}>{notif.body}</p>
                    
                    <div className="mt-2.5 flex items-center gap-3">
                      {notif.linkUrl && (
                        <Link href={notif.linkUrl} onClick={(e) => e.stopPropagation()}>
                          <span className="text-[13px] text-[#C9A96E] hover:underline cursor-pointer">View →</span>
                        </Link>
                      )}
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full transition-colors ${isUnread ? "bg-[#C9A96E]" : "bg-[#8E8E93]"}`} />
                        <span className={`text-[11px] transition-colors ${isUnread ? "text-[#C9A96E]" : "text-[#8E8E93]"}`}>
                          {isUnread ? "Unread" : "Read"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-[12px] text-[#8E8E93] shrink-0">
                    <Clock size={12} /> {timeAgo(notif.createdAt)}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
