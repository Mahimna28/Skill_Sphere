"use client";

import React, { useState } from "react";
import { 
  BookOpen, Users, MessageSquare, HelpCircle, 
  Settings, Grid, Trophy, Sparkles, Building2,
  Home, Clock, Bookmark, TrendingUp, Play, ChevronRight,
  CheckCircle2, Flame, Bell, Menu, X, Send, Search
} from "lucide-react";

export function StudentDemo({ isMobile = false }: { isMobile?: boolean }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const navItems = [
    { id: "overview", label: "Overview", icon: Grid },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "ai-tutor", label: "AI Study Tutor", icon: Sparkles },
    { id: "institutions", label: "Institutions", icon: Building2 },
    { id: "community", label: "Community Hub", icon: Users, isExpandable: true },
    ...(isCommunityOpen ? [
      { id: "chat", label: "Chat", icon: MessageSquare, isSub: true },
      { id: "forum", label: "Forum", icon: HelpCircle, isSub: true },
      { id: "messages", label: "Messages", icon: MessageSquare, isSub: true },
    ] : []),
    { id: "feedback", label: "Give Feedback", icon: Settings },
  ];

  const handleNavClick = (item: any) => {
    if (item.isExpandable) {
      setIsCommunityOpen(!isCommunityOpen);
    } else {
      setActiveTab(item.id);
      if (isMobile) setIsMobileMenuOpen(false);
    }
  };

  const Sidebar = () => (
    <aside className={"flex-shrink-0 bg-[#1E1B2E] text-white flex flex-col overflow-y-auto hide-scrollbar z-50 " + (isMobile ? "w-64 h-full" : "w-[240px]")}>
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-8">
          <span className="font-heading text-2xl font-bold text-white tracking-tight">Skill Sphere</span>
          {isMobile && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* User Profile in Sidebar */}
        <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 flex items-center justify-center border border-[#C9A96E]/50">
            <span className="text-[#C9A96E] font-bold">U</span>
          </div>
          <div>
            <div className="font-bold text-sm">User</div>
            <div className="text-[10px] text-[#C9A96E] uppercase tracking-wider font-bold">Student</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={"w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors " + (
              activeTab === item.id 
                ? "bg-[#C9A96E]/10 text-[#C9A96E] font-medium" 
                : "text-white/70 hover:bg-white/5 hover:text-white"
            ) + (item.isSub ? " ml-4 w-[calc(100%-1rem)]" : "")}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white">
            <Home className="w-3.5 h-3.5" />
          </div>
          <span>Home</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-full w-full bg-[#F5F1EB] font-sans text-[#1E1B2E] relative overflow-hidden text-left">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Drawer */}
      {isMobile && (
        <div className={"fixed inset-0 z-50 bg-black/50 transition-opacity " + (isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
          <div className={"h-full transition-transform duration-300 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative hide-scrollbar flex flex-col h-full">
        {/* Mobile Header */}
        {isMobile && (
          <header className="bg-white border-b border-[rgba(30,27,46,0.05)] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-5 h-5 text-[#1E1B2E]" />
              </button>
              <span className="font-heading font-bold text-lg">Skill Sphere</span>
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-[#1E1B2E]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </div>
          </header>
        )}

        <div className={"flex-1 " + (isMobile ? "p-4" : "p-8")}>
          {/* Desktop Top Header */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold">Overview</h1>
              <div className="flex items-center gap-4">
                <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#C9A96E]/30">STUDENT</span>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border border-[rgba(30,27,46,0.1)] flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition">
                    <Bell className="w-4 h-4 text-[#1E1B2E]" />
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C9A96E]/20 overflow-hidden border border-[#C9A96E]/50 flex items-center justify-center text-[#C9A96E] font-bold text-xs">
                  U
                </div>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className={"space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10"}>
              {/* Welcome Banner */}
              <div className={"bg-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm border border-[rgba(30,27,46,0.04)] " + (isMobile ? "flex flex-col gap-6" : "flex justify-between items-center")}>
                <div className="max-w-xl relative z-10">
                  <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1E1B2E] mb-3">Welcome back, User!</h2>
                  <p className="text-[#1E1B2E]/60 text-sm mb-6 leading-relaxed">
                    You are on a stellar streak. Keep fueling your ambition and complete today's recommended milestone.
                  </p>
                  <div className={"flex items-center gap-2 md:gap-3 " + (isMobile ? "flex-wrap" : "")}>
                    <div className="bg-[#F5F1EB] text-[#1E1B2E] px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5 md:gap-2 border border-[#C9A96E]/30">
                      <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#C9A96E]" /> 2 Day Streak
                    </div>
                    <div className="bg-[#1E1B2E] text-white px-3 py-1.5 md:py-2 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-[#C9A96E]" /> CHECKED IN
                    </div>
                    <button className="bg-[#1E1B2E] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-2 hover:bg-[#2A2640] transition shadow-md whitespace-nowrap">
                      Explore Catalog →
                    </button>
                  </div>
                </div>

                {/* Mastery Circle */}
                <div className={"relative z-10 flex items-center justify-center bg-[#F5F1EB] rounded-full shadow-inner border border-white " + (isMobile ? "w-24 h-24 self-center" : "w-32 h-32 mr-4")}>
                  <div className="absolute inset-0 border-8 border-white rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-[#C9A96E] rounded-full" style={{ clipPath: "polygon(50% 0, 100% 0, 100% 50%, 50% 50%)" }}></div>
                  <div className="text-center">
                    <div className={(isMobile ? "text-lg" : "text-2xl") + " font-black text-[#1E1B2E]"}>20%</div>
                    <div className="text-[7px] md:text-[8px] font-bold text-[#8E8E93] uppercase tracking-widest mt-0.5">AVG MASTERY</div>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className={"grid gap-4 " + (isMobile ? "grid-cols-2" : "grid-cols-4")}>
                {[
                  { label: "Study Hours", val: "0h", sub: "+2.5h this week", icon: Clock },
                  { label: "Active Courses", val: "4", sub: "Currently enrolled", icon: BookOpen },
                  { label: "Completed", val: "1", sub: "Full certifications", icon: Bookmark },
                  { label: "Average Grade", val: "—", sub: "Across evaluations", icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-[rgba(30,27,46,0.04)] relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] md:text-xs font-bold text-[#8E8E93] uppercase tracking-wider w-2/3">{stat.label}</span>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#F5F1EB] flex items-center justify-center shrink-0">
                        <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1E1B2E]" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[#1E1B2E] mb-1.5">{stat.val}</div>
                    <div className="text-[9px] md:text-[10px] font-bold text-green-500">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className={"grid gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-3")}>
                {/* Learning Path Milestone */}
                <div className={(isMobile ? "col-span-1" : "col-span-2") + " bg-white rounded-3xl p-6 shadow-sm border border-[rgba(30,27,46,0.04)]"}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-heading font-bold text-[#1E1B2E]">Learning Path Milestone</h3>
                      <p className="text-[10px] md:text-xs text-[#8E8E93] font-medium">Your active curriculum progress</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-4 space-y-6">
                    {/* Vertical line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
                    
                    <div className="relative flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#1E1B2E] flex items-center justify-center z-10 border-4 border-white shrink-0">
                        <div className="w-2 h-2 bg-[#C9A96E] rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-[#FAFAFA] p-4 rounded-2xl border border-[rgba(30,27,46,0.04)]">
                        <h4 className="font-bold text-sm text-[#1E1B2E]">Data Structures & Algorithms</h4>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] font-bold text-[#C9A96E] uppercase">In Progress • 0%</p>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center gap-4 opacity-50">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center z-10 border-4 border-white shrink-0">
                      </div>
                      <div className="flex-1 bg-[#FAFAFA] p-4 rounded-2xl border border-[rgba(30,27,46,0.04)]">
                        <h4 className="font-bold text-sm text-[#1E1B2E]">Advanced Algorithms</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Locked</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Up Next Card */}
                <div className="bg-[#1E1B2E] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A96E]/10 rounded-full blur-3xl" />
                  <div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <span className="bg-white/10 text-[#C9A96E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C9A96E]/20">UP NEXT</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-3 relative z-10">Introduction to AI&ML</h3>
                    <p className="text-xs text-white/60 leading-relaxed relative z-10">Resume where you left off. Every step forward builds real-world mastery.</p>
                  </div>
                  <button className="w-full bg-[#C9A96E] text-[#1E1B2E] py-3.5 md:py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#b8985d] transition shadow-lg relative z-10 mt-6 md:mt-8">
                    <Play className="w-4 h-4 fill-current" /> Resume
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-heading font-bold">My Courses</h2>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                  {["ALL", "TECHNOLOGY", "PROGRAMMING", "COMPUTER SCIENCE"].map((t, i) => (
                    <button key={i} className={"px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap " + (i === 0 ? "bg-[#1E1B2E] text-white" : "bg-white text-[#8E8E93] border border-gray-200")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={"grid gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-3")}>
                {[
                  { title: "AI & Machine Learning", progress: 100, status: "CERTIFICATE", darkBtn: true },
                  { title: "Full Stack Web Development", progress: 0, status: "ENROLLED", darkBtn: false },
                  { title: "Data Structures & Algorithms", progress: 0, status: "ENROLLED", darkBtn: false },
                ].map((c, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[rgba(30,27,46,0.04)] flex flex-col">
                    <div className="h-32 bg-gray-100 relative p-4 flex justify-between items-start overflow-hidden">
                      <div className="absolute inset-0 bg-[#1E1B2E]/5" />
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#C9A96E]/20 rounded-full blur-xl" />
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#1E1B2E] uppercase tracking-wider shadow-sm z-10">COURSE</span>
                    </div>
                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-4 text-[#1E1B2E] leading-tight">{c.title}</h3>
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-[10px] font-bold text-[#8E8E93] uppercase">PROGRESS</p>
                          <p className="text-[10px] font-bold text-[#1E1B2E]">{c.progress}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A96E]" style={{ width: c.progress + "%" }} />
                        </div>
                      </div>
                      <button className={"mt-6 w-full py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition " + (c.darkBtn ? "bg-[#1E1B2E] text-white hover:bg-[#2A2640]" : "border-2 border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E]/5")}>
                        {c.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <h2 className="text-2xl font-heading font-bold mb-6">Leaderboard</h2>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[rgba(30,27,46,0.04)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">Rank</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">User</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">Score</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider hidden md:table-cell">Streak</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider hidden sm:table-cell">Mastery</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#C9A96E]/20 bg-[#C9A96E]/5">
                      <td className="p-4"><div className="w-8 h-8 rounded-full bg-[#C9A96E] text-white flex items-center justify-center font-bold text-sm">1</div></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white border border-[#C9A96E] flex items-center justify-center text-[#C9A96E] font-bold text-xs relative">
                            U
                            <div className="absolute -top-2 -right-2 text-base">👑</div>
                          </div>
                          <span className="font-bold text-[#1E1B2E]">User (You)</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#C9A96E]">610 pts</td>
                      <td className="p-4 hidden md:table-cell"><div className="flex items-center gap-1 text-xs font-bold text-orange-500"><Flame className="w-3 h-3" /> 2d</div></td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white rounded-full overflow-hidden border border-gray-100"><div className="h-full bg-[#C9A96E] w-[17%]"></div></div>
                          <span className="text-xs font-bold text-[#1E1B2E]">17%</span>
                        </div>
                      </td>
                    </tr>
                    {[
                      { r: 2, n: "Alex M.", s: "580", str: "1d", m: "15" },
                      { r: 3, n: "Sarah K.", s: "540", str: "5d", m: "12" },
                      { r: 4, n: "James W.", s: "490", str: "0d", m: "10" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="p-4 font-bold text-[#8E8E93] pl-6">{row.r}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#8E8E93] font-bold text-xs">{row.n.charAt(0)}</div>
                            <span className="font-medium text-[#1E1B2E]">{row.n}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#8E8E93]">{row.s} pts</td>
                        <td className="p-4 hidden md:table-cell"><div className="text-xs font-medium text-[#8E8E93]">{row.str}</div></td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gray-300" style={{width: row.m + '%'}}></div></div>
                            <span className="text-xs font-medium text-[#8E8E93]">{row.m}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "ai-tutor" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-6">
              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[rgba(30,27,46,0.04)] flex flex-col overflow-hidden">
                <div className="p-6 md:p-10 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mb-6 border border-[#C9A96E]/20">
                    <Sparkles className="w-8 h-8 text-[#C9A96E]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1E1B2E] mb-3">Welcome to Your AI Tutor</h2>
                  <p className="text-[#8E8E93] text-sm max-w-md mx-auto mb-10">I'm here to help you master your courses. Ask me anything about your curriculum!</p>
                  
                  <div className="w-full max-w-2xl text-left">
                    <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block mb-4 ml-2">Quick Prompts</span>
                    <div className="flex flex-wrap gap-3">
                      {["What is Python?", "Explain AI & Machine Learning", "Help with Data Structures"].map((p, i) => (
                        <button key={i} className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-medium text-[#1E1B2E] hover:bg-gray-50 transition shadow-sm bg-white">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-[#FAFAFA]">
                  <div className="max-w-3xl mx-auto relative">
                    <input 
                      type="text" 
                      placeholder="Ask your tutor a question..." 
                      className="w-full bg-white border border-gray-200 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-[#C9A96E] shadow-sm"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button className="absolute right-2 top-2 bottom-2 w-10 bg-[#1E1B2E] rounded-full flex items-center justify-center hover:bg-[#2A2640] transition">
                      <Send className="w-4 h-4 text-white -ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "institutions" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <h2 className="text-2xl font-heading font-bold mb-6">Institutions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(30,27,46,0.04)]">
                  <div className="w-12 h-12 bg-[#1E1B2E] rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E1B2E] mb-2">Global Tech Institute</h3>
                  <p className="text-sm text-[#8E8E93] mb-6">You are enrolled in this institution's private learning environment.</p>
                  <div className="inline-flex px-4 py-2 bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] rounded-full text-xs font-bold uppercase tracking-wider">
                    Active Student Member
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(30,27,46,0.04)]">
                  <h3 className="text-lg font-bold text-[#1E1B2E] mb-6">Private Classes</h3>
                  <div className="p-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold">23A</div>
                      <div>
                        <h4 className="font-bold text-sm">Class 23A</h4>
                        <p className="text-[10px] text-[#8E8E93]">Design Engg.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E1B2E] bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                      2 Enrolled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex pb-6">
              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[rgba(30,27,46,0.04)] flex overflow-hidden">
                {/* Contacts List */}
                <div className={"border-r border-gray-100 flex flex-col " + (isMobile ? "w-20" : "w-1/3 max-w-[300px]")}>
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder={isMobile ? "" : "Search"} className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {[
                      { n: "Prof. Smith", r: "Teacher", active: true },
                      { n: "Study Group", r: "Class 23A", active: false }
                    ].map((c, i) => (
                      <div key={i} className={"p-4 border-b border-gray-50 cursor-pointer flex items-center gap-3 " + (c.active ? "bg-[#C9A96E]/5" : "hover:bg-gray-50")}>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">{c.n.charAt(0)}</div>
                        {!isMobile && (
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-sm text-[#1E1B2E] truncate">{c.n}</h4>
                            <p className="text-[10px] text-[#8E8E93] truncate">{c.r}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chat Area */}
                <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA]">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "chat" || activeTab === "forum") && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <h2 className="text-2xl font-heading font-bold mb-6 capitalize">{activeTab}</h2>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[rgba(30,27,46,0.04)] text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-lg text-[#1E1B2E] mb-2">Community {activeTab}</h3>
                <p className="text-sm text-[#8E8E93]">Connect with peers and discuss course materials.</p>
                <button className="mt-6 px-6 py-2.5 bg-[#1E1B2E] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#2A2640] transition">
                  Start a Topic
                </button>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-3xl mx-auto">
              <h2 className="text-2xl font-heading font-bold mb-6">Give Feedback</h2>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(30,27,46,0.04)]">
                
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                  {["Bug Report", "Suggestion", "Other"].map((cat, i) => (
                    <button key={i} className={"py-3 md:py-4 px-2 rounded-xl text-xs md:text-sm font-bold border transition text-center " + (i === 1 ? "border-[#C9A96E] bg-[#C9A96E]/5 text-[#C9A96E]" : "border-gray-200 text-[#8E8E93] hover:border-gray-300")}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">MESSAGE</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#C9A96E] resize-none"
                    placeholder="Describe your experience..."
                  ></textarea>
                </div>

                <button className="w-full bg-[#1E1B2E] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#2A2640] transition shadow-md">
                  Submit Feedback
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
