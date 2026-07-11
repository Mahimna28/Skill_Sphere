"use client";

import { useState } from "react";
import { GraduationCap, Trophy, BookOpen, Users, Mail, AlertCircle, ClipboardList, Calendar, MessageCircle, Clock, CheckCircle2, ChevronRight, BarChart3, Star, Download } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ParentOverviewClient({ childrenData }: { childrenData: any[] }) {
  const [activeChildId, setActiveChildId] = useState<string>(childrenData[0]?.id || "");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [childEmail, setChildEmail] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [linkMessage, setLinkMessage] = useState("");

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLink(true);
    setLinkMessage("");
    try {
      const res = await fetch("/api/parent/link-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setLinkMessage("Success! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setLinkMessage(data.message || "Failed to link child.");
      }
    } catch (err) {
      setLinkMessage("An error occurred.");
    } finally {
      setLoadingLink(false);
    }
  };

  if (!childrenData || childrenData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-heading text-[#1E1B2E]">No Child Linked</h2>
        <p className="max-w-md font-sans text-[14px] text-[#8E8E93]">
          It seems your account isn't linked to a student. Link your child using their email address.
        </p>
        <button onClick={() => setShowLinkModal(true)} className="px-6 py-3 bg-[#1E1B2E] text-white rounded-xl font-medium mt-4 hover:bg-[#2D2844] transition">
          Link Child
        </button>

        {showLinkModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
              <button onClick={() => setShowLinkModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
                ×
              </button>
              <h3 className="font-heading text-xl mb-2 text-left">Link a Child</h3>
              <p className="text-gray-500 text-[13px] mb-4 text-left">Enter the email address your child used to register as a student.</p>
              <form onSubmit={handleLinkChild} className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="student@example.com" 
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" 
                  value={childEmail}
                  onChange={(e) => setChildEmail(e.target.value)}
                  required
                />
                {linkMessage && (
                  <p className={`text-[13px] font-medium text-left ${linkMessage.includes("Success") ? "text-green-600" : "text-red-500"}`}>
                    {linkMessage}
                  </p>
                )}
                <button type="submit" disabled={loadingLink} className="w-full bg-[#C9A96E] text-[#1E1B2E] font-medium py-3 rounded-lg hover:bg-[#b8985d] transition-all disabled:opacity-50">
                  {loadingLink ? "Linking..." : "Link Child Account"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const child = childrenData.find(c => c.id === activeChildId) || childrenData[0];
  const { avgScore, coursesWithProgress, overallAttendance } = child;

  // Extract all assignments and submissions
  let allAssignments: any[] = [];
  let allSubmissions: any[] = [];
  coursesWithProgress.forEach((course: any) => {
    course.assignments?.forEach((assignment: any) => {
      allAssignments.push({ ...assignment, courseName: course.title });
      assignment.submissions?.forEach((sub: any) => {
        if (sub.studentId === child.id || sub.userId === child.id) { // depending on schema
          allSubmissions.push({ ...sub, assignmentTitle: assignment.title, courseName: course.title });
        }
      });
    });
  });

  // 1. Recent Activity Timeline
  const recentMarks = child.marks?.map((m: any) => ({ type: "grade", date: new Date(m.createdAt), title: `Scored ${m.score}/100 in ${m.subject}`, courseName: m.subject })) || [];
  const recentCompletions = child.completedLessons?.map((cl: any) => ({ type: "completion", date: new Date(cl.createdAt || Date.now()), title: "Completed a lesson", courseName: "Module Lesson" })) || [];
  const recentSubmissions = allSubmissions.map((sub: any) => ({ type: "submission", date: new Date(sub.createdAt), title: `Submitted ${sub.assignmentTitle}`, courseName: sub.courseName }));
  
  const timeline = [...recentMarks, ...recentCompletions, ...recentSubmissions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // 2. Upcoming Deadlines
  const now = new Date();
  const upcomingDeadlines = allAssignments
    .filter(a => new Date(a.dueDate) > now && !allSubmissions.some(s => s.assignmentId === a.id))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  // 3. Teacher Feedback Highlights
  const feedbackHighlights = allSubmissions
    .filter(s => s.feedback)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Chart data
  const chartData = child.marks ? [...child.marks].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(-10) : [];

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen w-full font-sans pb-20 overflow-x-hidden min-w-0">
      
      {/* CHILD SWITCHER & HEADER */}
      <div className="bg-white px-[32px] py-[20px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {childrenData.map((c) => (
            <button 
              key={c.id} 
              onClick={() => setActiveChildId(c.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all whitespace-nowrap border-2 ${activeChildId === c.id ? 'border-[#C9A96E] bg-[rgba(201,169,110,0.1)]' : 'border-transparent hover:bg-gray-100'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#1E1B2E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <span className={`font-semibold text-[14px] ${activeChildId === c.id ? 'text-[#1E1B2E]' : 'text-[#8E8E93]'}`}>{c.name}</span>
            </button>
          ))}
          <button onClick={() => setShowLinkModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-400 transition-all text-sm font-medium whitespace-nowrap">
            + Link Child
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/community" className="flex items-center gap-2 bg-[#1E1B2E] text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#2D2844] transition-all">
            <MessageCircle size={16} /> Community Hub
          </Link>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-all">
            <Download size={16} /> Report
          </button>
        </div>
      </div>

      <div className="p-[32px] max-w-[1600px] mx-auto w-full flex flex-col gap-8">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px]">
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden border border-[rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[12px] uppercase tracking-wider font-semibold text-[#8E8E93]">Courses</span>
              <BookOpen size={20} className="text-[#8E8E93]" />
            </div>
            <div className="font-heading text-4xl text-[#1E1B2E] mb-1">{child.enrollments.length}</div>
            <div className="font-sans text-sm text-[#8E8E93]">Enrolled</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden border border-[rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[12px] uppercase tracking-wider font-semibold text-[#8E8E93]">Average Grade</span>
              <Trophy size={20} className="text-[#8E8E93]" />
            </div>
            <div className="font-heading text-4xl text-[#1E1B2E] mb-1">{avgScore !== null ? `${avgScore}%` : 'N/A'}</div>
            <div className="font-sans text-sm text-[#8E8E93]">Overall Performance</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden border border-[rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[12px] uppercase tracking-wider font-semibold text-[#8E8E93]">Attendance</span>
              <Users size={20} className="text-[#8E8E93]" />
            </div>
            <div className="font-heading text-4xl text-[#1E1B2E] mb-1">{overallAttendance}%</div>
            <div className="font-sans text-sm text-[#8E8E93]">Module Completion</div>
          </div>
          <div className="bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden text-white border border-[rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[12px] uppercase tracking-wider font-semibold text-white/70">Points</span>
              <Star size={20} className="text-[#C9A96E]" fill="#C9A96E" />
            </div>
            <div className="font-heading text-4xl mb-1 text-[#C9A96E]">{child.points}</div>
            <div className="font-sans text-sm text-white/70">Total Achievements</div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          
          {/* LEFT COL: TIMELINE & FEEDBACK */}
          <div className="lg:col-span-1 flex flex-col gap-[24px]">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-heading text-lg text-[#1E1B2E] flex items-center gap-2">
                  <Calendar size={18} className="text-[#C9A96E]"/> Upcoming Deadlines
                </h3>
              </div>
              <div className="p-0">
                {upcomingDeadlines.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm italic">No upcoming deadlines!</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {upcomingDeadlines.map((a: any, i: number) => {
                      const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysLeft <= 2;
                      return (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-medium text-[14px] text-[#1E1B2E] truncate">{a.title}</h4>
                            <p className="text-[12px] text-gray-500 truncate">{a.courseName}</p>
                          </div>
                          <div className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-bold ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-[#F5F1EB] text-[#1E1B2E]'}`}>
                            {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Feedback */}
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-heading text-lg text-[#1E1B2E] flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#C9A96E]"/> Teacher Feedback
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {feedbackHighlights.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm italic py-4">No recent feedback.</div>
                ) : (
                  feedbackHighlights.map((sub: any, i: number) => (
                    <div key={i} className="bg-[#F9F9F9] rounded-xl p-4 border border-gray-100 relative">
                      <div className="absolute -left-1 top-4 w-2 h-8 bg-[#C9A96E] rounded-r-md"></div>
                      <p className="text-[13px] text-gray-700 italic mb-2">"{sub.feedback}"</p>
                      <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
                        <span>{sub.assignmentTitle}</span>
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE & RIGHT COL: CHART & ACTIVITY */}
          <div className="lg:col-span-2 flex flex-col gap-[24px]">
            {/* Performance Trend (Custom CSS Chart) */}
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.02)] p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading text-lg text-[#1E1B2E] flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#C9A96E]"/> Performance Trend
                </h3>
              </div>
              
              <div className="relative h-[200px] w-full flex items-end justify-between pt-4 pb-8 border-b border-l border-gray-100 px-2">
                {chartData.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
                    Not enough data for chart
                  </div>
                ) : (
                  chartData.map((d: any, i: number) => {
                    const heightPercent = Math.max(10, (d.score / 100) * 100);
                    return (
                      <div key={i} className="relative flex flex-col items-center justify-end w-full group h-full">
                        <div 
                          className="w-[30%] max-w-[40px] bg-gradient-to-t from-[rgba(201,169,110,0.2)] to-[#C9A96E] rounded-t-md transition-all duration-500"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        <div className="absolute -bottom-6 text-[10px] text-gray-400 font-medium whitespace-nowrap rotate-45 origin-left">
                          {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="absolute bottom-[calc(100%+10px)] opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E1B2E] text-white text-[11px] px-2 py-1 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
                          {d.subject}: {d.score}%
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Two blocks side by side: Recent Activity & Course Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-heading text-lg text-[#1E1B2E] flex items-center gap-2">
                    <Clock size={18} className="text-[#C9A96E]"/> Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  {timeline.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm italic py-4">No recent activity.</div>
                  ) : (
                    <div className="relative border-l-2 border-gray-100 ml-3 flex flex-col gap-6">
                      {timeline.map((item: any, i: number) => {
                        let Icon = CheckCircle2;
                        let color = "bg-blue-100 text-blue-600";
                        if (item.type === 'grade') { Icon = Trophy; color = "bg-yellow-100 text-yellow-600"; }
                        if (item.type === 'submission') { Icon = ClipboardList; color = "bg-purple-100 text-purple-600"; }

                        return (
                          <div key={i} className="relative pl-6">
                            <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full ${color} flex items-center justify-center border-4 border-white shadow-sm`}>
                              <Icon size={14} />
                            </div>
                            <h4 className="text-[14px] font-semibold text-[#1E1B2E]">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[12px] text-gray-500 font-medium">{item.courseName}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className="text-[11px] text-gray-400">{item.date.toLocaleDateString()}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Progress List */}
              <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-heading text-lg text-[#1E1B2E] flex items-center gap-2">
                    <BookOpen size={18} className="text-[#C9A96E]"/> Course Progress
                  </h3>
                </div>
                <div className="p-0 flex-1 overflow-y-auto max-h-[400px]">
                  {coursesWithProgress.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm italic">Not enrolled in any subjects.</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {coursesWithProgress.map((course: any, i: number) => (
                        <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-end mb-2">
                            <div className="flex-1 min-w-0 pr-4">
                              <h4 className="font-sans text-[14px] font-semibold text-[#1E1B2E] truncate">{course.title}</h4>
                            </div>
                            <span className="text-[12px] font-bold text-[#C9A96E]">{course.progress}%</span>
                          </div>
                          <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#C9A96E] rounded-full transition-all duration-1000" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-2 text-right">
                            {course.completedLessons} / {course.totalLessons} modules
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowLinkModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold">
              ×
            </button>
            <h3 className="font-heading text-xl mb-2 text-[#1E1B2E]">Link a Child</h3>
            <p className="text-gray-500 text-[13px] mb-4">Enter the email address your child used to register as a student on Skill Sphere.</p>
            <form onSubmit={handleLinkChild} className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="student@example.com" 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" 
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                required
              />
              {linkMessage && (
                <p className={`text-[13px] font-medium ${linkMessage.includes("Success") ? "text-green-600" : "text-red-500"}`}>
                  {linkMessage}
                </p>
              )}
              <button type="submit" disabled={loadingLink} className="w-full bg-[#C9A96E] text-[#1E1B2E] font-medium py-3 rounded-lg hover:bg-[#b8985d] transition-all disabled:opacity-50">
                {loadingLink ? "Linking..." : "Link Child Account"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
