"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, HelpCircle, Mail, Search, Plus, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type Tab = "discussions" | "course-chat" | "direct-messages";

function CommunityHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam && ["discussions", "course-chat", "direct-messages"].includes(tabParam)
      ? tabParam
      : "discussions"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeTab !== tabParam) {
      router.push(`/dashboard/student/community?tab=${activeTab}`, { scroll: false });
    }
  }, [activeTab, router, tabParam]);

  useEffect(() => {
    if (tabParam && ["discussions", "course-chat", "direct-messages"].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const tabs = [
    { id: "discussions" as Tab, label: "Discussions", icon: HelpCircle, count: 24 },
    { id: "course-chat" as Tab, label: "Course Chat", icon: MessageCircle, count: 3 },
    { id: "direct-messages" as Tab, label: "Messages", icon: Mail, count: 5 },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-[#F5F1EB]">
      {/* Header */}
      <div className="bg-white border-b border-[rgba(30,27,46,0.06)] px-8 py-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-[#1E1B2E]">Community</h1>
            <p className="text-sm text-[#8E8E93] mt-1">Connect, discuss, and learn together</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, chats..."
              className="w-full h-10 rounded-xl border border-[rgba(30,27,46,0.1)] bg-[#F5F1EB] pl-10 pr-4 text-sm text-[#1E1B2E] placeholder:text-[#8E8E93] focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] outline-none transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#1E1B2E] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  : "text-[#8E8E93] hover:text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-[#C9A96E] text-[#1E1B2E]" : "bg-[rgba(201,169,110,0.15)] text-[#C9A96E]"
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full">
            {activeTab === "discussions" && <DiscussionsTab searchQuery={searchQuery} />}
            {activeTab === "course-chat" && <CourseChatTab />}
            {activeTab === "direct-messages" && <DirectMessagesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Community...</div>}>
      <CommunityHubContent />
    </Suspense>
  );
}

function DiscussionsTab({ searchQuery }: { searchQuery: string }) {
  const categories = ["All", "Programming", "AI & ML", "Web Dev", "Data Science", "Career"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const discussions = [
    {
      id: 1, title: "How do I understand backpropagation intuitively?",
      author: "Alex Chen", avatar: "https://i.pravatar.cc/150?u=1", category: "AI & ML",
      replies: 12, views: 234, isResolved: true, timeAgo: "2h ago",
      preview: "I've been struggling with the math behind backpropagation. Can someone explain it like I'm five?",
    },
    {
      id: 2, title: "React Server Components vs Client Components",
      author: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=2", category: "Web Dev",
      replies: 8, views: 156, isResolved: false, timeAgo: "5h ago",
      preview: "When exactly should I use 'use client'? I'm getting hydration errors when mixing them.",
    },
    {
      id: 3, title: "Best resources for competitive programming?",
      author: "Priya Sharma", avatar: "https://i.pravatar.cc/150?u=6", category: "Programming",
      replies: 15, views: 312, isResolved: false, timeAgo: "1d ago",
      preview: "Looking for structured resources to improve DSA for coding interviews.",
    },
  ];

  const filtered = discussions.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === cat ? "bg-[#1E1B2E] text-white"
              : "bg-white border border-[rgba(30,27,46,0.08)] text-[#8E8E93] hover:text-[#1E1B2E] hover:border-[rgba(30,27,46,0.12)]"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => setShowNewForm(!showNewForm)}
        className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-sm font-medium hover:bg-[#B89A60] transition-colors">
        <Plus className="w-4 h-4" />
        Ask a Question
      </motion.button>

      {/* New Question Form */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="mb-6 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] overflow-hidden">
            <h3 className="font-medium text-[#1E1B2E] mb-3">New Question</h3>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Your question title..."
              className="w-full mb-3 px-4 py-2.5 rounded-xl border border-[rgba(30,27,46,0.1)] text-sm focus:border-[#C9A96E] outline-none transition-colors" />
            <textarea rows={3} value={newContent} onChange={(e) => setNewContent(e.target.value)}
              placeholder="Add more context..."
              className="w-full mb-3 px-4 py-2.5 rounded-xl border border-[rgba(30,27,46,0.1)] text-sm focus:border-[#C9A96E] outline-none transition-colors resize-none" />
            <div className="flex gap-2">
              <button onClick={() => { setShowNewForm(false); setNewTitle(""); setNewContent(""); }}
                className="px-4 py-2 rounded-xl border border-[rgba(30,27,46,0.1)] text-sm text-[#8E8E93] hover:text-[#1E1B2E] transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-xl bg-[#1E1B2E] text-white text-sm font-medium hover:bg-[#2A2640] transition-colors">
                Post Question
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filtered.length > 0 ? filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.avatar} alt={d.author} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[#1E1B2E]">{d.title}</h3>
                  {d.isResolved && (
                    <span className="px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] text-green-600 text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#8E8E93] line-clamp-2 mb-3">{d.preview}</p>
                <div className="flex items-center gap-4 text-xs text-[#8E8E93]">
                  <span>{d.author}</span><span>•</span>
                  <span className="text-[#C9A96E]">{d.category}</span><span>•</span>
                  <span>{d.replies} replies</span><span>•</span>
                  <span>{d.views} views</span><span>•</span>
                  <span>{d.timeAgo}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-12 text-[#8E8E93]">No discussions found.</div>
        )}
      </div>
    </div>
  );
}

function CourseChatTab() {
  const [openCourse, setOpenCourse] = useState<null | { id: number; name: string; color: string }>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ text: string; mine: boolean; time: string }[]>([
    { text: "Welcome to the course chat! Ask anything.", mine: false, time: "10:00 AM" },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const courses = [
    { id: 1, name: "Python Programming", unread: 5, lastMessage: "Can someone explain list comprehensions?", time: "5m ago", color: "#C9A96E" },
    { id: 2, name: "AI & Machine Learning", unread: 0, lastMessage: "Great session today!", time: "2h ago", color: "#1E1B2E" },
    { id: 3, name: "Web Development", unread: 2, lastMessage: "When is the next assignment due?", time: "1d ago", color: "#8E8E93" },
  ];

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [...prev, { text: chatMessage, mine: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setChatMessage("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (openCourse) {
    return (
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setOpenCourse(null)} className="p-2 hover:bg-[rgba(30,27,46,0.06)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#1E1B2E]" />
          </button>
          <h2 className="font-heading text-xl text-[#1E1B2E]">{openCourse.name}</h2>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.mine ? "bg-[#1E1B2E] text-white rounded-tr-sm" : "bg-[#F5F1EB] text-[#1E1B2E] rounded-tl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.mine ? "text-white/50" : "text-[#8E8E93]"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-[rgba(30,27,46,0.06)] flex gap-3">
            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 h-10 rounded-xl border border-[rgba(30,27,46,0.1)] bg-[#F5F1EB] px-4 text-sm outline-none focus:border-[#C9A96E] transition-colors" />
            <button onClick={sendMessage}
              className="w-10 h-10 rounded-xl bg-[#C9A96E] text-[#1E1B2E] flex items-center justify-center hover:bg-[#B89A60] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-heading text-xl text-[#1E1B2E] mb-5">Your Course Chats</h2>
      <div className="space-y-3">
        {courses.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.01 }}
            onClick={() => setOpenCourse(course)}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${course.color}15` }}>
              <MessageCircle className="w-6 h-6" style={{ color: course.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-[#1E1B2E]">{course.name}</h3>
                <span className="text-xs text-[#8E8E93]">{course.time}</span>
              </div>
              <p className="text-sm text-[#8E8E93] truncate">{course.lastMessage}</p>
            </div>
            {course.unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-[#C9A96E] text-[#1E1B2E] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {course.unread}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DirectMessagesTab() {
  const router = useRouter();
  const [openConv, setOpenConv] = useState<null | { id: number; name: string; avatar: string; role: string }>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ text: string; mine: boolean; time: string }[]>([
    { text: "Hello! How can I help you?", mine: false, time: "10:00 AM" },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const conversations = [
    { id: 1, name: "Prof. Sarah Johnson", avatar: "https://i.pravatar.cc/150?u=3", role: "Instructor", lastMessage: "Great question! Let me clarify...", time: "10m ago", unread: 2, online: true },
    { id: 2, name: "Mike Ross", avatar: "https://i.pravatar.cc/150?u=4", role: "Student", lastMessage: "Did you finish the assignment?", time: "1h ago", unread: 0, online: false },
    { id: 3, name: "Emma Watson", avatar: "https://i.pravatar.cc/150?u=5", role: "Student", lastMessage: "Thanks for the help!", time: "3h ago", unread: 1, online: true },
  ];

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [...prev, { text: chatMessage, mine: true, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setChatMessage("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (openConv) {
    return (
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setOpenConv(null)} className="p-2 hover:bg-[rgba(30,27,46,0.06)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#1E1B2E]" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={openConv.avatar} alt={openConv.name} className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="font-medium text-[#1E1B2E] text-[14px]">{openConv.name}</p>
            <p className="text-[12px] text-[#8E8E93]">{openConv.role}</p>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.mine ? "bg-[#1E1B2E] text-white rounded-tr-sm" : "bg-[#F5F1EB] text-[#1E1B2E] rounded-tl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.mine ? "text-white/50" : "text-[#8E8E93]"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-[rgba(30,27,46,0.06)] flex gap-3">
            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 h-10 rounded-xl border border-[rgba(30,27,46,0.1)] bg-[#F5F1EB] px-4 text-sm outline-none focus:border-[#C9A96E] transition-colors" />
            <button onClick={sendMessage}
              className="w-10 h-10 rounded-xl bg-[#C9A96E] text-[#1E1B2E] flex items-center justify-center hover:bg-[#B89A60] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-heading text-xl text-[#1E1B2E] mb-5">Direct Messages</h2>
      <div className="space-y-2">
        {conversations.map((conv, i) => (
          <motion.div key={conv.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.01 }}
            onClick={() => setOpenConv(conv)}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
              {conv.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="font-medium text-[#1E1B2E]">{conv.name}</h3>
                <span className="text-xs text-[#8E8E93]">{conv.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F1EB] text-[#8E8E93]">{conv.role}</span>
              </div>
              <p className={`text-sm truncate ${conv.unread > 0 ? "text-[#1E1B2E] font-medium" : "text-[#8E8E93]"}`}>
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-[#C9A96E] text-[#1E1B2E] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {conv.unread}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

