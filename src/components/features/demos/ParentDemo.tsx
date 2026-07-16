"use client";

import React, { useState } from "react";
import { 
  Users, MessageSquare, HelpCircle, 
  Settings, Grid, Trophy, Building2,
  Home, BookOpen, Clock, AlertCircle,
  Menu, X, Bell, Search, LineChart, Link as LinkIcon
} from "lucide-react";

export function ParentDemo({ isMobile = false }: { isMobile?: boolean }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: Grid },
    { id: "community", label: "Community Hub", icon: Users, isExpandable: true },
    ...(isCommunityOpen ? [
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
        
        <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
            <span className="text-purple-300 font-bold">U</span>
          </div>
          <div>
            <div className="font-bold text-sm">User</div>
            <div className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">PARENT</div>
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
                ? "bg-[#C9A96E]/10 text-[#C9A96E] font-medium border border-[#C9A96E]/20" 
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
      {!isMobile && <Sidebar />}

      {isMobile && (
        <div className={"fixed inset-0 z-50 bg-black/50 transition-opacity " + (isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
          <div className={"h-full transition-transform duration-300 " + (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
            <Sidebar />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative hide-scrollbar flex flex-col h-full">
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
          {!isMobile && (
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold">Overview</h1>
              <div className="flex items-center gap-4">
                <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#C9A96E]/30">PARENT</span>
                <div className="w-8 h-8 rounded-full border border-[rgba(30,27,46,0.1)] flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition">
                  <Bell className="w-4 h-4 text-[#1E1B2E]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 overflow-hidden border border-purple-500/50 flex items-center justify-center text-purple-600 font-bold text-xs">
                  U
                </div>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(30,27,46,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#C9A96E]/20 flex items-center justify-center border border-[#C9A96E]/50">
                    <span className="text-xl font-bold text-[#C9A96E]">U</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-[#1E1B2E]">User</h2>
                    <p className="text-xs text-[#8E8E93]">Student Account</p>
                  </div>
                </div>
                
                <div className={"flex gap-3 " + (isMobile ? "flex-col" : "")}>
                  <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#1E1B2E] text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 border border-gray-200">
                    <LinkIcon className="w-3.5 h-3.5" /> Link Child
                  </button>
                  <button className="px-4 py-2 bg-[#F5F1EB] hover:bg-[#e8e2d7] text-[#1E1B2E] text-xs font-bold uppercase tracking-wider rounded-xl transition border border-[#C9A96E]/20">
                    Community Hub
                  </button>
                  <button className="px-4 py-2 bg-[#1E1B2E] hover:bg-[#2A2640] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm">
                    Report
                  </button>
                </div>
              </div>

              <div className={"grid gap-4 md:gap-6 " + (isMobile ? "grid-cols-2" : "grid-cols-4")}>
                {[
                  { label: "COURSES", val: "6", sub: "Enrolled", icon: BookOpen, dark: false },
                  { label: "AVERAGE GRADE", val: "N/A", sub: "Overall Performance", icon: Trophy, dark: false },
                  { label: "ATTENDANCE", val: "71%", sub: "Module Completion", icon: Users, dark: false },
                  { label: "POINTS", val: "610", sub: "Total Achievements", icon: Trophy, dark: true },
                ].map((stat, i) => (
                  <div key={i} className={"p-5 rounded-2xl shadow-sm border border-[rgba(30,27,46,0.04)] relative overflow-hidden group " + (stat.dark ? "bg-[#1E1B2E] text-white" : "bg-white")}>
                    <div className="flex justify-between items-start mb-6">
                      <span className={"text-[10px] font-bold uppercase tracking-wider w-2/3 " + (stat.dark ? "text-white/60" : "text-[#8E8E93]")}>{stat.label}</span>
                      <stat.icon className={"w-4 h-4 " + (stat.dark ? "text-[#C9A96E]" : "text-[#1E1B2E]")} />
                    </div>
                    <div className={"text-3xl font-heading mb-1 font-bold " + (stat.dark ? "text-[#C9A96E]" : "text-[#1E1B2E]")}>{stat.val}</div>
                    <div className={"text-[10px] font-bold " + (stat.dark ? "text-white/60" : "text-green-500")}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className={"grid gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-3")}>
                <div className={(isMobile ? "col-span-1" : "col-span-2") + " space-y-6"}>
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(30,27,46,0.04)]">
                    <h3 className="text-xl font-heading font-bold text-[#1E1B2E] mb-6">Performance Trend</h3>
                    <div className="h-48 bg-[#FAFAFA] rounded-2xl border border-gray-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                      <LineChart className="w-12 h-12 text-gray-300" />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(30,27,46,0.04)]">
                    <h3 className="text-xl font-heading font-bold text-[#1E1B2E] mb-6">Course Progress</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-[#1E1B2E]">AI & Machine Learning</span>
                          <span className="font-bold text-[#1E1B2E]">100%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A96E] w-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-[#1E1B2E]">Full Stack Web Development</span>
                          <span className="font-bold text-[#1E1B2E]">0%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-300 w-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(30,27,46,0.04)]">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                      <h3 className="text-sm font-bold text-[#1E1B2E]">Upcoming Deadlines</h3>
                    </div>
                    <div className="py-8 text-center text-sm font-medium text-[#8E8E93] bg-[#FAFAFA] rounded-2xl border border-gray-100">
                      No upcoming deadlines!
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(30,27,46,0.04)]">
                    <h3 className="text-sm font-bold text-[#1E1B2E] mb-6">Recent Activity</h3>
                    <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-[#C9A96E] border-2 border-white ring-2 ring-white" />
                          <p className="text-xs font-bold text-[#1E1B2E] mb-1">Completed a lesson</p>
                          <p className="text-[10px] text-[#8E8E93]">Today, 10:30 AM</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "forum" || activeTab === "messages") && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex pb-6">
              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[rgba(30,27,46,0.04)] flex overflow-hidden">
                <div className={"border-r border-gray-100 flex flex-col " + (isMobile ? "w-20" : "w-1/3 max-w-[300px]")}>
                  <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder={isMobile ? "" : "Search"} className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {[
                      { n: "Mr. Teacher", r: "Educator", active: true },
                      { n: "Parents Group", r: "Class 23A", active: false }
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
                <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA]">
                  <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-400 text-sm font-medium">Select a conversation</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-3xl mx-auto">
              <h2 className="text-2xl font-heading font-bold mb-6">Give Feedback</h2>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(30,27,46,0.04)]">
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                  {["Bug Report", "Suggestion", "Other"].map((cat, i) => (
                    <button key={i} className={"py-3 md:py-4 px-2 rounded-xl text-xs md:text-sm font-bold border transition text-center " + (i === 1 ? "border-[#C9A96E] bg-[#C9A96E]/5 text-[#C9A96E]" : "border-gray-200 text-[#8E8E93]")}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">MESSAGE</label>
                  <textarea rows={6} className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#C9A96E] resize-none" placeholder="Describe your experience..."></textarea>
                </div>
                <button className="w-full bg-[#1E1B2E] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#2A2640] transition">
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
