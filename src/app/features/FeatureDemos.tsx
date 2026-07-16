"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Play, CheckCircle2, MessageSquare, Plus, Search, Star, Users, Trophy, MoreVertical, Flag, Shield, FileText, Bookmark, Heart, Reply, Search as SearchIcon, Filter } from "lucide-react";
import Image from "next/image";

// 1. AI Study Tutor
export function AITutorDemo() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm your AI Study Tutor. What would you like to learn today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", content: "That's a great question! Let's break it down step-by-step." }]);
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans text-sm relative z-10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-[#FAFAFA]">
        <div className="w-8 h-8 rounded-full bg-[#1E1B2E] flex items-center justify-center">
          <Bot size={16} className="text-[#C9A96E]" />
        </div>
        <div>
          <h4 className="font-semibold text-[#1E1B2E]">AI Study Tutor</h4>
          <p className="text-xs text-[#8E8E93]">Online &bull; Ready to help</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white custom-scrollbar flex flex-col min-h-[200px]">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-[#C9A96E]" : "bg-[#1E1B2E]"}`}>
              {msg.role === "user" ? <User size={12} className="text-[#1E1B2E]" /> : <Bot size={12} className="text-[#C9A96E]" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-[#1E1B2E] text-white rounded-tr-sm" : "bg-[#F5F1EB] text-[#1E1B2E] rounded-tl-sm"}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-none pb-1">
          {["Explain Quantum Physics", "Quiz me on History", "Review my code"].map(pill => (
            <button 
              key={pill} 
              onClick={() => setInput(pill)}
              className="px-3 py-1.5 rounded-full bg-[#F5F1EB] text-[#1E1B2E] text-xs font-medium whitespace-nowrap hover:bg-[#E8E4DD] transition-colors shrink-0"
            >
              {pill}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..." 
            className="w-full bg-[#F5F1EB] border-none rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-1 focus:ring-[#C9A96E] outline-none"
          />
          <button onClick={handleSend} className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center bg-[#1E1B2E] text-[#C9A96E] rounded-full hover:bg-black transition-colors">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Interactive Courses
export function CourseCardDemo() {
  return (
    <div className="w-full h-full bg-[#F5F1EB] flex items-center justify-center p-6 relative z-10 rounded-2xl overflow-hidden">
      <motion.div 
        whileHover={{ y: -5 }}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="relative h-40 bg-[#1E1B2E] overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-50 transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Enrolled
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
            <button className="w-12 h-12 bg-[#C9A96E] rounded-full flex items-center justify-center text-[#1E1B2E] shadow-lg transform transition hover:scale-110">
              <Play size={20} className="ml-1" />
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 text-xs text-[#8E8E93] font-medium uppercase tracking-wider">
            <span>Computer Science</span> &bull; <span>Advanced</span>
          </div>
          <h3 className="font-heading text-xl text-[#1E1B2E] mb-2 leading-tight">Advanced Data Structures in TypeScript</h3>
          
          <div className="mt-4 mb-2 flex justify-between items-end">
            <span className="text-sm font-semibold text-[#1E1B2E]">65% Complete</span>
            <span className="text-xs text-[#8E8E93]">Module 4 of 6</span>
          </div>
          <div className="w-full h-2 bg-[#F5F1EB] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "65%" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-[#1E1B2E] rounded-full" 
            />
          </div>
          
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
            <button className="text-[#1E1B2E] text-sm font-medium hover:text-[#C9A96E] transition-colors">
              Resume Course
            </button>
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-[#F5F1EB] flex items-center justify-center text-[10px] text-[#8E8E93] font-medium">+42</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 3. Course Chat
export function CourseChatDemo() {
  const [activeTab, setActiveTab] = useState("General");
  return (
    <div className="w-full h-full bg-white flex flex-col font-sans relative z-10 rounded-2xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex gap-4 overflow-x-auto scrollbar-none bg-[#FAFAFA]">
        {["General", "Help", "Announcements"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? "border-[#C9A96E] text-[#1E1B2E]" : "border-transparent text-[#8E8E93]"}`}
          >
            #{tab}
            {tab === "Help" && <span className="ml-1.5 w-2 h-2 inline-block rounded-full bg-green-500" />}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white min-h-[250px]">
        {[
          { name: "Sarah Chen", time: "10:42 AM", text: "Has anyone figured out the solution to problem 3 in the assignment?", avatar: "S", color: "bg-blue-100 text-blue-700" },
          { name: "Prof. Davis", time: "10:45 AM", text: "Check the pinned resources, I uploaded a hint video yesterday.", avatar: "D", color: "bg-[#1E1B2E] text-[#C9A96E]", badge: "Instructor" },
          { name: "Alex Kumar", time: "10:47 AM", text: "Ah found it! Thanks professor.", avatar: "A", color: "bg-purple-100 text-purple-700" },
        ].map((msg, i) => (
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${msg.color}`}>
              {msg.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-[#1E1B2E]">{msg.name}</span>
                {msg.badge && <span className="bg-[#C9A96E]/20 text-[#B8956A] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">{msg.badge}</span>}
                <span className="text-xs text-[#8E8E93]">{msg.time}</span>
              </div>
              <p className="text-sm text-[#1E1B2E]/80 bg-[#F5F1EB] p-2.5 rounded-lg rounded-tl-none inline-block">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="bg-[#F5F1EB] rounded-lg p-1.5 flex items-center">
          <button className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-[#1E1B2E] transition-colors"><Plus size={18} /></button>
          <input type="text" placeholder={`Message #${activeTab}...`} className="flex-1 bg-transparent border-none text-sm outline-none px-2" />
          <button className="w-8 h-8 flex items-center justify-center text-white bg-[#1E1B2E] rounded-md transition-transform hover:scale-105"><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// 4. Q&A Forum
export function QAForumDemo() {
  return (
    <div className="w-full h-full bg-[#F5F1EB] p-4 flex flex-col gap-4 font-sans overflow-y-auto relative z-10 rounded-2xl">
      <div className="flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#1E1B2E] text-white text-xs font-medium rounded-full">All Questions</button>
          <button className="px-3 py-1.5 bg-white text-[#8E8E93] text-xs font-medium rounded-full border border-gray-200 hover:border-[#1E1B2E]">Unanswered</button>
        </div>
        <button className="bg-[#C9A96E] text-[#1E1B2E] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#b5955a] transition-colors"><Plus size={14} /> Ask</button>
      </div>
      
      <div className="flex-1 space-y-3 min-h-[200px]">
        {[
          { title: "React useEffect dependency array not triggering?", tags: ["React", "Hooks"], answers: 3, resolved: true },
          { title: "Difference between TCP and UDP in real terms?", tags: ["Networking"], answers: 1, resolved: false },
          { title: "How to perfectly center a div?", tags: ["CSS"], answers: 42, resolved: true }
        ].map((q, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2 }} key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[#1E1B2E] text-sm leading-snug">{q.title}</h4>
              {q.resolved && <CheckCircle2 size={16} className="text-green-500 shrink-0 ml-2" />}
            </div>
            <div className="flex gap-2 mb-4">
              {q.tags.map(t => <span key={t} className="text-[10px] bg-[#F5F1EB] text-[#8E8E93] px-2 py-0.5 rounded">{t}</span>)}
            </div>
            <div className="flex justify-between items-center text-xs text-[#8E8E93]">
              <div className="flex items-center gap-1"><MessageSquare size={12} /> {q.answers} Answers</div>
              <span>Posted 2h ago</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 5. Direct Messages
export function DirectMessagesDemo() {
  return (
    <div className="w-full h-full bg-white flex font-sans relative z-10 rounded-2xl overflow-hidden min-h-[300px]">
      <div className="w-2/5 border-r border-gray-100 flex flex-col bg-[#FAFAFA]">
        <div className="p-3 border-b border-gray-100">
          <div className="bg-white border border-gray-200 rounded-full flex items-center px-3 py-1.5">
            <SearchIcon size={14} className="text-gray-400 shrink-0" />
            <input type="text" placeholder="Search..." className="w-full text-xs outline-none ml-2 bg-transparent" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { name: "Emily Watson", msg: "Are we still meeting?", active: true },
            { name: "John Doe", msg: "Thanks for the notes!", active: false },
            { name: "Prof. Smith", msg: "Your assignment is graded.", active: false }
          ].map((c, i) => (
            <div key={i} className={`p-3 flex items-center gap-3 cursor-pointer ${c.active ? "bg-[#1E1B2E] text-white" : "hover:bg-gray-50"}`}>
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 relative">
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
              </div>
              <div className="overflow-hidden">
                <h5 className={`text-sm font-semibold truncate ${c.active ? "text-white" : "text-[#1E1B2E]"}`}>{c.name}</h5>
                <p className={`text-xs truncate ${c.active ? "text-gray-300" : "text-[#8E8E93]"}`}>{c.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
          <span className="font-semibold text-[#1E1B2E] text-sm">Emily Watson</span>
          <MoreVertical size={16} className="text-[#8E8E93]" />
        </div>
        <div className="flex-1 p-4 bg-[#F5F1EB] flex flex-col justify-end">
          <div className="bg-[#1E1B2E] text-white text-sm p-3 rounded-2xl rounded-tr-sm self-end max-w-[80%] mb-2">
            Are we still meeting at 4 PM for the project?
          </div>
        </div>
        <div className="p-3 border-t border-gray-100 bg-white">
          <input type="text" placeholder="Message Emily..." className="w-full bg-[#F5F1EB] rounded-full px-4 py-2 text-sm outline-none" />
        </div>
      </div>
    </div>
  );
}

// 6. Leaderboard
export function LeaderboardDemo() {
  const users = [
    { rank: 1, name: "Alex K.", score: "2,450", streak: 12 },
    { rank: 2, name: "Sarah C.", score: "2,100", streak: 5 },
    { rank: 3, name: "David M.", score: "1,980", streak: 8 },
    { rank: 4, name: "You", score: "1,850", streak: 3 },
    { rank: 5, name: "Mia L.", score: "1,700", streak: 2 },
  ];
  return (
    <div className="w-full h-full bg-[#1E1B2E] p-6 font-sans flex flex-col relative z-10 rounded-2xl overflow-hidden min-h-[300px]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-white font-heading text-xl flex items-center gap-2"><Trophy className="text-[#C9A96E]" size={20} /> Global Top</h3>
        <select className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20 outline-none">
          <option>This Week</option>
        </select>
      </div>
      <div className="flex-1 bg-white/5 rounded-xl border border-white/10 overflow-y-auto flex flex-col custom-scrollbar">
        {users.map((u, i) => (
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className={`flex items-center gap-4 p-3 border-b border-white/5 ${u.name === 'You' ? 'bg-[#C9A96E]/20' : 'hover:bg-white/5'}`}>
            <span className={`w-5 font-bold text-center ${i===0?'text-yellow-400':i===1?'text-gray-300':i===2?'text-amber-600':'text-white/50'}`}>{u.rank}</span>
            <div className="w-8 h-8 rounded-full bg-white/20 shrink-0" />
            <span className="text-white font-medium flex-1">{u.name}</span>
            <div className="flex flex-col items-end">
              <span className="text-white font-bold">{u.score} <span className="text-[10px] text-white/50 font-normal">XP</span></span>
              <span className="text-[#C9A96E] text-[10px] font-medium flex items-center gap-1">🔥 {u.streak} days</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 7. Institution
export function InstitutionDemo() {
  return (
    <div className="w-full h-full bg-[#F5F1EB] p-4 flex flex-col font-sans relative z-10 rounded-2xl overflow-hidden min-h-[250px]">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100 flex justify-between items-center shrink-0">
        <div>
          <h4 className="font-heading text-lg text-[#1E1B2E]">Stanford Univ.</h4>
          <p className="text-xs text-[#8E8E93]">Institution Dashboard</p>
        </div>
        <button className="bg-[#1E1B2E] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-black transition-colors">+ Add Dept</button>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
        {[
          { name: "Computer Science", students: 450, teachers: 24 },
          { name: "Engineering", students: 320, teachers: 18 },
          { name: "Mathematics", students: 210, teachers: 12 },
          { name: "Physics", students: 180, teachers: 10 },
        ].map((dept, i) => (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2 }} key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
            <h5 className="font-semibold text-sm text-[#1E1B2E] mb-3 leading-snug">{dept.name}</h5>
            <div className="flex justify-between text-xs text-[#8E8E93]">
              <span className="flex items-center gap-1"><Users size={12} /> {dept.students}</span>
              <span className="flex items-center gap-1"><User size={12} /> {dept.teachers}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 8. Parent Portal
export function ParentPortalDemo() {
  return (
    <div className="w-full h-full bg-white flex flex-col font-sans border-l-[6px] border-[#C9A96E] relative z-10 rounded-2xl overflow-hidden min-h-[250px]">
      <div className="p-4 border-b border-gray-100 bg-[#FAFAFA] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">MK</div>
          <div>
            <h4 className="font-semibold text-[#1E1B2E] text-sm">Mia's Progress</h4>
            <select className="text-[10px] text-[#8E8E93] bg-transparent outline-none cursor-pointer">
              <option>Current Semester</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4 shrink-0">
        <div className="bg-[#F5F1EB] rounded-xl p-3 hover:bg-[#E8E4DD] transition-colors cursor-pointer">
          <p className="text-xs text-[#8E8E93] mb-1">Average Grade</p>
          <p className="font-heading text-2xl text-[#1E1B2E]">A-</p>
        </div>
        <div className="bg-[#F5F1EB] rounded-xl p-3 hover:bg-[#E8E4DD] transition-colors cursor-pointer">
          <p className="text-xs text-[#8E8E93] mb-1">Attendance</p>
          <p className="font-heading text-2xl text-[#1E1B2E]">98%</p>
        </div>
      </div>
      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        <h5 className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E] mb-3">Recent Activity</h5>
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="flex gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-[#1E1B2E]">Completed <b className="font-semibold">Math Assignment</b></p>
              <p className="text-[10px] text-[#8E8E93]">2 hours ago</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-[#1E1B2E]">Teacher note: "Great participation!"</p>
              <p className="text-[10px] text-[#8E8E93]">Yesterday</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 9. Feedback
export function FeedbackDemo() {
  const [active, setActive] = useState("Bug");
  return (
    <div className="w-full h-full bg-[#F5F1EB] p-6 flex flex-col justify-center items-center font-sans relative z-10 rounded-2xl">
      <motion.div whileHover={{ y: -5 }} className="bg-white w-full max-w-sm rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-5 border border-gray-100">
        <h3 className="font-heading text-xl text-[#1E1B2E] mb-1">Submit Feedback</h3>
        <p className="text-xs text-[#8E8E93] mb-4">Your voice helps us improve.</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["Idea", "Bug", "Other"].map(type => (
            <button 
              key={type}
              onClick={() => setActive(type)}
              className={`py-2 rounded-lg text-xs font-medium border transition-colors ${active === type ? "bg-[#1E1B2E] text-white border-[#1E1B2E]" : "bg-white text-[#8E8E93] border-gray-200 hover:border-[#1E1B2E]"}`}
            >
              {type}
            </button>
          ))}
        </div>
        <textarea 
          placeholder={`Describe your ${active.toLowerCase()}...`}
          className="w-full bg-[#F5F1EB] rounded-xl p-3 text-sm outline-none resize-none h-24 mb-4 border border-transparent focus:border-[#C9A96E] transition-colors custom-scrollbar"
        />
        <button className="w-full bg-[#C9A96E] text-[#1E1B2E] font-semibold py-2.5 rounded-xl transition-transform hover:bg-[#b5955a]">
          Submit
        </button>
      </motion.div>
    </div>
  );
}

// 10. Blog
export function BlogDemo() {
  return (
    <div className="w-full h-full bg-white flex flex-col font-sans relative z-10 rounded-2xl overflow-hidden min-h-[300px]">
      <div className="h-32 bg-[#1E1B2E] relative overflow-hidden shrink-0 group">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-[#1E1B2E] to-transparent">
          <span className="text-[#C9A96E] text-[10px] font-bold uppercase tracking-wider mb-1">Featured</span>
          <h3 className="text-white font-heading text-lg leading-tight line-clamp-1">The Future of AI in Education</h3>
        </div>
      </div>
      <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none border-b border-gray-100 shrink-0">
        <button className="bg-[#1E1B2E] text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">All</button>
        <button className="bg-[#F5F1EB] text-[#8E8E93] hover:text-[#1E1B2E] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors">Tutorials</button>
        <button className="bg-[#F5F1EB] text-[#8E8E93] hover:text-[#1E1B2E] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors">News</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {[
          { title: "10 Tips for Better Code Reviews", date: "Mar 12", time: "4 min read" },
          { title: "How to Ace Your Next Tech Interview", date: "Mar 10", time: "6 min read" },
          { title: "Understanding React Server Components", date: "Mar 8", time: "8 min read" },
        ].map((article, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-3 cursor-pointer group">
            <div className="w-16 h-16 rounded-lg bg-[#F5F1EB] shrink-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-[#1E1B2E]/5 group-hover:bg-transparent transition-colors" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1E1B2E] text-sm leading-tight group-hover:text-[#C9A96E] transition-colors">{article.title}</h4>
              <p className="text-[10px] text-[#8E8E93] mt-1">{article.date} &bull; {article.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
