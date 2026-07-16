"use client";

import React, { useState } from "react";
import { 
  BookOpen, Users, MessageSquare, HelpCircle, 
  Settings, Building2, UploadCloud, Grid,
  Home, Plus, Lock, Globe, Play, Menu, X, Bell,
  Search, Video, FileText, BarChart
} from "lucide-react";

export function TeacherDemo({ isMobile = false }: { isMobile?: boolean }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [courseTab, setCourseTab] = useState("COURSES (14)");

  const navItems = [
    { id: "overview", label: "Overview", icon: Grid },
    { id: "courses", label: "Manage Courses", icon: BookOpen },
    { id: "students", label: "My Students", icon: Users },
    { id: "institutions", label: "Institutions", icon: Building2 },
    { id: "institute", label: "My Institute", icon: Building2 },
    { id: "blog", label: "Upload Blog", icon: UploadCloud },
    { id: "community", label: "Community Hub", icon: Users, isExpandable: true },
    ...(isCommunityOpen ? [
      { id: "chat", label: "Chat", icon: MessageSquare, isSub: true },
      { id: "forum", label: "Forum", icon: HelpCircle, isSub: true },
    ] : []),
    { id: "messages", label: "Messages", icon: MessageSquare },
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
          <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 flex items-center justify-center border border-[#C9A96E]/50">
            <span className="text-[#C9A96E] font-bold">U</span>
          </div>
          <div>
            <div className="font-bold text-sm">User</div>
            <div className="text-[10px] text-[#C9A96E] uppercase tracking-wider font-bold">TEACHER</div>
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
                <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#C9A96E]/30">INSTITUTE ADMIN</span>
                <div className="w-8 h-8 rounded-full border border-[rgba(30,27,46,0.1)] flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition">
                  <Bell className="w-4 h-4 text-[#1E1B2E]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C9A96E]/20 overflow-hidden border border-[#C9A96E]/50 flex items-center justify-center text-[#C9A96E] font-bold text-xs">
                  U
                </div>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <div className={"flex justify-between items-start gap-4 " + (isMobile ? "flex-col" : "")}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading text-[#1E1B2E] mb-2 font-normal">Welcome, User!</h2>
                  <p className="text-[#1E1B2E]/60 text-sm">Manage your courses and track student progress.</p>
                </div>
                <button className={"bg-[#C9A96E] hover:bg-[#b8985d] text-[#1E1B2E] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition " + (isMobile ? "w-full mt-4" : "")}>
                  <Plus className="w-4 h-4" /> Create New Course
                </button>
              </div>

              <div className={"grid gap-4 md:gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-2")}>
                <div className="bg-white p-6 rounded-3xl border border-[rgba(30,27,46,0.04)] shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">ACTIVE COURSES</span>
                    <BookOpen className="w-5 h-5 text-[#8E8E93]" />
                  </div>
                  <div className="text-4xl md:text-5xl font-heading text-[#1E1B2E] mb-2 font-normal">15</div>
                  <div className="text-xs text-[#8E8E93]">Published</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-[rgba(30,27,46,0.04)] shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">TOTAL STUDENTS</span>
                    <Users className="w-5 h-5 text-[#8E8E93]" />
                  </div>
                  <div className="text-4xl md:text-5xl font-heading text-[#1E1B2E] mb-2 font-normal">11</div>
                  <div className="text-xs text-[#8E8E93]">Across all courses</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-heading text-[#1E1B2E] mb-6 font-normal">Your Courses</h3>
                <div className={"grid gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-3")}>
                  {[
                    { title: "Introduction to AI&ML", students: 1, type: "PUBLIC", desc: "you'll learn all the basics and the fundamentals about AI&ML", img: true },
                    { title: "23A", students: 2, type: "PRIVATE", desc: "design engg.", img: false },
                    { title: "Advance Python", students: 0, type: "PUBLIC", desc: "learn advance python", img: true },
                  ].map((course, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-[rgba(30,27,46,0.04)] overflow-hidden shadow-sm flex flex-col">
                      <div className={"h-32 relative flex items-center justify-center " + (course.img ? "bg-[#1E1B2E]" : "bg-gray-50")}>
                        {course.img ? (
                          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80')] bg-cover bg-center" />
                        ) : (
                          <BookOpen className="w-8 h-8 text-gray-300" />
                        )}
                        <div className="absolute top-4 right-4 z-10">
                          <span className={"text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-sm " + (course.type === 'PUBLIC' ? 'bg-[#C9A96E] text-[#1E1B2E]' : 'bg-[#1E1B2E]/80 text-white backdrop-blur-md border border-white/20')}>
                            {course.type === 'PUBLIC' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />} {course.type}
                          </span>
                        </div>
                        {course.img && (
                          <h4 className="relative z-10 text-white font-bold text-xl text-center px-4">
                            {course.title.includes("Python") ? "Python" : "AI&ML"}
                          </h4>
                        )}
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading text-lg text-[#1E1B2E] mb-2">{course.title}</h3>
                          <p className="text-[10px] text-[#8E8E93] font-medium flex items-center gap-1.5 mb-3">
                            <Users className="w-3.5 h-3.5" /> {course.students} enrolled
                          </p>
                          <p className="text-xs text-[#8E8E93] line-clamp-2">{course.desc}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-6">
                          <button className="py-2.5 bg-[#C9A96E] hover:bg-[#b8985d] text-[#1E1B2E] font-bold text-[10px] uppercase tracking-wider rounded-xl transition shadow-sm">
                            MANAGE
                          </button>
                          <button className="py-2.5 bg-[#F5F1EB] hover:bg-[#e8e2d7] text-[#8E8E93] hover:text-[#1E1B2E] font-bold text-[10px] uppercase tracking-wider rounded-xl transition border border-[rgba(30,27,46,0.05)]">
                            STUDENTS
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-heading font-bold">Manage Courses</h2>
              </div>
              <div className="flex gap-6 border-b border-gray-200 mb-6 px-2 overflow-x-auto hide-scrollbar">
                {["COURSES (14)", "MY CLASSES (1)"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setCourseTab(tab)}
                    className={"pb-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors " + (courseTab === tab ? "border-b-2 border-[#C9A96E] text-[#1E1B2E]" : "border-b-2 border-transparent text-[#8E8E93] hover:text-[#1E1B2E]")}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className={"grid gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-3")}>
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-[rgba(30,27,46,0.04)] overflow-hidden shadow-sm flex flex-col p-4">
                    <div className="h-40 bg-gray-100 rounded-2xl relative mb-4">
                       <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80')] bg-cover bg-center rounded-2xl" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[#1E1B2E] mb-2">Advanced Curriculum {i+1}</h3>
                        <p className="text-[10px] text-[#8E8E93] font-medium flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> 24 active students
                        </p>
                      </div>
                      <button className="mt-4 w-full py-2.5 bg-[#1E1B2E] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition shadow-sm hover:bg-[#2A2640]">
                        MANAGE STUDIO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <h2 className="text-2xl font-heading font-bold mb-6">My Students</h2>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[rgba(30,27,46,0.04)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">Student Name</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider hidden sm:table-cell">Courses</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">Status</th>
                      <th className="p-4 text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { n: "Emily R.", c: "3", s: "Active" },
                      { n: "Marcus T.", c: "1", s: "Inactive" },
                      { n: "Sophia W.", c: "2", s: "Active" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1E1B2E] font-bold text-xs">{row.n.charAt(0)}</div>
                            <span className="font-bold text-[#1E1B2E]">{row.n}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell font-bold text-[#8E8E93]">{row.c}</td>
                        <td className="p-4">
                          <span className={"text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full " + (row.s === "Active" ? "bg-[#C9A96E]/10 text-[#C9A96E]" : "bg-gray-100 text-gray-500")}>
                            {row.s}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-[#1E1B2E] transition">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <p className="text-sm text-[#8E8E93] mb-6">You are a registered educator in this institution.</p>
                  <div className="inline-flex px-4 py-2 bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] rounded-full text-xs font-bold uppercase tracking-wider">
                    Faculty Affiliation
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "institute" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <h2 className="text-2xl font-heading font-bold mb-6">My Institute</h2>
              <div className={"grid gap-4 md:gap-6 " + (isMobile ? "grid-cols-1" : "grid-cols-4")}>
                {["Departments", "New Join Requests", "Direct Enlistment", "Roster"].map((lbl, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-[rgba(30,27,46,0.04)] shadow-sm text-center hover:shadow-md transition cursor-pointer">
                    <Building2 className="w-8 h-8 mx-auto text-[#C9A96E] mb-4" />
                    <h3 className="font-bold text-sm text-[#1E1B2E]">{lbl}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <h2 className="text-2xl font-heading font-bold mb-6">Upload Blog</h2>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[rgba(30,27,46,0.04)] max-w-3xl">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 transition cursor-pointer mb-6">
                  <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="font-bold text-[#1E1B2E] mb-1">Click to upload your article</p>
                  <p className="text-xs text-[#8E8E93]">Markdown or rich text format</p>
                </div>
                <button className="w-full py-4 bg-[#1E1B2E] text-white font-bold text-sm rounded-xl shadow-md">
                  Publish to Community
                </button>
              </div>
            </div>
          )}

          {/* ... Messages, Forum, Feedback use similar fully populated patterns ... */}
          {(activeTab === "chat" || activeTab === "forum" || activeTab === "messages") && (
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
                    {[1,2,3].map((_, i) => (
                      <div key={i} className={"p-4 border-b border-gray-50 flex items-center gap-3 " + (i === 0 ? "bg-[#C9A96E]/5" : "")}>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">S</div>
                        {!isMobile && (
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-sm text-[#1E1B2E] truncate">Student {i+1}</h4>
                            <p className="text-[10px] text-[#8E8E93] truncate">Hey, I have a question...</p>
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
                    <button key={i} className={"py-3 md:py-4 px-2 rounded-xl text-xs md:text-sm font-bold border transition text-center " + (i === 0 ? "border-[#C9A96E] bg-[#C9A96E]/5 text-[#C9A96E]" : "border-gray-200 text-[#8E8E93]")}>
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
