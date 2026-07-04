"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Send, Hash, Sparkles } from "lucide-react";

let socket: Socket;

// Global motion easing
const easing = [0.25, 0.1, 0.25, 1.0] as any;

interface Props {
  enrollments: { course: { id: string; title: string; subject: string } }[];
  currentUser: { id: string; name: string };
  initialCourseId?: string | null;
}

export default function StudentChatClient({ enrollments, currentUser, initialCourseId }: Props) {
  const findCourse = (courseId?: string | null) => {
    if (!courseId) return enrollments[0]?.course || null;
    const found = enrollments.find((e) => e.course.id === courseId);
    return found?.course || enrollments[0]?.course || null;
  };
  const [activeCourse, setActiveCourse] = useState(findCourse(initialCourseId));
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const threadContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    socket = io();
    return () => {
      socket.disconnect();
    };
  }, []);

  // React to external deep-link changes (e.g. Community Hub slide-over)
  useEffect(() => {
    if (initialCourseId) {
      const target = findCourse(initialCourseId);
      if (target && target.id !== activeCourse?.id) {
        setActiveCourse(target);
      }
    }
  }, [initialCourseId]);

  useEffect(() => {
    if (!activeCourse || !socket) return;
    isInitialLoadRef.current = true;
    socket.emit("join_course", activeCourse.id);

    // Fetch chat history
    fetch(`/api/chat/messages?courseId=${activeCourse.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
        // Ensure scroll stays at the top on initial load
        setTimeout(() => {
          if (threadContainerRef.current) {
            threadContainerRef.current.scrollTop = 0;
          }
          isInitialLoadRef.current = false;
        }, 50);
      })
      .catch((err) => {
        console.error("Failed to fetch messages", err);
        setMessages([]);
        isInitialLoadRef.current = false;
      });

    socket.off("receive_message");
    socket.on("receive_message", (data) => {
      if (data.courseId === activeCourse.id) {
        setMessages((prev) => [...prev, data]);
        // Auto-scroll ONLY when a new message is received live
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    });
  }, [activeCourse]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeCourse) return;

    const textToSend = input;
    setInput(""); // Optimistically clear input

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: activeCourse.id, text: textToSend }),
      });

      const data = await res.json();
      if (res.ok && data.savedMessage) {
        socket.emit("send_message", data.savedMessage);
        // Auto-scroll ONLY when user manually sends a message
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        console.error("Failed to save message", data);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Helper to format timestamps
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  // Main Card container animation: fadeInUp + scale
  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: easing },
    },
  };

  // Chat list row slide in right-to-left
  const rowVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: easing },
    },
  };

  // Message bubble spring bounce
  const bubbleVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: shouldReduceMotion
        ? { duration: 0.1 }
        : { type: "spring", stiffness: 320, damping: 26 },
    },
  };

  return (
    <div className="w-full h-[calc(100vh-130px)] min-h-[580px] max-w-screen-xl mx-auto flex font-sans">
      {/* Main Frosted Glass Card fits viewport w/h cleanly */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full h-full p-6 md:p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(30,27,46,0.06)] flex flex-col overflow-hidden relative"
      >
        {/* Ambient interior lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E1B2E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header Section */}
        <div className="pb-4 border-b border-[#1E1B2E]/10 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <div>
              <h1
                className="text-xl md:text-2xl font-bold text-[#1E1B2E] leading-tight"
                style={{ fontFamily: "var(--font-heading, serif)" }}
              >
                {activeCourse?.title || "Course Chat"}
              </h1>
              <p className="text-xs md:text-sm text-[#8E8E93] font-medium mt-0.5">
                {activeCourse?.subject || "Collaborative discussion channel"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="hidden sm:inline">Live Room</span>
          </div>
        </div>

        {/* 2. Chat List Section (Horizontal Strip stacking below header) */}
        <div className="py-3.5 border-b border-[#1E1B2E]/10 shrink-0 relative z-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#1E1B2E]/10">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider shrink-0 mr-1">
              Rooms:
            </span>
            {enrollments.map((enr, index) => {
              const isActive = activeCourse?.id === enr.course.id;
              const initials = enr.course.title
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <motion.button
                  key={enr.course.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.08 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  onClick={() => setActiveCourse(enr.course)}
                  className={`px-3.5 py-2 rounded-xl text-left transition-all duration-300 relative flex items-center gap-2.5 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                    isActive
                      ? "bg-[#C9A96E]/20 border-2 border-[#C9A96E] shadow-[inset_0_0_15px_rgba(201,169,110,0.2)] text-[#1E1B2E]"
                      : "bg-white/60 hover:bg-white/90 border border-white/80 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-[#1E1B2E]"
                  }`}
                >
                  {/* Active Gold Border Pulse Animation */}
                  {isActive && (
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none rounded-xl border border-[#C9A96E]"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] ${
                      isActive
                        ? "bg-[#1E1B2E] text-[#C9A96E]"
                        : "bg-[#1E1B2E]/10 text-[#1E1B2E]"
                    }`}
                  >
                    {initials}
                  </div>
                  <span className="font-bold text-xs max-w-[140px] truncate">
                    {enr.course.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 3. Message Thread Section (Expands to fill available space) */}
        <div
          ref={threadContainerRef}
          className="flex-grow overflow-y-auto py-5 space-y-5 scrollbar-thin scrollbar-thumb-[#1E1B2E]/10 relative z-10 min-h-0"
        >
          {messages.length === 0 ? (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: easing }}
              className="h-full flex flex-col items-center justify-center text-center text-[#8E8E93] my-auto py-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center mb-3.5 text-[#C9A96E]">
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="font-bold text-base text-[#1E1B2E]">No messages yet in this room</p>
              <p className="font-medium text-xs text-[#8E8E93] max-w-xs mt-1">
                Be the first to introduce yourself or start discussions for{" "}
                <span className="font-semibold text-[#1E1B2E]">{activeCourse?.title}</span>!
              </p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <motion.div
                    key={msg.id || i}
                    variants={bubbleVariants as any}
                    initial="hidden"
                    animate="visible"
                    className={`flex flex-col max-w-[85%] sm:max-w-[72%] ${
                      isMe ? "self-end items-end ml-auto" : "self-start items-start"
                    }`}
                  >
                    {/* Sender name above bubble */}
                    <span className="text-xs font-medium text-[#8E8E93] mb-1 px-1">
                      {isMe ? "You" : msg.senderName}
                    </span>

                    {/* Bubble styling with Liquid Ripple Shimmer on hover */}
                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: 1.01,
                              transition: { duration: 0.2, ease: easing },
                            }
                      }
                      className={`relative overflow-hidden px-4 py-3 rounded-2xl text-sm font-medium shadow-[0_4px_14px_rgba(30,27,46,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(30,27,46,0.08)] ${
                        isMe
                          ? "bg-gradient-to-r from-[#1E1B2E] to-[#2D2844] text-white rounded-br-xs border border-[#1E1B2E]"
                          : "bg-white/85 backdrop-blur-md text-[#1E1B2E] rounded-bl-xs border border-white/80"
                      }`}
                    >
                      {/* Shimmer sweep effect inside bubble on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        whileHover={{ translateX: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                      <span className="relative z-10 leading-relaxed break-words">{msg.text}</span>
                    </motion.div>

                    {/* Timestamp below bubble */}
                    <span className="text-[11px] text-[#8E8E93] mt-1 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 4. Input Bar Section (fadeInUp delay 0.3s) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: easing }}
          className="pt-4 border-t border-[#1E1B2E]/10 shrink-0 relative z-10"
        >
          <form onSubmit={sendMessage} className="flex items-center gap-3">
            {/* Frosted glass pill input bar */}
            <div className="flex-1 flex items-center bg-white/80 backdrop-blur-xl border border-white/80 rounded-full shadow-[0_4px_20px_rgba(30,27,46,0.06)] px-5 py-1.5 focus-within:ring-2 focus-within:ring-[#C9A96E]/50 focus-within:border-[#C9A96E] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="w-full bg-transparent border-none focus:outline-none font-sans text-sm text-[#1E1B2E] placeholder:text-[#8E8E93] py-2"
              />
            </div>

            {/* Premium Gold Send Button */}
            <motion.button
              type="submit"
              disabled={!input.trim()}
              whileHover={shouldReduceMotion || !input.trim() ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion || !input.trim() ? {} : { scale: 0.97 }}
              aria-label="Send message"
              className={`h-11 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shrink-0 shadow-sm ${
                input.trim()
                  ? "bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_18px_rgba(201,169,110,0.6)]"
                  : "bg-[#1E1B2E]/10 text-[#8E8E93] cursor-not-allowed opacity-60"
              }`}
            >
              <span>Send</span>
              <Send className="w-4 h-4 shrink-0" />
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
