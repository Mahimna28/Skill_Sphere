"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { BookOpen, Users, BarChart, ShieldCheck, Clock, Award, Star, Settings, MessageSquare, Bell, Search, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";

export function RoleStickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Using 400vh gives enough scroll distance so the page "freezes" long enough 
  // to comfortably view Student -> Teacher -> Parent without scrolling past too fast.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) {
        setActiveIndex(0);
      } else if (latest >= 0.33 && latest < 0.66) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
  }, [scrollYProgress]);

  const tabs = [
    { id: "student", label: "For Students" },
    { id: "teacher", label: "For Teachers" },
    { id: "parent", label: "For Parents" }
  ];

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#1E1B2E]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-24 pb-12 px-4 md:px-8">
        
        {/* Header and Tabs */}
        <div className="flex flex-col items-center mb-6 relative z-20">
          <span className="text-[#C9A96E] text-sm font-medium uppercase tracking-wider mb-2">Designed for Everyone</span>
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 text-center">A tailored experience for every role</h2>
          
          <div className="flex bg-[rgba(255,255,255,0.05)] p-1 rounded-full border border-[rgba(255,255,255,0.1)] relative">
            {tabs.map((tab, idx) => (
              <div
                key={tab.id}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeIndex === idx ? "text-[#1E1B2E]" : "text-white/70"}`}
              >
                {activeIndex === idx && (
                  <motion.div
                    layoutId="roleActiveTab"
                    className="absolute inset-0 bg-[#C9A96E] rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Display Area */}
        <div className="w-full max-w-6xl aspect-[16/10] md:aspect-video relative z-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeIndex === 0 && (
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
            {activeIndex === 1 && (
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
            {activeIndex === 2 && (
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
    </div>
  );
}

function DashboardWrapper({ menu, userName, role }: { menu: any[], userName: string, role: string }) {
  const [activePageIndex, setActivePageIndex] = useState(0);

  return (
    <div className="w-full h-full bg-[#0D0B14] flex flex-col md:flex-row text-white overflow-hidden text-left">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activePageIndex === i ? 'bg-[#C9A96E] text-[#1E1B2E]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
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

// =================== STUDENT DEMO (Mirrors actual dashboard) ===================

function StudentOverview() {
  return (
    <div className="p-6 md:p-8 font-sans">
      <div className="pb-6">
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-1">
          Welcome back, Alex!
        </h1>
        <p className="text-[14px] text-[#8E8E93]">
          Ready to level up your skills today?
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[24px] text-[#1E1B2E]">My Courses</h2>
            <span className="text-[14px] text-[#C9A96E] font-medium cursor-pointer">Browse Courses →</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
              <div className="relative w-full h-[140px] rounded-[12px] overflow-hidden mb-4 bg-[#1E1B2E]"></div>
              <h3 className="font-heading text-[18px] text-[#1E1B2E] leading-snug mb-1">Advanced Web Dev</h3>
              <p className="text-[13px] text-[#8E8E93] mb-5">Sarah Jenkins</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-[12px] font-medium text-[#1E1B2E] mb-2">
                  <span>Progress</span><span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-[#C9A96E] rounded-full w-[65%]" />
                </div>
                <button className="w-full h-[40px] bg-[#C9A96E] text-[#1E1B2E] rounded-lg font-medium text-[14px]">Continue Learning</button>
              </div>
            </div>
            
             <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
              <div className="relative w-full h-[140px] rounded-[12px] overflow-hidden mb-4 bg-[#C9A96E]"></div>
              <h3 className="font-heading text-[18px] text-[#1E1B2E] leading-snug mb-1">UI/UX Fundamentals</h3>
              <p className="text-[13px] text-[#8E8E93] mb-5">Design Institute</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-[12px] font-medium text-[#1E1B2E] mb-2">
                  <span>Progress</span><span>20%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F1EB] rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-[#C9A96E] rounded-full w-[20%]" />
                </div>
                <button className="w-full h-[40px] bg-[#C9A96E] text-[#1E1B2E] rounded-lg font-medium text-[14px]">Continue Learning</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 pt-12 lg:pt-0 lg:mt-11">
           <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
             <div className="flex items-center gap-3 mb-4">
               <Sparkles className="w-6 h-6 text-[#C9A96E]" />
               <h3 className="font-heading text-[18px]">AI Tutor</h3>
             </div>
             <p className="text-sm text-[#8E8E93] mb-4">Get instant help with your studies.</p>
             <button className="w-full py-2 bg-black/5 rounded-lg text-sm font-medium">Ask a Question</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StudentCourses() {
  return <div className="p-8 text-center text-[#8E8E93]">My Courses detail page.</div>;
}

function StudentDashboardDemo() {
  const menu = [
    { label: "Overview", icon: BarChart, content: <StudentOverview /> },
    { label: "My Courses", icon: BookOpen, content: <StudentCourses /> },
    { label: "Leaderboard", icon: Award, content: <div className="p-8 text-center text-[#8E8E93]">Leaderboard loading...</div> },
    { label: "Community", icon: Users, content: <div className="p-8 text-center text-[#8E8E93]">Community Hub</div> },
  ];
  return <DashboardWrapper menu={menu} userName="Alex Chen" role="Student" />;
}

// =================== TEACHER DEMO (Mirrors actual dashboard) ===================

function TeacherOverview() {
  return (
    <div className="p-6 md:p-8 font-sans">
       <div className="pb-6">
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-1">
          Welcome back, Sarah!
        </h1>
        <p className="text-[14px] text-[#8E8E93]">
          Manage your classes and students.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: "142" },
          { label: "Avg Grade", value: "A-" },
          { label: "Pending Grades", value: "28" },
          { label: "Messages", value: "5" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="text-sm text-[#8E8E93] mb-1 font-semibold tracking-wider uppercase text-[10px]">{stat.label}</div>
            <div className="text-3xl font-heading text-[#1E1B2E]">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <h4 className="font-heading text-lg mb-4">Recent Submissions</h4>
          <div className="space-y-4">
            {[
              { name: "Alex Chen", task: "Math Assignment 4", time: "2m ago", status: "Needs Grading" },
              { name: "Maria Garcia", task: "Physics Lab Report", time: "1h ago", status: "Needs Grading" },
            ].map((sub, i) => (
              <div key={i} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center font-bold text-sm text-[#1E1B2E]">{sub.name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-medium text-[#1E1B2E]">{sub.name}</div>
                    <div className="text-xs text-[#8E8E93]">{sub.task}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase mb-1 bg-orange-100 text-orange-700`}>
                    {sub.status}
                  </div>
                  <div className="text-[11px] text-[#8E8E93]">{sub.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboardDemo() {
  const menu = [
    { label: "Overview", icon: BarChart, content: <TeacherOverview /> },
    { label: "My Classes", icon: Users, content: <div className="p-8 text-center text-[#8E8E93]">My Classes view</div> },
    { label: "Assignments", icon: BookOpen, content: <div className="p-8 text-center text-[#8E8E93]">Assignments manager</div> },
  ];
  return <DashboardWrapper menu={menu} userName="Sarah Jenkins" role="Teacher" />;
}

// =================== PARENT DEMO ===================

function ParentOverview() {
  return (
    <div className="p-6 md:p-8 font-sans">
      <div className="pb-6">
        <h1 className="font-heading text-[28px] text-[#1E1B2E] mb-1">
          Alex's Academic Report
        </h1>
        <p className="text-[14px] text-[#8E8E93]">
          Track your child's progress.
        </p>
      </div>

       <div className="bg-[#1E1B2E] text-white rounded-[16px] p-8 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden relative gap-4">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C9A96E]/20 rounded-full blur-[40px]"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-heading font-bold mb-1">Weekly Summary</h3>
          <p className="text-sm text-white/70">Alex is performing in the top 15% of the class this week.</p>
        </div>
        <button className="relative z-10 px-5 py-2.5 bg-[#C9A96E] text-[#1E1B2E] rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-transform">
          Detailed Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <h4 className="font-heading text-lg mb-4">Upcoming Deadlines</h4>
          <div className="space-y-4">
            {[
              { subject: "Mathematics", task: "Chapter 4 Test", due: "Tomorrow" },
              { subject: "Science", task: "Lab Report Due", due: "In 2 days" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-[#F5F1EB] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full bg-[#C9A96E]"></div>
                  <div>
                    <div className="text-sm font-bold text-[#1E1B2E]">{item.subject}</div>
                    <div className="text-xs text-[#8E8E93]">{item.task}</div>
                  </div>
                </div>
                <div className="text-[11px] font-bold px-2 py-1 bg-black/5 rounded-md text-[#1E1B2E] whitespace-nowrap ml-2 uppercase tracking-wide">{item.due}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentDashboardDemo() {
  const menu = [
    { label: "Child Progress", icon: Star, content: <ParentOverview /> },
    { label: "Attendance", icon: Clock, content: <div className="p-8 text-center text-[#8E8E93]">Attendance record</div> },
    { label: "Security", icon: ShieldCheck, content: <div className="p-8 text-center text-[#8E8E93]">Security settings</div> },
  ];
  return <DashboardWrapper menu={menu} userName="David Wilson" role="Parent" />;
}
