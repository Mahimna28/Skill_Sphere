"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, HelpCircle, Mail, Search, Plus, CheckCircle, Clock, Star, ChevronDown } from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/animations";

type Tab = "discussions" | "course-chat" | "direct-messages";

export default function TeacherCommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("discussions");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "discussions" as Tab, label: "Discussions", icon: HelpCircle, count: 18 },
    { id: "course-chat" as Tab, label: "Course Chat", icon: MessageCircle, count: 4 },
    { id: "direct-messages" as Tab, label: "Messages", icon: Mail, count: 3 },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-[#F5F1EB]">
      {/* Header */}
      <div className="bg-white border-b border-[rgba(30,27,46,0.06)] px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-[#1E1B2E]">Community</h1>
            <p className="text-sm text-[#8E8E93] mt-1">
              Connect with students, answer questions, and collaborate with peers
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, chats..."
              className="w-full h-10 rounded-xl border border-[rgba(30,27,46,0.1)] bg-[#F5F1EB] pl-10 pr-4 text-sm text-[#1E1B2E] placeholder:text-[#8E8E93] focus:border-[#C9A96E] focus:ring-2 focus:ring-[rgba(201,169,110,0.15)] outline-none transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  activeTab === tab.id 
                    ? "bg-[#C9A96E] text-[#1E1B2E]" 
                    : "bg-[rgba(201,169,110,0.15)] text-[#C9A96E]"
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="teacherActiveTab"
                  className="absolute inset-0 rounded-xl border-2 border-[#C9A96E]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "discussions" && <TeacherDiscussionsTab />}
            {activeTab === "course-chat" && <TeacherCourseChatTab />}
            {activeTab === "direct-messages" && <TeacherDirectMessagesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TeacherDiscussionsTab() {
  const categories = ["All", "My Courses", "Unanswered", "Resolved", "Programming", "AI & ML", "Web Dev"];
  const [activeCategory, setActiveCategory] = useState("All");

  const discussions = [
    {
      id: 1,
      title: "How do I understand backpropagation intuitively?",
      author: "Alex Chen",
      avatar: "/avatars/alex.jpg",
      course: "AI & ML",
      replies: 12,
      views: 234,
      isResolved: true,
      isPinned: false,
      timeAgo: "2h ago",
      preview: "I've been struggling with the math behind backpropagation. Can someone explain it like I'm five?",
      myAnswer: false,
    },
    {
      id: 2,
      title: "What is TensorFlow and where is it used?",
      author: "Mahimna Mistry",
      avatar: "/avatars/mahimna.jpg",
      course: "AI & ML",
      replies: 1,
      views: 89,
      isResolved: true,
      isPinned: false,
      timeAgo: "2 days ago",
      preview: "wanna know what are its uses and where it is used",
      myAnswer: true,
    },
    {
      id: 3,
      title: "what is java?",
      author: "jal",
      avatar: "/avatars/jal.jpg",
      course: "Programming",
      replies: 1,
      views: 45,
      isResolved: true,
      isPinned: false,
      timeAgo: "3/5/2026",
      preview: "what is java?",
      myAnswer: true,
    },
  ];

  return (
    <div className="max-w-4xl">
      {/* Category Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === cat
                ? "bg-[#1E1B2E] text-white"
                : "bg-white border border-[rgba(30,27,46,0.08)] text-[#8E8E93] hover:text-[#1E1B2E] hover:border-[rgba(30,27,46,0.12)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* New Question Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A96E] text-[#1E1B2E] text-sm font-medium hover:bg-[#B89A60] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Ask a Question
      </motion.button>

      {/* Discussion List */}
      <div className="space-y-3">
        {discussions.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                {d.author[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[#1E1B2E]">{d.author}</span>
                    <span className="text-xs text-[#8E8E93]">@{d.author.toLowerCase().replace(" ", "_")} • Student</span>
                  </div>
                  <span className="text-xs text-[#8E8E93]">{d.timeAgo}</span>
                </div>
                
                <h3 className="font-heading text-xl text-[#1E1B2E] mb-2">{d.title}</h3>
                <p className="text-sm text-[#8E8E93] mb-3">{d.preview}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-[#8E8E93]">
                    <span className="flex items-center gap-1 text-[#C9A96E]">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {d.replies} {d.replies === 1 ? "Answer" : "Answers"}
                    </span>
                    {d.isResolved && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                    {d.myAnswer && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Star className="w-3.5 h-3.5" />
                        You answered
                      </span>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-lg hover:bg-[#F5F1EB] flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TeacherCourseChatTab() {
  const courses = [
    { id: 1, name: "Python Programming", unread: 5, lastMessage: "Can someone explain list comprehensions?", time: "5m ago", students: 45, color: "#C9A96E" },
    { id: 2, name: "AI & Machine Learning", unread: 0, lastMessage: "Great session today!", time: "2h ago", students: 32, color: "#1E1B2E" },
    { id: 3, name: "Web Development", unread: 2, lastMessage: "When is the next assignment due?", time: "1d ago", students: 56, color: "#8E8E93" },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-xl text-[#1E1B2E] mb-5">Your Course Chats</h2>
      
      <div className="space-y-3">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex items-center gap-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${course.color}15` }}
            >
              <MessageCircle className="w-6 h-6" style={{ color: course.color }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-[#1E1B2E]">{course.name}</h3>
                <span className="text-xs text-[#8E8E93]">{course.time}</span>
              </div>
              <p className="text-sm text-[#8E8E93] truncate">{course.lastMessage}</p>
              <p className="text-xs text-[#8E8E93] mt-1">{course.students} students</p>
            </div>
            
            {course.unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-[#C9A96E] text-[#1E1B2E] text-xs font-bold flex items-center justify-center flex-shrink-0"
              >
                {course.unread}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TeacherDirectMessagesTab() {
  const conversations = [
    { id: 1, name: "Mahimna Mistry", avatar: "/avatars/mahimna.jpg", role: "Student", lastMessage: "Thank you for the clarification!", time: "10m ago", unread: 2, online: true, course: "AI & ML" },
    { id: 2, name: "jal", avatar: "/avatars/jal.jpg", role: "Student", lastMessage: "When is the next assignment due?", time: "1h ago", unread: 0, online: false, course: "Programming" },
    { id: 3, name: "Prof. Sarah Johnson", avatar: "/avatars/sarah.jpg", role: "Instructor", lastMessage: "Let's discuss the curriculum update", time: "3h ago", unread: 1, online: true, course: null },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="font-heading text-xl text-[#1E1B2E] mb-5">Direct Messages</h2>
      
      <div className="space-y-2">
        {conversations.map((conv, i) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(201,169,110,0.03)" }}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)] flex items-center gap-4 cursor-pointer transition-all"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                {conv.name[0].toUpperCase()}
              </div>
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="font-medium text-[#1E1B2E]">{conv.name}</h3>
                <span className="text-xs text-[#8E8E93]">{conv.time}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F1EB] text-[#8E8E93]">
                  {conv.role}
                </span>
                {conv.course && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(201,169,110,0.1)] text-[#C9A96E]">
                    {conv.course}
                  </span>
                )}
              </div>
              <p className={`text-sm truncate ${conv.unread > 0 ? "text-[#1E1B2E] font-medium" : "text-[#8E8E93]"}`}>
                {conv.lastMessage}
              </p>
            </div>
            
            {conv.unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-[#C9A96E] text-[#1E1B2E] text-xs font-bold flex items-center justify-center flex-shrink-0"
              >
                {conv.unread}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
