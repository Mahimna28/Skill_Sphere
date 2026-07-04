"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Star,
  Pin,
  Users,
  Sparkles,
  Filter,
  Radio,
  Smile,
  CornerDownRight,
  Bookmark,
  X,
  Lock,
  Globe,
  CheckCircle2,
} from "lucide-react";
import StudentChatClient from "../../chat/StudentChatClient";

interface HubCourseChatProps {
  enrollments: any[];
  currentUser: { id: string; name: string };
  initialRoomId?: string | null;
}

export default function HubCourseChat({ enrollments, currentUser, initialRoomId }: HubCourseChatProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const [filter, setFilter] = useState<"all" | "live" | "favorites">("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pinnedRooms, setPinnedRooms] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [roomPrivacy, setRoomPrivacy] = useState<"public" | "private">("public");
  const [customRooms, setCustomRooms] = useState<any[]>([]);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [showThreadDrawer, setShowThreadDrawer] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([
    { id: "pin-1", text: "Welcome to Course Chat! Please keep discussions constructive and academic.", author: "Professor Davis" },
  ]);
  const [showPinsModal, setShowPinsModal] = useState(false);

  // Load favorites from local storage if available
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("hub_chat_favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch (e) {}
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem("hub_chat_favorites", JSON.stringify(updated));
    } catch (e) {}
  };

  const togglePinRoom = (id: string) => {
    setPinnedRooms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTitle.trim()) return;
    const newRoom = {
      course: {
        id: `custom-${Date.now()}`,
        title: roomTitle,
        subject: roomDesc || (roomPrivacy === "public" ? "Public Study Channel" : "Private Study Room"),
      },
    };
    setCustomRooms((prev) => [newRoom, ...prev]);
    setRoomTitle("");
    setRoomDesc("");
    setShowCreateModal(false);
  };

  // Combine standard enrollments and custom rooms
  const allRooms = [...customRooms, ...enrollments];
  const filteredRooms = allRooms.filter((item) => {
    if (filter === "favorites") return favorites.includes(item.course.id);
    if (filter === "live") return true; // All rooms simulate active status
    return true;
  });

  return (
    <div className="flex flex-col h-full space-y-4 font-sans">
      {/* Top Controls Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] mr-1 flex items-center gap-1.5">
            <Filter size={14} /> Rooms Filter:
          </span>
          {(["all", "live", "favorites"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === tab
                  ? "bg-[#1E1B2E] text-[#C9A96E] shadow-xs"
                  : "bg-white/60 hover:bg-white text-[#1E1B2E] border border-black/5"
              }`}
            >
              {tab === "live" && <Radio size={12} className="text-[#22C55E] animate-pulse" />}
              {tab === "favorites" && <Star size={12} className="text-[#C9A96E]" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowPinsModal(true)}
            className="h-9 px-3.5 rounded-xl bg-white/80 hover:bg-white text-[#1E1B2E] font-bold text-xs border border-black/5 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Pin size={14} className="text-[#C9A96E]" />
            <span>Pinned ({pinnedMessages.length})</span>
          </button>

          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            className="h-9 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-xs flex items-center gap-1.5 shadow-[0_4px_12px_rgba(201,169,110,0.25)] cursor-pointer"
          >
            <Plus size={15} />
            <span>New Room</span>
          </motion.button>
        </div>
      </div>

      {/* Room Quick-Actions Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-thin">
        {allRooms.map((room) => {
          const isFav = favorites.includes(room.course.id);
          const isPinned = pinnedRooms.includes(room.course.id);
          return (
            <div
              key={room.course.id}
              className="bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 flex items-center gap-2 shrink-0 shadow-2xs text-xs font-medium text-[#1E1B2E]"
            >
              <span className="truncate max-w-[120px] font-bold">{room.course.title}</span>
              <button
                onClick={() => toggleFavorite(room.course.id)}
                className={`p-1 rounded-md hover:bg-black/5 cursor-pointer ${
                  isFav ? "text-[#C9A96E]" : "text-[#8E8E93]"
                }`}
                title="Favorite Room"
              >
                <Star size={13} fill={isFav ? "#C9A96E" : "none"} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Typing Indicator Bar */}
      <div className="px-4 py-1 text-xs font-medium text-[#8E8E93] flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        <span>Live channel ready · Academic discussion active</span>
      </div>

      {/* Wrapped Child Component Layer */}
      <div className="flex-1 min-h-[560px] wrapped-child-page hub-legacy-chat relative overflow-hidden rounded-2xl">
        <StudentChatClient enrollments={filteredRooms.length > 0 ? filteredRooms : allRooms} currentUser={currentUser} initialCourseId={initialRoomId} />
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={prefersReduced ? {} : { scale: 0.95, y: 15 }}
              animate={prefersReduced ? {} : { scale: 1, y: 0 }}
              exit={prefersReduced ? {} : { scale: 0.95, y: 15 }}
              className="bg-white/90 backdrop-blur-2xl rounded-2xl p-6 md:p-8 max-w-md w-full border border-white/80 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#1E1B2E]/10 pb-3">
                <h3 className="text-lg font-bold text-[#1E1B2E] flex items-center gap-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
                  <Sparkles className="text-[#C9A96E]" size={18} />
                  <span>Create Study Room</span>
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-[#8E8E93] hover:text-[#1E1B2E] cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Room Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Advanced Algorithm Study Group"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-black/10 text-sm font-semibold text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Description / Topic</label>
                  <input
                    type="text"
                    placeholder="Collaborative homework preparation..."
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-black/10 text-sm font-semibold text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Privacy</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoomPrivacy("public")}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                        roomPrivacy === "public"
                          ? "bg-[#1E1B2E] text-[#C9A96E] border-[#1E1B2E]"
                          : "bg-white text-[#8E8E93] border-black/10"
                      }`}
                    >
                      <Globe size={14} /> Public Room
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomPrivacy("private")}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                        roomPrivacy === "private"
                          ? "bg-[#1E1B2E] text-[#C9A96E] border-[#1E1B2E]"
                          : "bg-white text-[#8E8E93] border-black/10"
                      }`}
                    >
                      <Lock size={14} /> Private Group
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="h-10 px-4 rounded-xl font-bold text-xs text-[#8E8E93] hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] font-bold text-xs text-[#1E1B2E] cursor-pointer shadow-md"
                  >
                    Create Channel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Messages Modal */}
      <AnimatePresence>
        {showPinsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={prefersReduced ? {} : { scale: 0.95 }}
              animate={prefersReduced ? {} : { scale: 1 }}
              exit={prefersReduced ? {} : { scale: 0.95 }}
              className="bg-white/90 backdrop-blur-2xl rounded-2xl p-6 max-w-md w-full border border-white/80 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1E1B2E]/10 pb-3">
                <h3 className="text-base font-bold text-[#1E1B2E] flex items-center gap-2">
                  <Pin size={16} className="text-[#C9A96E]" />
                  <span>Pinned Channel Announcements</span>
                </h3>
                <button onClick={() => setShowPinsModal(false)} className="text-[#8E8E93] hover:text-[#1E1B2E] cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {pinnedMessages.map((pin) => (
                  <div key={pin.id} className="p-3 bg-[#C9A96E]/10 border border-[#C9A96E]/30 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-[#1E1B2E]">{pin.author}</p>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">{pin.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPinsModal(false)}
                  className="h-9 px-4 rounded-xl bg-[#1E1B2E] text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
