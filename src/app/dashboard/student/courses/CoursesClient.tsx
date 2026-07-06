"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
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
}

interface Props {
  courses: Course[];
  enrolledIds: string[];
  pendingLeaveCourseIds?: string[];
}

export default function CoursesClient({
  courses,
  enrolledIds: initialEnrolledIds,
  pendingLeaveCourseIds = [],
}: Props) {
  const router = useRouter();
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
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFFFF]/80 backdrop-blur-md rounded-xl border border-[#1E1B2E]/10 shadow-sm shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-[#C9A96E]" />
            <span className="text-sm font-bold text-[#1E1B2E]">{courses.length} Enrolled</span>
          </div>

          {/* Explore Courses Button */}
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
        </div>
      </div>

      {/* Empty State */}
      {courses.length === 0 ? (
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
            No Courses Enrolled
          </h3>
          <p className="text-[#8E8E93] font-medium max-w-md mx-auto mb-8 leading-relaxed text-sm sm:text-base">
            Your active learning space is ready. Discover industry-leading courses and begin building real-world mastery today.
          </p>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={() => router.push("/courses")}
            aria-label="Explore Courses"
            className="h-[44px] px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm uppercase tracking-wider shadow-[0_8px_24px_rgba(201,169,110,0.4)] flex items-center justify-center gap-2 mx-auto"
          >
            <span>Explore Course Catalog</span>
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
          {courses.map((course) => {
            const isEnrolled = enrolledIds.has(course.id);
            const isLoading = loadingId === course.id;
            const progress = course.progress || 0;

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
                      {/* Shimmer skeleton shown until image loads */}
                      {!imgLoaded.has(course.id) && <ThumbnailSkeleton />}
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        onLoad={() => markImgLoaded(course.id)}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          imgLoaded.has(course.id) ? "opacity-100" : "opacity-0"
                        }`}
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
                <div className="p-5 pt-0 flex items-center gap-3 bg-transparent">
                  {isEnrolled ? (
                    <>
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
    </div>
  );
}
