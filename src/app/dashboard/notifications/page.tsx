"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bell, MessageSquare, UserCheck, UserX, CheckCheck, 
  Loader2, Trash2, Mail, Clock
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

  const getIcon = (type: string) => {
    switch (type) {
      case "chat_request": return <UserCheck className="text-blue-500" size={20} />;
      case "chat_accepted": return <CheckCheck className="text-green-500" size={20} />;
      case "chat_rejected": return <UserX className="text-red-500" size={20} />;
      case "new_message": return <MessageSquare className="text-purple-500" size={20} />;
      default: return <Bell className="text-muted-foreground" size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "chat_request": return "border-l-blue-500";
      case "chat_accepted": return "border-l-green-500";
      case "chat_rejected": return "border-l-red-400";
      case "new_message": return "border-l-purple-500";
      default: return "border-l-gray-300";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Bell /> Notifications
          </h1>
          <p className="text-sm font-bold text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllRead} className="neo-brutalism bg-[#34D399] text-black font-black h-12 px-6">
            <CheckCheck className="mr-2" size={16} /> Mark All Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white border-4 border-black rounded-[2.5rem] p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-20 h-20 mx-auto bg-muted/20 border-4 border-dashed border-black rounded-full flex items-center justify-center mb-6">
            <Bell size={40} className="opacity-30" />
          </div>
          <h3 className="text-2xl font-black uppercase">No Notifications</h3>
          <p className="font-bold text-muted-foreground mt-2">When someone sends you a message or chat request, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`
                bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                border-l-8 ${getColor(notif.type)}
                ${!notif.read ? "ring-2 ring-primary/30" : "opacity-80"}
                hover:-translate-y-0.5 transition-all cursor-pointer group
              `}
              onClick={() => !notif.read && markRead(notif.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted/20 border-2 border-black rounded-xl flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-black text-sm uppercase leading-none">{notif.title}</h4>
                    <span className="text-[10px] font-black text-muted-foreground shrink-0 flex items-center gap-1">
                      <Clock size={10} /> {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground mt-1.5 leading-relaxed">{notif.body}</p>
                  <div className="flex items-center gap-4 mt-3">
                    {notif.linkUrl && (
                      <Link href={notif.linkUrl}>
                        <span className="text-[10px] font-black text-primary uppercase hover:underline">View →</span>
                      </Link>
                    )}
                    {!notif.read && (
                      <span className="text-[10px] font-black text-green-600 uppercase flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Unread
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
