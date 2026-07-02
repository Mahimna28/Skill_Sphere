"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Bell, Check, Trophy, BookOpen, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Course completed!", message: "You finished 'Python Basics'", type: "achievement", time: "5m ago", unread: true },
    { id: 2, title: "New assignment", message: "AI & ML: Neural Networks Project", type: "course", time: "1h ago", unread: true },
    { id: 3, title: "Reply from Sarah", message: "In Q&A Forum: How do I...?", type: "message", time: "3h ago", unread: false },
    { id: 4, title: "+100 points earned", message: "For completing daily streak", type: "achievement", time: "5h ago", unread: false },
    { id: 5, title: "Live session starting", message: "Web Dev: React Advanced starts in 30 min", type: "course", time: "6h ago", unread: false },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "achievement": return Trophy;
      case "course": return BookOpen;
      case "message": return MessageCircle;
      default: return Bell;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "achievement": return "bg-[rgba(201,169,110,0.12)]";
      case "course": return "bg-[rgba(30,27,46,0.06)]";
      case "message": return "bg-blue-50";
      default: return "bg-[#F5F1EB]";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "achievement": return "text-[#C9A96E]";
      case "course": return "text-[#1E1B2E]";
      case "message": return "text-blue-500";
      default: return "text-[#8E8E93]";
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-heading text-3xl text-[#1E1B2E]">Notifications</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl border border-[rgba(30,27,46,0.1)] text-sm text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)] transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </motion.button>
        </div>
        <p className="text-[#8E8E93] mb-6">Stay updated with your learning journey.</p>
      </FadeIn>

      <StaggerContainer staggerDelay={0.06}>
        <AnimatePresence>
          {notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            return (
              <StaggerItem key={notif.id}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                  whileHover={{ x: 4, backgroundColor: "rgba(201,169,110,0.02)" }}
                  className={`flex items-start gap-4 p-4 rounded-xl mb-2 border ${
                    notif.unread
                      ? "bg-[rgba(201,169,110,0.04)] border-[rgba(201,169,110,0.1)]"
                      : "bg-white border-[rgba(30,27,46,0.04)]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBg(notif.type)}`}>
                    <Icon className={`w-5 h-5 ${getIconColor(notif.type)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${notif.unread ? "font-medium text-[#1E1B2E]" : "text-[#1E1B2E]"}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-[#8E8E93] mt-0.5">{notif.message}</p>
                      </div>
                      <span className="text-xs text-[#8E8E93] flex-shrink-0 ml-4">{notif.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notif.unread && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-[#C9A96E] flex-shrink-0"
                      />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeNotification(notif.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#8E8E93] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </AnimatePresence>
      </StaggerContainer>

      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Bell className="w-12 h-12 text-[#1E1B2E]/10 mx-auto mb-4" />
          <p className="text-[#8E8E93]">No notifications yet</p>
        </motion.div>
      )}
    </div>
  );
}
