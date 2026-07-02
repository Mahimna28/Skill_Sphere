"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Trophy, BookOpen, Users, Mail, AlertCircle, ClipboardList } from "lucide-react";

export default function ParentOverviewClient({ 
  child, 
  avgScore, 
  coursesWithProgress, 
  overallAttendance 
}: { 
  child: any, 
  avgScore: number | null, 
  coursesWithProgress: any[], 
  overallAttendance: number 
}) {
  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-heading text-[#1E1B2E]">No Child Linked</h2>
        <p className="max-w-md font-sans text-[14px] text-[#8E8E93]">
          It seems your account isn't linked to a student. Please contact support or register again with your child's Gmail.
        </p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <div
      className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0"
    >
      {/* HEADER SUBTITLE */}
      <div className="pt-[8px] px-[32px] mb-[20px]">
        <p className="font-sans text-[14px] text-[#8E8E93]">
          Monitoring: <span className="text-[#1E1B2E] font-medium">{child.name}</span>
        </p>
      </div>

      {/* CHILD INFO CARD */}
      <div
        className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] mx-[32px] mb-[24px] p-[28px] flex flex-row items-center gap-[20px]"
      >
        <div className="w-[56px] h-[56px] rounded-full bg-[#1E1B2E] flex items-center justify-center shrink-0">
          <span className="font-heading text-[22px] text-white">
            {child.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-[24px] text-[#1E1B2E] leading-tight truncate capitalize">
            {child.name}
          </h2>
          <div className="flex items-center gap-[6px] mt-[4px]">
            <GraduationCap size={14} className="text-[#8E8E93]" />
            <p className="font-sans text-[13px] text-[#8E8E93] truncate">
              Active Student • Skill Sphere Academy
            </p>
          </div>
        </div>
        
        {child.email && (
          <div className="hidden md:flex items-center gap-[6px] bg-[rgba(30,27,46,0.06)] px-[14px] py-[6px] rounded-full shrink-0">
            <Mail size={14} className="text-[#1E1B2E]" />
            <span className="font-sans text-[12px] text-[#1E1B2E]">{child.email}</span>
          </div>
        )}
      </div>

      {/* STATS CARDS ROW */}
      <div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-[24px] px-[32px] mb-[24px]"
      >
        <div variants={itemVariants} className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-[16px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Courses</span>
            <BookOpen size={20} className="text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] leading-none mb-[8px]">{child.enrollments.length}</div>
          <div className="font-sans text-[13px] text-[#8E8E93]">Learning Progress</div>
        </div>
        
        <div variants={itemVariants} className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-[16px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Points</span>
            <Trophy size={20} className="text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] leading-none mb-[8px]">{child.points}</div>
          <div className="font-sans text-[13px] text-[#8E8E93]">Total Achievement</div>
        </div>

        <div variants={itemVariants} className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col">
          <div className="flex items-center justify-between mb-[16px]">
            <span className="font-sans text-[12px] uppercase tracking-[0.08em] font-medium text-[#8E8E93]">Attendance</span>
            <Users size={20} className="text-[#8E8E93]" />
          </div>
          <div className="font-heading text-[32px] text-[#1E1B2E] leading-none mb-[8px]">{overallAttendance}%</div>
          <div className="font-sans text-[13px] text-[#8E8E93]">Overall Progress</div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT BELOW STATS */}
      <div className="flex flex-col lg:flex-row gap-[24px] px-[32px] mb-[32px]">
        {/* Left Column: Recent Academic Performance */}
        <div
          className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col"
        >
          <div className="p-[20px_24px] flex flex-row items-center gap-[12px]">
            <ClipboardList size={18} className="text-[#1E1B2E]" />
            <h3 className="font-heading text-[18px] text-[#1E1B2E] m-0 leading-none">Recent Academic Performance</h3>
          </div>
          <div className="h-[1px] w-full bg-[rgba(30,27,46,0.06)]" />
          
          <div className="flex-1 flex flex-col">
            {child.marks.length === 0 ? (
              <div className="py-[40px] px-[24px] text-center flex-1 flex items-center justify-center">
                <span className="font-sans text-[14px] text-[#8E8E93] italic">No exam results published yet.</span>
              </div>
            ) : (
              <div className="flex flex-col px-[24px] divide-y divide-[rgba(30,27,46,0.06)]">
                {child.marks.map((m: any, i: number) => (
                  <div key={i} className="py-[16px] flex items-center justify-between gap-[16px]">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans text-[15px] font-medium text-[#1E1B2E] truncate">{m.subject}</h4>
                      <p className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-center px-[12px] py-[4px] rounded-full bg-[rgba(201,169,110,0.1)] text-[#C9A96E] font-sans text-[14px] font-medium shrink-0">
                      {m.score}/100
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ongoing Curriculum */}
        <div
          className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex-1 flex flex-col"
        >
          <div className="p-[20px_24px] flex flex-row items-center gap-[12px]">
            <BookOpen size={18} className="text-[#1E1B2E]" />
            <h3 className="font-heading text-[18px] text-[#1E1B2E] m-0 leading-none">Ongoing Curriculum</h3>
          </div>
          <div className="h-[1px] w-full bg-[rgba(30,27,46,0.06)]" />
          
          <div className="flex-1 flex flex-col">
            {coursesWithProgress.length === 0 ? (
              <div className="py-[40px] px-[24px] text-center flex-1 flex items-center justify-center">
                <span className="font-sans text-[14px] text-[#8E8E93] italic">Not enrolled in any subjects.</span>
              </div>
            ) : (
              <div className="flex flex-col px-[24px] divide-y divide-[rgba(30,27,46,0.04)]">
                {coursesWithProgress.map((course: any, i: number) => (
                  <div key={i} className="py-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
                    <div className="flex items-center gap-[16px] flex-1 min-w-0">
                      <div className="w-[40px] h-[40px] rounded-xl bg-[rgba(245,241,235,0.8)] flex items-center justify-center shrink-0">
                        <BookOpen size={18} className="text-[#1E1B2E]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-[15px] font-medium text-[#1E1B2E] truncate capitalize">{course.title.toLowerCase()}</h4>
                        <p className="font-sans text-[12px] text-[#8E8E93] mt-[2px] truncate">Category: {course.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-[8px] shrink-0 self-end sm:self-center w-full sm:w-auto mt-[8px] sm:mt-0">
                      <span className="font-sans text-[12px] text-[#8E8E93] w-[36px] text-right">{course.progress}%</span>
                      <div className="w-[120px] h-[6px] rounded-full bg-[rgba(30,27,46,0.08)] overflow-hidden shrink-0">
                        <div 
                          className="h-full bg-[#C9A96E] rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${course.progress}%` }} 
                        />
                      </div>
                      <span className="font-sans text-[12px] text-[#8E8E93] w-[32px] text-right">
                        {course.completedLessons}/{course.totalLessons}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
