"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Trophy,
  Flame,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Play,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Calendar,
  Star,
} from "lucide-react";

// Easing and motion setup
const easing = [0.25, 0.1, 0.25, 1.0] as const;

interface OverviewProps {
  user: {
    name: string;
    points: number;
    studyHours: number;
    currentStreak: number;
    level: number;
  };
  enrollments: Array<{
    id: string;
    title: string;
    progress: number;
    teacher: string;
    thumbnail?: string | null;
  }>;
  marks: Array<{
    subject: string;
    score: number;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issueDate: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: "course" | "score" | "certificate";
    title: string;
    subtitle: string;
    time: string;
  }>;
}

// ── Section 1: ProgressHero ──────────────────────────────────────────────
function ProgressHero({
  name,
  streak,
  progressPercent,
  level,
  shouldReduceMotion,
}: {
  name: string;
  streak: number;
  progressPercent: number;
  level: number;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easing, delay: 0.0 }}
      className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#1E1B2E]/10 shadow-[0_12px_40px_rgba(30,27,46,0.06)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
    >
      {/* Subtle Gold Glow Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F1EB] border border-[#C9A96E]/30 text-[#1E1B2E] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Level {level} Explorer
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1B2E] tracking-tight" style={{ fontFamily: "var(--font-heading, serif)" }}>
          Welcome back, {name || "Student"}!
        </h1>
        <p className="text-[#8E8E93] text-base leading-relaxed">
          You are on a stellar streak. Keep fueling your ambition and complete today's recommended milestone.
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F5F1EB] rounded-2xl border border-[#1E1B2E]/5">
            <Flame className="w-5 h-5 text-[#C9A96E] fill-[#C9A96E]/20" />
            <span className="text-sm font-bold text-[#1E1B2E]">{streak || 0} Day Streak</span>
          </div>
          <Link href="/courses">
            <button className="px-5 py-2.5 bg-[#1E1B2E] text-[#FFFFFF] rounded-2xl text-sm font-semibold hover:bg-[#C9A96E] hover:text-[#1E1B2E] transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]">
              Explore Catalog →
            </button>
          </Link>
        </div>
      </div>

      {/* Visual Progress Ring */}
      <div className="relative flex items-center justify-center w-36 h-36 shrink-0 z-10" aria-label={`Overall progress: ${progressPercent}%`}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="text-[#F5F1EB]"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            className="text-[#C9A96E]"
            strokeWidth="10"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (251.2 * progressPercent) / 100 }}
            transition={{ duration: 1.2, ease: easing, delay: 0.2 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-[#1E1B2E]">{progressPercent}%</span>
          <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">Avg Mastery</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section 2: KpiGrid ───────────────────────────────────────────────────
function KpiGrid({
  totalHours,
  completedCoursesCount,
  activeCoursesCount,
  averageGrade,
  shouldReduceMotion,
}: {
  totalHours: number;
  completedCoursesCount: number;
  activeCoursesCount: number;
  averageGrade: number;
  shouldReduceMotion: boolean;
}) {
  const kpis = [
    {
      label: "Study Hours",
      value: `${totalHours || 0}h`,
      subtitle: "+2.5h this week",
      icon: Clock,
      trend: [20, 35, 45, 30, 60, 75, 85],
    },
    {
      label: "Active Courses",
      value: activeCoursesCount || 0,
      subtitle: "Currently enrolled",
      icon: BookOpen,
      trend: [1, 2, 2, 3, 3, 4, 4],
    },
    {
      label: "Completed",
      value: completedCoursesCount || 0,
      subtitle: "Full certifications",
      icon: Award,
      trend: [0, 0, 1, 1, 2, 2, 3],
    },
    {
      label: "Average Grade",
      value: averageGrade ? `${averageGrade}%` : "—",
      subtitle: "Across evaluations",
      icon: TrendingUp,
      trend: [70, 75, 80, 82, 88, 85, 92],
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
    >
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={index}
            variants={{
              hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing } },
            }}
            whileHover={{ y: -4 }}
            className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#1E1B2E]/10 shadow-[0_8px_30px_rgba(30,27,46,0.04)] flex flex-col justify-between group transition-shadow hover:shadow-[0_12px_40px_rgba(30,27,46,0.08)]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#8E8E93]">{kpi.label}</span>
              <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] flex items-center justify-center text-[#1E1B2E] group-hover:bg-[#C9A96E] group-hover:text-[#FFFFFF] transition-colors">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#1E1B2E]">{kpi.value}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-[#22C55E]">{kpi.subtitle}</span>
                {/* Mini Sparkline Chart */}
                <div className="flex items-end gap-0.5 h-6">
                  {kpi.trend.map((val, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#C9A96E]/40 rounded-t group-hover:bg-[#C9A96E] transition-all"
                      style={{ height: `${Math.max(20, (val / 100) * 100)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ── Section 3: LearningPath ──────────────────────────────────────────────
function LearningPath({
  enrolledCourses,
  shouldReduceMotion,
}: {
  enrolledCourses: Array<{ id: string; title: string; progress: number; teacher: string }>;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: easing, delay: 0.2 }}
      className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#1E1B2E]/10 shadow-[0_12px_40px_rgba(30,27,46,0.06)] flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
            Learning Path Milestone
          </h2>
          <p className="text-sm text-[#8E8E93]">Your active curriculum progress</p>
        </div>
        <Link href="/dashboard/student/courses">
          <span className="text-sm font-semibold text-[#C9A96E] hover:text-[#1E1B2E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded-md px-2 py-1">
            View All Courses →
          </span>
        </Link>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="py-12 text-center bg-[#F5F1EB]/50 rounded-2xl border border-dashed border-[#8E8E93]/30">
          <BookOpen className="w-10 h-10 text-[#C9A96E] mx-auto mb-3 opacity-60" />
          <p className="font-bold text-[#1E1B2E]">No active courses enrolled</p>
          <p className="text-sm text-[#8E8E93] mt-1">Enroll in a course to track your milestones here.</p>
        </div>
      ) : (
        <div className="space-y-5 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#F5F1EB] before:z-0">
          {enrolledCourses.slice(0, 4).map((course, idx) => {
            const isCompleted = course.progress >= 100;
            return (
              <motion.div
                key={course.id}
                whileHover={{ x: 4 }}
                className="relative z-10 flex items-center gap-4 p-4 rounded-2xl bg-[#F5F1EB]/40 hover:bg-[#F5F1EB] border border-transparent hover:border-[#1E1B2E]/10 transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                    isCompleted
                      ? "bg-[#22C55E] text-[#FFFFFF]"
                      : "bg-[#1E1B2E] text-[#C9A96E] ring-4 ring-[#FFFFFF]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1E1B2E] truncate text-base group-hover:text-[#C9A96E] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#8E8E93]">{course.teacher}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-2 bg-[#FFFFFF] rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-[#C9A96E] rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#1E1B2E] w-9 text-right">
                    {course.progress}%
                  </span>
                  <Link href={`/dashboard/student/courses/${course.id}`}>
                    <button className="w-8 h-8 rounded-xl bg-[#FFFFFF] flex items-center justify-center text-[#1E1B2E] shadow hover:bg-[#1E1B2E] hover:text-[#FFFFFF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ── Section 4: NextActionCard ────────────────────────────────────────────
function NextActionCard({
  courseTitle,
  courseId,
  durationLeft,
  shouldReduceMotion,
}: {
  courseTitle: string;
  courseId: string | null;
  durationLeft: string;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easing, delay: 0.25 }}
      className="bg-[#1E1B2E] text-[#FFFFFF] rounded-3xl p-8 border-2 border-[#C9A96E] shadow-[0_16px_48px_rgba(30,27,46,0.2)] flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C9A96E]/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold uppercase tracking-wider">
            Up Next
          </span>
          <span className="text-xs text-[#8E8E93] font-medium">{durationLeft}</span>
        </div>
        <h3 className="text-2xl font-extrabold text-[#FFFFFF] mb-2 leading-snug" style={{ fontFamily: "var(--font-heading, serif)" }}>
          {courseTitle}
        </h3>
        <p className="text-sm text-[#8E8E93] leading-relaxed mb-6">
          Resume where you left off. Every step forward builds real-world mastery.
        </p>
      </div>

      <Link href={courseId ? `/dashboard/student/courses/${courseId}` : "/courses"}>
        <button className="w-full py-4 bg-[#C9A96E] text-[#1E1B2E] rounded-2xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#FFFFFF] transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]">
          <Play className="w-4 h-4 fill-current" /> Resume Playback
        </button>
      </Link>
    </motion.div>
  );
}

// ── Section 5: CertificatesGallery ───────────────────────────────────────
function CertificatesGallery({
  certificates,
  shouldReduceMotion,
}: {
  certificates: Array<{ id: string; title: string; issueDate: string }>;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easing, delay: 0.3 }}
      className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#1E1B2E]/10 shadow-[0_12px_40px_rgba(30,27,46,0.06)]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
            Certificates Gallery
          </h2>
          <p className="text-sm text-[#8E8E93]">Verified credentials you have unlocked</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="py-10 text-center bg-[#F5F1EB]/50 rounded-2xl border border-dashed border-[#8E8E93]/30">
          <Award className="w-10 h-10 text-[#C9A96E] mx-auto mb-2 opacity-60" />
          <p className="font-bold text-[#1E1B2E] text-sm">No certificates earned yet</p>
          <p className="text-xs text-[#8E8E93] mt-1">Complete 100% of a course to receive your badge of honor.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              className="min-w-[260px] max-w-[280px] shrink-0 bg-[#F5F1EB] rounded-2xl p-5 border border-[#C9A96E]/30 snap-start flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1E1B2E] text-[#C9A96E] flex items-center justify-center shrink-0 shadow">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-bold text-[#C9A96E] uppercase tracking-wider">Certified</span>
              </div>
              <h4 className="font-bold text-[#1E1B2E] text-base mb-2 line-clamp-2">{cert.title}</h4>
              <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-3 border-t border-[#1E1B2E]/10">
                <span>Issued</span>
                <span className="font-semibold text-[#1E1B2E]">
                  {new Date(cert.issueDate).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Section 6: RecentActivityFeed ────────────────────────────────────────
function RecentActivityFeed({
  recentActivity,
  shouldReduceMotion,
}: {
  recentActivity: Array<{ id: string; type: "course" | "score" | "certificate"; title: string; subtitle: string; time: string }>;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: easing, delay: 0.35 }}
      className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#1E1B2E]/10 shadow-[0_12px_40px_rgba(30,27,46,0.06)] flex flex-col justify-between"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
          Recent Activity Feed
        </h2>
        <p className="text-sm text-[#8E8E93]">Chronological progress timeline</p>
      </div>

      {recentActivity.length === 0 ? (
        <div className="py-10 text-center bg-[#F5F1EB]/50 rounded-2xl border border-dashed border-[#8E8E93]/30">
          <Calendar className="w-10 h-10 text-[#C9A96E] mx-auto mb-2 opacity-60" />
          <p className="font-bold text-[#1E1B2E] text-sm">No recent activity</p>
          <p className="text-xs text-[#8E8E93] mt-1">Start engaging with lessons and quizzes!</p>
        </div>
      ) : (
        <div className="divide-y divide-[#8E8E93]/15 space-y-4">
          {recentActivity.map((act) => {
            return (
              <div key={act.id} className="pt-4 first:pt-0 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F1EB] text-[#1E1B2E] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  {act.type === "certificate" ? "🏆" : act.type === "score" ? "⭐" : "📘"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1E1B2E] leading-snug truncate">{act.title}</p>
                  <p className="text-xs text-[#8E8E93] mt-0.5">{act.subtitle}</p>
                </div>
                <span className="text-[11px] font-semibold text-[#8E8E93] shrink-0">{act.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ── Main Overview Client Wrapper ─────────────────────────────────────────
export default function StudentOverviewClient({ user, enrollments, marks, certificates }: OverviewProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const progressPercent =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, enr) => sum + enr.progress, 0) / enrollments.length)
      : 0;

  const activeCoursesCount = enrollments.filter((e) => e.progress < 100).length;
  const completedCoursesCount = enrollments.filter((e) => e.progress >= 100).length;
  const averageGrade =
    marks.length > 0 ? Math.round(marks.reduce((s, m) => s + m.score, 0) / marks.length) : 0;

  const nextCourse = enrollments.find((e) => e.progress < 100) || enrollments[0];

  // Construct recent activity safe fallback
  const recentActivity: OverviewProps["recentActivity"] = [
    ...marks.slice(0, 3).map((m, i) => ({
      id: `mark-${i}`,
      type: "score" as const,
      title: `Scored ${m.score}% in Quiz`,
      subtitle: m.subject,
      time: "Recently",
    })),
    ...certificates.slice(0, 2).map((c, i) => ({
      id: `cert-${i}`,
      type: "certificate" as const,
      title: `Earned Certificate`,
      subtitle: c.title,
      time: new Date(c.issueDate).toLocaleDateString(),
    })),
  ].slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Progress Hero */}
      <ProgressHero
        name={user.name?.split(" ")[0] || "Student"}
        streak={user.currentStreak || 0}
        progressPercent={progressPercent}
        level={user.level || 1}
        shouldReduceMotion={shouldReduceMotion}
      />

      {/* 2. KPI Grid */}
      <KpiGrid
        totalHours={user.studyHours || 0}
        completedCoursesCount={completedCoursesCount}
        activeCoursesCount={activeCoursesCount}
        averageGrade={averageGrade}
        shouldReduceMotion={shouldReduceMotion}
      />

      {/* 12-Column Layout split: 8 col Left Area + 4 col Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8-Column Stack */}
        <div className="lg:col-span-8 space-y-8">
          {/* 3. Learning Path Timeline */}
          <LearningPath
            enrolledCourses={enrollments}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* 5. Certificates Gallery */}
          <CertificatesGallery
            certificates={certificates}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* Right 4-Column Stack */}
        <div className="lg:col-span-4 space-y-8">
          {/* 4. Next Action CTA Card */}
          <NextActionCard
            courseTitle={nextCourse ? nextCourse.title : "Explore New Courses"}
            courseId={nextCourse ? nextCourse.id : null}
            durationLeft={nextCourse ? `${Math.round(Math.max(10, (100 - nextCourse.progress) * 0.4))}m left` : "Get started"}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* 6. Recent Activity Feed */}
          <RecentActivityFeed
            recentActivity={recentActivity}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      </div>
    </div>
  );
}
