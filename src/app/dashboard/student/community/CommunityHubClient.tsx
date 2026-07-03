"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  hubContainerVariant,
  tabContentVariant,
  slideOverLeftVariant,
  slideOverRightVariant,
  backdropVariant,
} from "./hubVariants";
import { isCommunityHubEnabled } from "@/lib/features";
import HubCourseChat from "./components/HubCourseChat";
import HubQAForum from "./components/HubQAForum";
import HubMessages from "./components/HubMessages";
import {
  MessageSquare,
  HelpCircle,
  Send,
  Sparkles,
  Users,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  X,
  Search,
  Filter,
  Star,
  Radio,
  Pin,
  ShieldCheck,
  FileText,
  BookOpen,
  Plus,
} from "lucide-react";
import "./hub.css";

interface Props {
  enrollments: any[];
  currentUser: { id: string; name: string };
}

export default function CommunityHubClient({ enrollments, currentUser }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion() ?? false;

  // Determine active tab from URL search params (or fallback to 'chat')
  const tabParam = searchParams?.get("tab") as "chat" | "forum" | "messages" | null;
  const roomParam = searchParams?.get("room");
  const [activeTab, setActiveTab] = useState<"chat" | "forum" | "messages">(
    tabParam === "forum" || tabParam === "messages" ? tabParam : "chat"
  );

  // Floating Slide-Over Panels state
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [panelSearchQuery, setPanelSearchQuery] = useState("");

  // Sync tab with URL search params when activeTab changes
  useEffect(() => {
    if (tabParam && tabParam !== activeTab && ["chat", "forum", "messages"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (tab: "chat" | "forum" | "messages") => {
    setActiveTab(tab);
    setShowLeftPanel(false);
    setShowRightPanel(false);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Dev telemetry removed after QA sign-off.
  // If you need lightweight dev-only telemetry in the future, guard it with:
  // if (process.env.NODE_ENV !== "production") { console.log(...) }

  // Socket lifecycle subscription for community hub room
  useEffect(() => {
    if (!isCommunityHubEnabled()) return;
    const socket: Socket = io();
    socket.emit("join_community_hub", { userId: currentUser?.id });

    return () => {
      socket.emit("leave_community_hub", { userId: currentUser?.id });
      socket.disconnect();
    };
  }, [currentUser?.id]);

  // Global keyboard shortcuts: Esc to close slide-overs, '/' to focus composer input
  useEffect(() => {
    if (!isCommunityHubEnabled()) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showLeftPanel) setShowLeftPanel(false);
        if (showRightPanel) setShowRightPanel(false);
        return;
      }

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        const wrapper = document.querySelector(".hub-content-wrapper");
        if (wrapper) {
          const input = wrapper.querySelector(
            "input[placeholder*='Type a message'], input[type='text'], textarea"
          ) as HTMLElement;
          if (input) {
            input.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLeftPanel, showRightPanel]);

  // Feature Flag disabled state: show sleek placeholder card
  if (!isCommunityHubEnabled()) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-8 shadow-md text-center">
          <div className="w-16 h-16 mx-auto bg-[#1E1B2E] text-[#C9A96E] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#1E1B2E] mb-2" style={{ fontFamily: "var(--font-heading, serif)" }}>
            Community Hub is Currently Disabled
          </h2>
          <p className="text-sm font-medium text-[#8E8E93] max-w-md mx-auto mb-6">
            The unified inline community workspace is gated behind an experimental feature flag. Enable <code className="bg-[#1E1B2E]/10 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_FEATURE_COMMUNITY_HUB=true</code> to access this experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => router.push("/dashboard/student/chat")}
              className="h-10 px-5 rounded-xl bg-[#1E1B2E] text-[#C9A96E] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageSquare size={14} /> Course Chat
            </button>
            <button
              onClick={() => router.push("/dashboard/qa")}
              className="h-10 px-5 rounded-xl bg-[#1E1B2E] text-[#C9A96E] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <HelpCircle size={14} /> Q&A Forum
            </button>
            <button
              onClick={() => router.push("/dashboard/chat/direct")}
              className="h-10 px-5 rounded-xl bg-[#1E1B2E] text-[#C9A96E] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Send size={14} /> Messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "chat" as const, label: "Course Chat", icon: MessageSquare, badge: "Live" },
    { id: "forum" as const, label: "Q&A Forum", icon: HelpCircle },
    { id: "messages" as const, label: "Messages", icon: Send },
  ];

  const getLeftPanelTitle = () => {
    if (activeTab === "chat") return "Rooms & Filters";
    if (activeTab === "forum") return "Topics & Tags";
    return "Contacts & Groups";
  };

  const getRightPanelTitle = () => {
    if (activeTab === "chat") return "Room Details & Pins";
    if (activeTab === "forum") return "Posting Guidelines";
    return "Conversation Info";
  };

  return (
    <motion.div
      initial={prefersReduced ? false : "hidden"}
      animate={prefersReduced ? false : "show"}
      variants={hubContainerVariant}
      className="w-full max-w-screen-xl mx-auto h-[calc(100vh-100px)] min-h-[580px] flex flex-col font-sans"
    >
      {/* Top Level Hub Header */}
      <div className="mb-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E] tracking-tight"
              style={{ fontFamily: "var(--font-heading, serif)" }}
            >
              Community Hub
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A96E]/20 text-[#1E1B2E] border border-[#C9A96E]/40 animate-pulse">
              <Sparkles size={11} className="text-[#C9A96E]" /> Live Room
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#8E8E93] mt-0.5">
            Full-bleed collaborative workspace. Press <kbd className="px-1.5 py-0.5 text-[10px] bg-white/80 border border-[#1E1B2E]/15 rounded font-mono text-[#1E1B2E]">/</kbd> to focus composer or <kbd className="px-1.5 py-0.5 text-[10px] bg-white/80 border border-[#1E1B2E]/15 rounded font-mono text-[#1E1B2E]">Esc</kbd> to close floating panels.
          </p>
        </div>
      </div>

      {/* Floating Panels Layout Main Card Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-white/80 flex-1 flex flex-col overflow-hidden min-h-0 relative">
        {/* Navigation & Panels Toggle Bar */}
        <div className="p-2.5 sm:p-3 border-b border-[#1E1B2E]/10 bg-white/60 flex items-center justify-between gap-2 shrink-0 z-20">
          {/* Left Slide-Over Trigger */}
          <button
            onClick={() => {
              setShowLeftPanel(!showLeftPanel);
              if (showRightPanel) setShowRightPanel(false);
            }}
            aria-label="Open left slide-over panel"
            className={`min-h-[44px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border focus-ring ${
              showLeftPanel
                ? "bg-[#1E1B2E] text-[#C9A96E] border-[#1E1B2E] shadow-sm"
                : "bg-white/80 hover:bg-white text-[#1E1B2E] border-black/5 shadow-2xs"
            }`}
          >
            {showLeftPanel ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} className="text-[#C9A96E]" />}
            <span className="hidden md:inline">{getLeftPanelTitle()}</span>
          </button>

          {/* Compact Center Tab Bar */}
          <div
            role="tablist"
            aria-label="Community Hub Sections"
            className="flex items-center gap-1.5 bg-black/5 p-1 rounded-xl"
          >
            {tabs.map((t) => {
              const Icon = t.icon;
              const isSelected = activeTab === t.id;
              return (
                <motion.button
                  key={t.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleTabChange(t.id)}
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  whileTap={prefersReduced ? {} : { scale: 0.98 }}
                  className={`min-h-[44px] px-3.5 sm:px-5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer focus-ring ${
                    isSelected
                      ? "bg-[#1E1B2E] text-[#C9A96E] shadow-sm gold-glow ring-1 ring-[#C9A96E]/40"
                      : "text-[#8E8E93] hover:text-[#1E1B2E]"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{t.label}</span>
                  {t.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${isSelected ? "bg-[#C9A96E] text-[#1E1B2E]" : "bg-[#1E1B2E]/10 text-[#1E1B2E]"}`}>
                      {t.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Slide-Over Trigger */}
          <button
            onClick={() => {
              setShowRightPanel(!showRightPanel);
              if (showLeftPanel) setShowLeftPanel(false);
            }}
            aria-label="Open right slide-over panel"
            className={`min-h-[44px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border focus-ring ${
              showRightPanel
                ? "bg-[#1E1B2E] text-[#C9A96E] border-[#1E1B2E] shadow-sm"
                : "bg-white/80 hover:bg-white text-[#1E1B2E] border-black/5 shadow-2xs"
            }`}
          >
            <span className="hidden md:inline">{getRightPanelTitle()}</span>
            {showRightPanel ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} className="text-[#C9A96E]" />}
          </button>
        </div>

        {/* Floating Backdrop Overlay when any panel is open */}
        <AnimatePresence>
          {(showLeftPanel || showRightPanel) && (
            <motion.div
              key="slideover-backdrop"
              variants={backdropVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => {
                setShowLeftPanel(false);
                setShowRightPanel(false);
              }}
              className="absolute inset-0 bg-black/35 backdrop-blur-2xs z-30 cursor-pointer"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Left Floating Slide-Over Panel */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.aside
              key="left-slideover"
              variants={slideOverLeftVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              aria-label={getLeftPanelTitle()}
              className="absolute inset-y-0 left-0 z-40 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border-r border-[#1E1B2E]/15 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-[#1E1B2E]/10 flex items-center justify-between shrink-0 bg-white/60">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#C9A96E]" />
                  <h3 className="font-bold text-sm text-[#1E1B2E]">{getLeftPanelTitle()}</h3>
                </div>
                <button
                  onClick={() => setShowLeftPanel(false)}
                  aria-label="Close left panel"
                  className="p-1 rounded-lg hover:bg-black/5 text-[#8E8E93] hover:text-[#1E1B2E] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Panel Search */}
              <div className="p-3 border-b border-[#1E1B2E]/10 bg-white/40 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8E8E93]" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === "chat" ? "rooms" : activeTab === "forum" ? "topics" : "contacts"}...`}
                    value={panelSearchQuery}
                    onChange={(e) => setPanelSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  />
                </div>
              </div>

              {/* Panel Scroll Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {activeTab === "chat" && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">My Enrolled Courses ({enrollments.length})</p>
                    {enrollments.map((enr) => (
                      <div
                        key={enr.course.id}
                        onClick={() => {
                          setShowLeftPanel(false);
                          // Option to set active course room or deep link
                        }}
                        className="p-3 rounded-xl bg-white/80 border border-black/5 hover:border-[#C9A96E]/50 shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#1E1B2E] truncate max-w-[190px]">{enr.course.title}</span>
                          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        </div>
                        <p className="text-[10px] text-[#8E8E93] truncate">{enr.course.subject || "Academic Discussion"}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "forum" && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">Popular Categories</p>
                    {["General", "Python", "React", "Calculus", "Physics", "AI"].map((t) => (
                      <div
                        key={t}
                        onClick={() => setShowLeftPanel(false)}
                        className="p-2.5 rounded-xl bg-white/80 border border-black/5 flex items-center justify-between text-xs font-bold text-[#1E1B2E] hover:bg-[#C9A96E]/10 cursor-pointer transition-colors"
                      >
                        <span># {t}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 font-medium">Active</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "messages" && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">Quick Peer Search</p>
                    <p className="text-xs text-[#8E8E93]">Use the main Messages view or type a username above to connect with fellow students and instructors.</p>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Right Floating Slide-Over Panel */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.aside
              key="right-slideover"
              variants={slideOverRightVariant}
              initial="hidden"
              animate="show"
              exit="exit"
              aria-label={getRightPanelTitle()}
              className="absolute inset-y-0 right-0 z-40 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border-l border-[#1E1B2E]/15 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-[#1E1B2E]/10 flex items-center justify-between shrink-0 bg-white/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C9A96E]" />
                  <h3 className="font-bold text-sm text-[#1E1B2E]">{getRightPanelTitle()}</h3>
                </div>
                <button
                  onClick={() => setShowRightPanel(false)}
                  aria-label="Close right panel"
                  className="p-1 rounded-lg hover:bg-black/5 text-[#8E8E93] hover:text-[#1E1B2E] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                <div className="p-3.5 bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E1B2E]">
                    <ShieldCheck size={15} className="text-[#1E1B2E]" />
                    <span>Academic Code of Conduct</span>
                  </div>
                  <p className="text-xs text-[#1E1B2E]/80 leading-relaxed">
                    All discussions, questions, and direct messages must remain professional and academic. Respect study peers and verify facts.
                  </p>
                </div>

                {activeTab === "chat" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">Channel Guidelines</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Course rooms are synchronized with your active enrollments. Ask questions freely or form breakout groups.
                    </p>
                  </div>
                )}

                {activeTab === "forum" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">Markdown & Code Hints</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Wrap code blocks in triple backticks (<code className="bg-black/5 px-1 rounded">```</code>) for syntax highlighting. Mark helpful answers with the checkmark tool.
                    </p>
                  </div>
                )}

                {activeTab === "messages" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">End-to-End Privacy</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Private student accounts require connection acceptance before direct collaboration.
                    </p>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Single Full-Width Center Content Area */}
        <div
          className="flex-1 overflow-y-auto min-h-0 min-w-0 hub-content-wrapper relative"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div
                key="tab-chat"
                initial={prefersReduced ? false : "hidden"}
                animate={prefersReduced ? false : "show"}
                exit="exit"
                variants={tabContentVariant}
                className="h-full w-full hub-section-chat p-3 sm:p-5"
              >
                {enrollments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 text-[#C9A96E] flex items-center justify-center mb-4">
                      <MessageSquare size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E1B2E] mb-1">No course chat rooms unlocked yet</h3>
                    <p className="text-xs font-medium text-[#8E8E93] max-w-sm mb-6">Enroll in a course to join live student discussions and peer study rooms.</p>
                    <button onClick={() => router.push("/dashboard/student/courses")} className="h-10 px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-xs cursor-pointer shadow-sm">
                      Explore Courses
                    </button>
                  </div>
                ) : (
                  <HubCourseChat enrollments={enrollments} currentUser={currentUser} />
                )}
              </motion.div>
            )}

            {activeTab === "forum" && (
              <motion.div
                key="tab-forum"
                initial={prefersReduced ? false : "hidden"}
                animate={prefersReduced ? false : "show"}
                exit="exit"
                variants={tabContentVariant}
                className="h-full w-full hub-section-forum p-3 sm:p-5"
              >
                <HubQAForum />
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div
                key="tab-messages"
                initial={prefersReduced ? false : "hidden"}
                animate={prefersReduced ? false : "show"}
                exit="exit"
                variants={tabContentVariant}
                className="h-full w-full hub-section-messages p-3 sm:p-5"
              >
                <HubMessages />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
