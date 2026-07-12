"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, BarChart, ShieldCheck, Clock, Award, Star, Settings, MessageSquare, Bell, Search, Trophy, Sparkles, LayoutDashboard, Calendar, Video, FileText, Activity } from "lucide-react";

export function RoleInteractiveDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const isScrolling = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries[0].isIntersecting);
      },
      { threshold: 0.8 } // Lock scroll when 80% of the element is visible
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isInView) return;

      // Scroll Down (e.deltaY > 0)
      if (e.deltaY > 0 && activeTab < 2) {
        e.preventDefault();
        if (!isScrolling.current) {
          isScrolling.current = true;
          setActiveTab(prev => prev + 1);
          setTimeout(() => { isScrolling.current = false }, 800);
        }
      } 
      // Scroll Up (e.deltaY < 0)
      else if (e.deltaY < 0 && activeTab > 0) {
        e.preventDefault();
        if (!isScrolling.current) {
          isScrolling.current = true;
          setActiveTab(prev => prev - 1);
          setTimeout(() => { isScrolling.current = false }, 800);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isInView, activeTab]);

  const tabs = [
    { id: "student", label: "For Students" },
    { id: "teacher", label: "For Teachers" },
    { id: "parent", label: "For Parents" }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="py-24 md:py-32 bg-[#1E1B2E] text-white overflow-hidden relative min-h-[90vh] flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center w-full">
        <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider mb-3">Designed for Everyone</span>
        <h2 className="font-heading text-4xl text-white mb-6 text-center">A tailored experience for every role</h2>
        
        {/* Tab Switcher */}
        <div className="flex bg-[rgba(255,255,255,0.05)] p-1 rounded-full mb-12 border border-[rgba(255,255,255,0.1)] relative z-20">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${activeTab === idx ? "text-[#1E1B2E]" : "text-white hover:text-white/80"}`}
            >
              {activeTab === idx && (
                <motion.div
                  layoutId="activeTabRoleDemo"
                  className="absolute inset-0 bg-[#C9A96E] rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Display Area */}
        <div className="w-full max-w-6xl aspect-[16/10] md:aspect-[16/9] relative z-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 overflow-hidden bg-[#0D0B14]">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="student"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <StudentDashboardDemo />
              </motion.div>
            )}
            {activeTab === 1 && (
              <motion.div
                key="teacher"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <TeacherDashboardDemo />
              </motion.div>
            )}
            {activeTab === 2 && (
              <motion.div
                key="parent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <ParentDashboardDemo />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function DashboardWrapper({ menu, userName, role }: { menu: any[], userName: string, role: string }) {
  const [activePageIndex, setActivePageIndex] = useState(0);

  return (
    <div className="w-full h-full bg-[#0D0B14] flex flex-col md:flex-row text-white overflow-hidden text-left font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-[#1E1B2E] border-r border-white/5 p-6 shrink-0">
        <div className="font-heading text-xl font-bold text-white mb-10 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#C9A96E]"></div>
          Skill Sphere
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {menu.map((item: any, i: number) => (
            <button 
              key={i} 
              onClick={() => setActivePageIndex(i)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activePageIndex === i ? 'bg-white/10 text-[#C9A96E]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/5">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Avatar" />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium truncate">{userName}</div>
            <div className="text-xs text-white/40 truncate">{role}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#F5F1EB] text-[#1E1B2E] overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-black/5 flex items-center justify-between px-8 bg-white shrink-0">
          <div className="font-medium">{menu[activePageIndex].label}</div>
          <div className="flex items-center gap-4 text-black/50">
            <Search size={18} className="cursor-pointer hover:text-black" />
            <Bell size={18} className="cursor-pointer hover:text-black" />
            <Settings size={18} className="cursor-pointer hover:text-black" />
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePageIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {menu[activePageIndex].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// =================== STUDENT PAGES ===================

function StudentOverview() {
  return (
    <div className="p-6 md:p-8 h-full">
      <div className="pb-6">
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-1">Welcome back, Alex!</h1>
        <p className="text-[14px] text-[#8E8E93]">Ready to level up your skills today?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] font-semibold">Total Points</span>
            <Trophy className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">1,240</div>
          <div className="text-[13px] text-[#8E8E93]">Keep earning!</div>
        </div>
        <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] font-semibold">Enrolled Courses</span>
            <BookOpen className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">4</div>
          <div className="text-[13px] text-[#8E8E93]">In progress</div>
        </div>
        <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] uppercase tracking-[0.08em] text-[#8E8E93] font-semibold">Avg. Score</span>
            <Star className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] mb-1 leading-tight">92%</div>
          <div className="text-[13px] text-[#8E8E93]">Across all subjects</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[24px] text-[#1E1B2E]">My Courses</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
              <div className="relative w-full h-[140px] rounded-[12px] overflow-hidden mb-4 bg-[#1E1B2E] flex items-center justify-center">
                <BookOpen className="text-white/20 w-12 h-12" />
              </div>
              <h3 className="font-heading text-[18px] text-[#1E1B2E] leading-snug mb-1">Advanced Web Dev</h3>
              <p className="text-[13px] text-[#8E8E93] mb-5">Sarah Jenkins</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-[12px] font-medium text-[#1E1B2E] mb-2">
                  <span>Progress</span><span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-[#C9A96E] rounded-full w-[65%]" />
                </div>
                <button className="w-full h-[40px] bg-[#1E1B2E] text-white rounded-lg font-medium text-[14px]">Continue Learning</button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 pt-12 lg:pt-0 lg:mt-11">
           <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#C9A96E]/20">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                 <Sparkles className="w-5 h-5 text-[#C9A96E]" />
               </div>
               <h3 className="font-heading text-[18px]">AI Tutor</h3>
             </div>
             <p className="text-sm text-[#8E8E93] mb-4 leading-relaxed">Stuck on a concept? Your AI tutor is ready to help 24/7.</p>
             <button className="w-full py-2.5 bg-[#1E1B2E] text-white rounded-lg text-sm font-medium">Ask a Question</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StudentCourses() {
  return (
    <div className="p-6 md:p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-[28px] text-[#1E1B2E]">My Courses</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-black/10 rounded-lg text-sm font-medium shadow-sm">In Progress (4)</button>
          <button className="px-4 py-2 text-[#8E8E93] text-sm font-medium">Completed (12)</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-transparent hover:border-[#C9A96E]/30 transition-colors cursor-pointer flex flex-col group">
             <div className="h-32 bg-[#1E1B2E] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               <div className="absolute bottom-3 left-4 text-white text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded-md">Chapter {i + 2}</div>
             </div>
             <div className="p-5 flex-1 flex flex-col">
               <h3 className="font-heading text-lg mb-1 group-hover:text-[#C9A96E] transition-colors">Computer Science {101 + i}</h3>
               <p className="text-xs text-[#8E8E93] mb-4">Dr. Alan Turing</p>
               <div className="mt-auto">
                 <div className="w-full h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden mb-3">
                   <div className="h-full bg-[#C9A96E] rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }} />
                 </div>
                 <button className="w-full text-center text-sm font-bold text-[#1E1B2E] hover:text-[#C9A96E]">Resume Course</button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentLeaderboard() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto h-full">
      <div className="text-center mb-10">
        <h1 className="font-heading text-[32px] text-[#1E1B2E] mb-2">Global Leaderboard</h1>
        <p className="text-sm text-[#8E8E93]">Compete with students worldwide and climb the ranks.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex bg-[#F5F1EB] p-4 font-bold text-xs uppercase tracking-wider text-[#8E8E93]">
          <div className="w-16 text-center">Rank</div>
          <div className="flex-1">Student</div>
          <div className="w-24 text-right">Points</div>
          <div className="w-24 text-right pr-4">Streak</div>
        </div>
        {[
          { name: "Emma Watson", points: "15,240", streak: "142", rank: 1 },
          { name: "James Smith", points: "14,890", streak: "89", rank: 2 },
          { name: "Alex Chen (You)", points: "14,500", streak: "5", rank: 3, isYou: true },
          { name: "Sophia Davis", points: "13,900", streak: "45", rank: 4 },
          { name: "Michael Johnson", points: "13,200", streak: "12", rank: 5 },
        ].map((student, i) => (
          <div key={i} className={`flex items-center p-4 border-b border-black/5 last:border-0 hover:bg-[#F5F1EB]/50 transition-colors ${student.isYou ? 'bg-[#C9A96E]/5' : ''}`}>
            <div className="w-16 text-center font-bold text-[#1E1B2E]">
              {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center text-xs font-bold">{student.name.charAt(0)}</div>
              <span className={`font-medium ${student.isYou ? 'text-[#C9A96E] font-bold' : 'text-[#1E1B2E]'}`}>{student.name}</span>
            </div>
            <div className="w-24 text-right font-bold text-[#1E1B2E]">{student.points}</div>
            <div className="w-24 text-right pr-4 text-sm font-medium text-orange-500 flex items-center justify-end gap-1">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.5 12.5c0 2.5-2.5 5.5-5.5 5.5s-5.5-3-5.5-5.5 2.5-5.5 5.5-5.5 5.5 3 5.5 5.5zm-5.5-8c-3.5 0-6.5 3.5-6.5 7s3 7 6.5 7 6.5-3 6.5-7-3-7-6.5-7zm0 11c-2 0-3.5-1.5-3.5-3.5s1.5-3.5 3.5-3.5 3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5z"/></svg>
              {student.streak}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentDashboardDemo() {
  const menu = [
    { label: "Overview", icon: LayoutDashboard, content: <StudentOverview /> },
    { label: "My Courses", icon: BookOpen, content: <StudentCourses /> },
    { label: "Leaderboard", icon: Award, content: <StudentLeaderboard /> },
  ];
  return <DashboardWrapper menu={menu} userName="Alex Chen" role="Student" />;
}

// =================== TEACHER PAGES ===================

function TeacherOverview() {
  return (
    <div className="p-6 md:p-8 h-full">
       <div className="pb-6">
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-1">Welcome back, Sarah!</h1>
        <p className="text-[14px] text-[#8E8E93]">Manage your classes and review student progress.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: "142", icon: Users },
          { label: "Avg Grade", value: "A-", icon: Star },
          { label: "To Grade", value: "28", icon: FileText },
          { label: "Messages", value: "5", icon: MessageSquare },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <stat.icon className="absolute right-4 bottom-4 w-12 h-12 text-black/5 transform rotate-12" />
            <div className="text-[11px] text-[#8E8E93] mb-1 font-bold tracking-wider uppercase relative z-10">{stat.label}</div>
            <div className="text-3xl font-heading text-[#1E1B2E] relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-heading text-xl">Needs Grading</h4>
            <span className="text-xs font-bold text-[#C9A96E] cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-4">
            {[
              { name: "Alex Chen", task: "Midterm Essay", time: "10m ago", subject: "History" },
              { name: "Maria Garcia", task: "Physics Lab Report", time: "1h ago", subject: "Science" },
              { name: "James Wilson", task: "Chapter 4 Test", time: "3h ago", subject: "Math" },
            ].map((sub, i) => (
              <div key={i} className="flex items-center justify-between border border-black/5 rounded-lg p-3 hover:border-black/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E1B2E] flex items-center justify-center font-bold text-sm text-white">{sub.name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-bold text-[#1E1B2E] leading-none mb-1">{sub.name}</div>
                    <div className="text-xs text-[#8E8E93]">{sub.task}</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[#C9A96E]/10 text-[#C9A96E] rounded-md text-xs font-bold hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-colors">
                  Grade
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#1E1B2E] text-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-[50px]"></div>
          <h4 className="font-heading text-xl mb-2 relative z-10">Upcoming Live Class</h4>
          <p className="text-sm text-white/60 mb-6 relative z-10">You have a live session starting soon.</p>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md mb-6 relative z-10 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Video className="w-5 h-5 text-[#C9A96E]" />
              <span className="font-bold">Advanced Mathematics 101</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="w-4 h-4" /> 10:00 AM - 11:30 AM
            </div>
          </div>
          <button className="w-full py-3 bg-[#C9A96E] text-[#1E1B2E] rounded-lg font-bold shadow-lg hover:scale-[1.02] transition-transform relative z-10">
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherClasses() {
  return (
    <div className="p-6 md:p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-[28px] text-[#1E1B2E]">My Classes</h1>
        <button className="px-4 py-2 bg-[#1E1B2E] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-black transition-colors">
          + Create Class
        </button>
      </div>
      <div className="space-y-4">
        {[
          { name: "Advanced Mathematics", grade: "Grade 10", students: 32, performance: "88%" },
          { name: "Physics Fundamentals", grade: "Grade 11", students: 28, performance: "82%" },
          { name: "Computer Science 101", grade: "Grade 12", students: 24, performance: "95%" },
        ].map((cls, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#F5F1EB] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#1E1B2E]" />
              </div>
              <div>
                <h3 className="font-heading text-lg leading-none mb-1">{cls.name}</h3>
                <p className="text-xs text-[#8E8E93]">{cls.grade}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
               <div className="text-center">
                 <div className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">Students</div>
                 <div className="text-sm font-bold text-[#1E1B2E] bg-[#F5F1EB] px-3 py-1 rounded-full">{cls.students}</div>
               </div>
               <div className="text-center">
                 <div className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">Avg Perf.</div>
                 <div className="text-sm font-bold text-[#22C55E] bg-green-50 px-3 py-1 rounded-full">{cls.performance}</div>
               </div>
               <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5">
                 <span className="text-lg">→</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherDashboardDemo() {
  const menu = [
    { label: "Overview", icon: LayoutDashboard, content: <TeacherOverview /> },
    { label: "My Classes", icon: Users, content: <TeacherClasses /> },
  ];
  return <DashboardWrapper menu={menu} userName="Sarah Jenkins" role="Teacher" />;
}

// =================== PARENT PAGES ===================

function ParentOverview() {
  return (
    <div className="p-6 md:p-8 h-full">
      <div className="pb-6">
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-1">Alex's Academic Report</h1>
        <p className="text-[14px] text-[#8E8E93]">Track your child's progress and stay involved.</p>
      </div>

       <div className="bg-[#C9A96E] text-[#1E1B2E] rounded-[16px] p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden relative gap-4">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-[40px]"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-heading font-bold mb-1">Weekly Summary</h3>
          <p className="text-sm font-medium opacity-90">Alex is performing in the top 15% of the class this week, with perfect attendance!</p>
        </div>
        <button className="relative z-10 px-5 py-2.5 bg-[#1E1B2E] text-white rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-transform">
          Detailed Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-heading text-lg">Upcoming Deadlines</h4>
            <Calendar className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="space-y-4">
            {[
              { subject: "Mathematics", task: "Chapter 4 Test", due: "Tomorrow", color: "bg-orange-100 text-orange-700" },
              { subject: "Science", task: "Lab Report Due", due: "In 2 days", color: "bg-blue-100 text-blue-700" },
              { subject: "History", task: "Essay Draft", due: "Next Week", color: "bg-green-100 text-green-700" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#F5F1EB]/50 rounded-lg border border-black/5 hover:border-black/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-black/5 shadow-sm">
                    <BookOpen className="w-4 h-4 text-[#1E1B2E]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1E1B2E]">{item.subject}</div>
                    <div className="text-xs text-[#8E8E93]">{item.task}</div>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap uppercase tracking-wide ${item.color}`}>{item.due}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-heading text-lg">Teacher Feedback</h4>
            <MessageSquare className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div className="space-y-4">
            <div className="border border-black/5 rounded-xl p-4 bg-[#F5F1EB]/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center text-[10px]">SJ</div>
                  <span className="text-sm font-bold">Sarah Jenkins</span>
                </div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Math</span>
              </div>
              <p className="text-sm text-[#1E1B2E]/80 italic">"Alex showed great improvement in algebra this week. Keep encouraging the daily practice sessions!"</p>
            </div>
            
             <div className="border border-black/5 rounded-xl p-4 bg-[#F5F1EB]/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#C9A96E] text-[#1E1B2E] flex items-center justify-center text-[10px] font-bold">MR</div>
                  <span className="text-sm font-bold">Michael Ross</span>
                </div>
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Science</span>
              </div>
              <p className="text-sm text-[#1E1B2E]/80 italic">"Excellent participation in today's lab experiment."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentAttendance() {
  return (
    <div className="p-6 md:p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-[28px] text-[#1E1B2E]">Attendance Record</h1>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-black/5 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-heading mb-2">100% Attendance</h3>
        <p className="text-[#8E8E93] max-w-md mx-auto">Alex has not missed a single day of classes this month. Consistent attendance is key to academic success!</p>
      </div>
    </div>
  );
}

function ParentDashboardDemo() {
  const menu = [
    { label: "Child Progress", icon: Star, content: <ParentOverview /> },
    { label: "Attendance", icon: Clock, content: <ParentAttendance /> },
  ];
  return <DashboardWrapper menu={menu} userName="David Wilson" role="Parent" />;
}
