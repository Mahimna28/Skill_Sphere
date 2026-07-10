"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Play,
  Loader2,
  CheckCircle2,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  Compass,
  Download,
  X,
} from "lucide-react";

// Shimmer skeleton component for image loading
function ThumbnailSkeleton() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
      <div className="w-full h-full flex flex-col items-center justify-center text-[#C9A96E]/30">
        <BookOpen className="w-10 h-10 mb-2" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Loading...</span>
      </div>
    </div>
  );
}

// Hook to track image loading per course
function useImageLoading() {
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const markLoaded = useCallback((id: string) => {
    setLoaded((prev) => new Set([...prev, id]));
  }, []);
  return { loaded, markLoaded };
}

// Global motion easing
const easing = [0.25, 0.1, 0.25, 1.0] as const;

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  teacher: { name: string };
  _count: { enrollments: number };
  isPublic?: boolean;
  totalLessons?: number;
  completedLessons?: number;
  progress?: number;
  certificateId?: string;
}

interface Props {
  courses: Course[];
  classes?: Course[];
  enrolledIds: string[];
  pendingLeaveCourseIds?: string[];
}

export default function CoursesClient({
  courses,
  classes = [],
  enrolledIds: initialEnrolledIds,
  pendingLeaveCourseIds = [],
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"courses" | "classes">("courses");
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set(initialEnrolledIds));
  const [pendingLeave, setPendingLeave] = useState<Set<string>>(new Set(pendingLeaveCourseIds));
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { loaded: imgLoaded, markLoaded: markImgLoaded } = useImageLoading();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleEnroll = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setEnrolledIds((prev) => new Set([...prev, courseId]));
        showToast("🎉 Enrolled! +50 points awarded!", "success");
        router.refresh();
      } else {
        showToast(data.message || "Enrollment failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "DELETE" });
      if (res.ok) {
        setEnrolledIds((prev) => {
          const s = new Set(prev);
          s.delete(courseId);
          return s;
        });
        showToast("Unenrolled from course.", "success");
        router.refresh();
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRequestLeave = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/leave-request`, { method: "POST" });
      if (res.ok) {
        setPendingLeave((prev) => new Set([...prev, courseId]));
        showToast("Leave request sent to teacher.", "success");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to send request.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCodeInput) return;
    setLoadingId("join");
    try {
      const res = await fetch("/api/classes/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classCode: classCodeInput })
      });
      const data = await res.json();
      if (res.ok) {
        setEnrolledIds(prev => new Set([...prev, data.courseId]));
        showToast("Successfully joined class!", "success");
        setShowJoinClass(false);
        setClassCodeInput("");
        router.refresh();
      } else {
        showToast(data.message || "Failed to join class", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  // Framer Motion Variants for Staggered Grid Entrance
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: easing },
    },
  };

  return (
    <div className="relative space-y-8 min-h-[400px]">
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl font-sans font-bold text-sm flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-[#22C55E]/90 text-white border-white/20 shadow-[0_12px_30px_rgba(34,197,94,0.3)]"
              : "bg-[#DC2626]/90 text-white border-white/20 shadow-[0_12px_30px_rgba(220,38,38,0.3)]"
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
          <span>{toast.message}</span>
        </motion.div>
      )}

      {/* Sleek Premium Page Header with Explore Courses Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1B2E]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#C9A96E]/30 text-[#1E1B2E] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Active Curriculum
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-[#1E1B2E] tracking-tight flex items-center gap-3"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            My Courses
          </h1>
          <p className="text-[#8E8E93] text-sm sm:text-base font-medium mt-1">
            Access your enrolled courses, track real-time milestones, and resume learning.
          </p>
        </div>

        {/* Top-Right Header Actions: Enrolled Badge + Explore Courses CTA */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="flex bg-[#F5F1EB] rounded-xl p-1">
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "courses" ? "bg-white text-[#1E1B2E] shadow-sm" : "text-[#8E8E93]"
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab("classes")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "classes" ? "bg-white text-[#1E1B2E] shadow-sm" : "text-[#8E8E93]"
              }`}
            >
              Classes
            </button>
          </div>
          {activeTab === "courses" ? (
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => router.push("/courses")}
              aria-label="Explore Courses"
              className="h-[44px] px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(201,169,110,0.25)] hover:shadow-[0_8px_24px_rgba(201,169,110,0.45)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4.5 h-4.5 shrink-0" />
              <span>Explore Courses</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => setShowJoinClass(true)}
              className="h-[44px] px-6 rounded-xl bg-[#1E1B2E] text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4.5 h-4.5 shrink-0" />
              <span>Join Class</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {(activeTab === "courses" ? courses : classes).length === 0 ? (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easing }}
          className="relative py-24 px-8 text-center rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(30,27,46,0.06)] overflow-hidden max-w-2xl mx-auto"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1E1B2E]/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1E1B2E] to-[#2D2844] text-[#C9A96E] flex items-center justify-center mx-auto mb-6 shadow-xl relative"
          >
            <BookOpen className="w-10 h-10" />
          </motion.div>

          <h3
            className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E] mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            {activeTab === "courses" ? "No Courses Enrolled" : "No Classes Joined"}
          </h3>
          <p className="text-[#8E8E93] font-medium max-w-md mx-auto mb-8 leading-relaxed text-sm sm:text-base">
            {activeTab === "courses"
              ? "Your active learning space is ready. Discover industry-leading courses and begin building real-world mastery today."
              : "Ask your teacher for the class code, then enter it here."}
          </p>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={() => activeTab === "courses" ? router.push("/courses") : setShowJoinClass(true)}
            aria-label="Explore Courses"
            className="h-[44px] px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm uppercase tracking-wider shadow-[0_8px_24px_rgba(201,169,110,0.4)] flex items-center justify-center gap-2 mx-auto"
          >
            <span>{activeTab === "courses" ? "Explore Course Catalog" : "Join Class"}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ) : (
        /* Staggered Course Cards Grid */
        <motion.div
          initial="hidden"
          animate="visible"
          variants={gridVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {(activeTab === "courses" ? courses : classes).map((course) => {
            const isEnrolled = enrolledIds.has(course.id);
            const isLoading = loadingId === course.id;
            const progress = course.progress || 0;

            if (!course.isPublic) {
              return (
                <motion.div
                  key={course.id}
                  variants={cardVariants}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.3, ease: easing }}
                  onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
                  className="group relative flex flex-col rounded-[24px] bg-white border border-[#1E1B2E]/10 shadow-[0_8px_30px_rgba(30,27,46,0.04)] hover:shadow-[0_12px_40px_rgba(30,27,46,0.08)] transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Top Banner Area */}
                  <div className="relative h-[120px] w-full bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] p-6 flex flex-col justify-end shrink-0">
                    {/* Background Pattern / Shimmer */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                    
                    <h3
                      className="text-2xl font-bold text-white leading-tight truncate relative z-10"
                      style={{ fontFamily: "var(--font-heading, serif)" }}
                    >
                      {course.title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium truncate relative z-10">
                      {course.subject}
                    </p>
                  </div>
                  
                  {/* Class Info */}
                  <div className="p-6 pt-5 bg-white flex flex-col justify-between flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center text-lg shadow-sm border border-[#1E1B2E]/5">
                        👨‍🏫
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#1E1B2E] font-bold text-sm">{course.teacher.name}</span>
                        <span className="text-[#8E8E93] text-xs font-semibold">{course._count.enrollments} Students</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-[#1E1B2E]/5 flex justify-end">
                      <button className="px-5 py-2.5 rounded-xl bg-[#F5F1EB] text-[#1E1B2E] group-hover:bg-[#C9A96E] transition-colors font-bold text-xs uppercase tracking-wider">
                        Open Class
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={course.id}
                variants={cardVariants}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.02,
                      }
                }
                transition={{ duration: 0.3, ease: easing }}
                className="group relative flex flex-col rounded-3xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_20px_rgba(30,27,46,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300 overflow-hidden"
              >
                {/* Course Thumbnail Container with Shimmer Skeleton */}
                <div className="relative h-48 w-full bg-[#1E1B2E] overflow-hidden shrink-0">
                  {course.thumbnail ? (
                    <>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1B2E] to-[#2D2844] text-[#C9A96E]">
                      <BookOpen className="w-12 h-12 opacity-40 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]/50">
                        {course.subject}
                      </span>
                    </div>
                  )}

                  {/* Gradient Shimmer Sweep across Thumbnail on Hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />

                  {/* Subject Badge */}
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#1E1B2E]/85 backdrop-blur-md border border-white/20 text-[#FFFFFF] text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    {course.subject}
                  </div>

                  {/* Enrolled Badge Pill */}
                  {isEnrolled && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-[#22C55E] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-white/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                    </div>
                  )}
                </div>

                {/* Card Body (Clean, crisp font, no blur or haze overlays) */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-transparent">
                  <div>
                    <h3
                      className="text-xl font-bold text-[#1E1B2E] leading-snug group-hover:text-[#C9A96E] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-heading, serif)" }}
                    >
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#1E1B2E]/10 text-xs text-[#8E8E93] font-medium">
                      <span className="flex items-center gap-1.5 text-[#1E1B2E] font-semibold">
                        <span className="w-5 h-5 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[10px]">
                          👨‍🏫
                        </span>
                        {course.teacher.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
                        {course._count.enrollments}
                      </span>
                    </div>

                    <p className="text-xs text-[#8E8E93] leading-relaxed line-clamp-2 mt-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Animated Liquid Progress Bar section */}
                  {isEnrolled && (
                    <div className="space-y-2 pt-3 border-t border-[#1E1B2E]/10">
                      <div className="flex justify-between text-xs font-bold text-[#1E1B2E]">
                        <span className="flex items-center gap-1 text-[#8E8E93]">
                          <Clock className="w-3.5 h-3.5 text-[#C9A96E]" /> Progress
                        </span>
                        <span>{progress}%</span>
                      </div>

                      {/* Crisp Progress Track */}
                      <div className="relative h-2.5 w-full bg-[#F5F1EB] rounded-full overflow-hidden border border-[#1E1B2E]/10 shadow-inner">
                        <motion.div
                          initial={shouldReduceMotion ? { width: `${progress}%` } : { width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: easing, delay: 0.2 }}
                          className="relative h-full bg-gradient-to-r from-[#C9A96E] to-[#E5C992] rounded-full"
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-[#8E8E93] font-semibold">
                        <span>Milestones</span>
                        <span>
                          {course.completedLessons || 0} / {course.totalLessons || 0} Lessons
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex flex-col gap-3 bg-transparent">
                  {isEnrolled ? (
                    <>
                      {course.certificateId ? (
                        <div className="flex flex-col gap-3 w-full">
                           <div className="px-4 py-2.5 rounded-xl bg-[#22C55E]/10 text-[#22C55E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#22C55E]/20">
                             <CheckCircle2 size={16} /> Course Completed
                           </div>
                           <div className="flex items-center gap-3 w-full">
                             <motion.button
                               whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                               whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                               onClick={() => window.open(`/certificates/${course.certificateId}`, '_blank')}
                               disabled={isLoading}
                               className="flex-1 relative overflow-hidden py-3.5 px-3 rounded-2xl bg-[#C9A96E] hover:bg-[#D4B57A] transition-colors text-[#1E1B2E] font-bold text-[11px] uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                             >
                               <Download className="w-3.5 h-3.5 shrink-0" />
                               <span>Certificate</span>
                             </motion.button>
                             {course.isPublic ? (
                               <button
                                 onClick={() => handleUnenroll(course.id)}
                                 disabled={isLoading}
                                 className="px-3.5 py-3.5 rounded-2xl bg-[#F5F1EB] hover:bg-red-50 hover:text-red-600 text-[#8E8E93] font-bold text-xs transition-colors border border-[#1E1B2E]/10 flex items-center justify-center cursor-pointer"
                                 title="Unenroll from course"
                               >
                                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Leave"}
                               </button>
                             ) : pendingLeave.has(course.id) ? (
                               <span className="px-3.5 py-3.5 rounded-2xl bg-[#F5F1EB] text-[#8E8E93] font-semibold text-xs border border-dashed border-[#8E8E93]/40 flex items-center gap-1">
                                 <Clock className="w-3.5 h-3.5" /> Pending
                               </span>
                             ) : (
                               <button
                                 onClick={() => handleRequestLeave(course.id)}
                                 disabled={isLoading}
                                 className="px-3.5 py-3.5 rounded-2xl bg-[#F5F1EB] hover:bg-amber-50 hover:text-amber-700 text-[#8E8E93] font-bold text-xs transition-colors border border-[#1E1B2E]/10 flex items-center gap-1 cursor-pointer"
                                 title="Request leave from teacher"
                               >
                                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                               </button>
                             )}
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 w-full">
                          {/* Fluid Gold Continue Button */}
                          <motion.button
                            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
                            disabled={isLoading}
                            className="flex-1 relative overflow-hidden py-3.5 px-4 rounded-2xl bg-[#C9A96E] hover:bg-[#D4B57A] transition-colors text-[#1E1B2E] font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_6px_20px_rgba(201,169,110,0.45)] flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current shrink-0" />
                            <span>Continue</span>
                          </motion.button>

                          {/* Leave / Unenroll Button */}
                          {course.isPublic ? (
                            <button
                              onClick={() => handleUnenroll(course.id)}
                              disabled={isLoading}
                              className="px-3.5 py-3.5 rounded-2xl bg-[#F5F1EB] hover:bg-red-50 hover:text-red-600 text-[#8E8E93] font-bold text-xs transition-colors border border-[#1E1B2E]/10 flex items-center justify-center cursor-pointer"
                              title="Unenroll from course"
                            >
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Leave"}
                            </button>
                          ) : pendingLeave.has(course.id) ? (
                            <span className="px-3.5 py-3.5 rounded-2xl bg-[#F5F1EB] text-[#8E8E93] font-semibold text-xs border border-dashed border-[#8E8E93]/40 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRequestLeave(course.id)}
                              disabled={isLoading}
                              className="px-3.5 py-3.5 rounded-2xl bg-[#F5F1EB] hover:bg-amber-50 hover:text-amber-700 text-[#8E8E93] font-bold text-xs transition-colors border border-[#1E1B2E]/10 flex items-center gap-1 cursor-pointer"
                              title="Request leave from teacher"
                            >
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.button
                      whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      onClick={() => router.push(`/dashboard/student/courses/${course.id}/details`)}
                      className="w-full py-3.5 rounded-2xl bg-[#1E1B2E] text-[#FFFFFF] hover:bg-[#C9A96E] hover:text-[#1E1B2E] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Course Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Join Class Modal */}
      <AnimatePresence>
        {showJoinClass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1E1B2E]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-full max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-[rgba(30,27,46,0.06)] bg-white/50 backdrop-blur-sm shrink-0">
                <h2 className="font-heading text-[24px] text-[#1E1B2E]">Join Class</h2>
                <button 
                  onClick={() => setShowJoinClass(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-[rgba(30,27,46,0.04)] text-[#8E8E93] hover:text-[#1E1B2E] transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 flex-1 custom-scrollbar">
                <form onSubmit={handleJoinClass} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-[0.1em] font-bold text-[#8E8E93]">Class Code <span className="text-[#DC2626]">*</span></label>
                    <input
                      required
                      placeholder="e.g. ABCDEF"
                      className="w-full h-[52px] bg-[#F5F1EB] rounded-xl px-5 text-[15px] font-mono font-medium text-[#1E1B2E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 tracking-widest uppercase"
                      value={classCodeInput}
                      onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                    <p className="text-[12px] text-[#8E8E93] mt-2">Ask your teacher for the class code, then enter it here.</p>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setShowJoinClass(false)} className="flex-1 h-[56px] rounded-xl bg-white text-[#1E1B2E] text-[15px] font-bold hover:bg-[#F5F1EB] transition-colors border border-[rgba(30,27,46,0.1)]">
                      Cancel
                    </button>
                    <button type="submit" disabled={loadingId === "join" || classCodeInput.length < 5} className="flex-[2] h-[56px] rounded-xl bg-[#1E1B2E] text-white text-[15px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all disabled:opacity-50">
                      {loadingId === "join" ? <Loader2 className="animate-spin" size={20} /> : "Join Class"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
