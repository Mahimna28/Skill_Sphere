"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  Trophy,
  Users,
  LayoutList,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const easing = [0.25, 0.1, 0.25, 1.0] as const;

interface Props {
  course: any;
}

export default function CourseDetailsClient({ course }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showToast("🎉 Enrolled! Redirecting to course...", "success");
        setTimeout(() => {
          router.push(`/dashboard/student/courses/${course.id}`);
        }, 1000);
      } else {
        showToast(data.message || "Enrollment failed", "error");
        setIsLoading(false);
      }
    } catch {
      showToast("Network error. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + mod._count.lessons, 0);

  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: easing },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easing },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-8 pb-20 relative font-sans"
    >
      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl font-bold text-sm flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-[#22C55E]/90 text-white border-white/20 shadow-[0_12px_30px_rgba(34,197,94,0.3)]"
              : "bg-[#DC2626]/90 text-white border-white/20 shadow-[0_12px_30px_rgba(220,38,38,0.3)]"
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
          <span>{toast.message}</span>
        </motion.div>
      )}

      {/* Header / Back */}
      <Link
        href="/dashboard/student/courses"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#8E8E93] hover:text-[#C9A96E] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      {/* Hero Section — Frosted Glass Card */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(30,27,46,0.06)] flex flex-col md:flex-row"
      >
        {/* Ambient interior lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1E1B2E]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Thumbnail */}
        <div className="w-full md:w-1/2 aspect-video bg-[#1E1B2E] relative overflow-hidden">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1E1B2E] to-[#2D2844]">
              <BookOpen size={64} className="text-[#C9A96E] opacity-30" />
            </div>
          )}
          {/* Subject Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#1E1B2E]/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
            {course.subject}
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative z-10">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-[#1E1B2E] leading-tight tracking-tight mb-3"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            {course.title}
          </h1>
          <p className="text-[#8E8E93] font-bold text-sm flex items-center gap-2.5 mb-8">
            <span className="w-8 h-8 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center text-sm">
              👨‍🏫
            </span>
            {course.teacher.name}
          </p>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="w-full h-14 rounded-2xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-base uppercase tracking-wider transition-all shadow-[0_8px_24px_rgba(201,169,110,0.35)] hover:shadow-[0_12px_32px_rgba(201,169,110,0.5)] flex items-center justify-center gap-3 cursor-pointer"
            onClick={handleEnroll}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Enrolling...
              </>
            ) : (
              <>
                <span>Enroll Now For Free</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Details & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <motion.div variants={cardVariants} className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] p-8 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

            <h2
              className="text-2xl font-extrabold text-[#1E1B2E] mb-4 relative z-10"
              style={{ fontFamily: "var(--font-heading, serif)" }}
            >
              About This Course
            </h2>
            <div className="w-16 h-1 rounded-full bg-[#C9A96E] mb-6" />
            <p className="text-base font-medium text-[#1E1B2E]/80 leading-relaxed whitespace-pre-wrap relative z-10">
              {course.details || course.description}
            </p>
          </div>
        </motion.div>

        {/* Right Column: Stats */}
        <motion.div
          variants={cardVariants}
          className="space-y-5"
        >
          {[
            {
              icon: LayoutList,
              iconBg: "bg-[#22C55E]/15",
              iconBorder: "border-[#22C55E]/30",
              iconColor: "text-[#22C55E]",
              label: "Content",
              value: `${course.modules.length} Modules`,
            },
            {
              icon: BookOpen,
              iconBg: "bg-[#C9A96E]/15",
              iconBorder: "border-[#C9A96E]/30",
              iconColor: "text-[#C9A96E]",
              label: "Curriculum",
              value: `${totalLessons} Lessons`,
            },
            {
              icon: Users,
              iconBg: "bg-[#1E1B2E]/10",
              iconBorder: "border-[#1E1B2E]/20",
              iconColor: "text-[#1E1B2E]",
              label: "Students",
              value: `${course._count.enrollments} Enrolled`,
            },
            {
              icon: Trophy,
              iconBg: "bg-[#C9A96E]/15",
              iconBorder: "border-[#C9A96E]/30",
              iconColor: "text-[#C9A96E]",
              label: "Rewards",
              value: "+50 Points",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(30,27,46,0.04)] p-5 flex items-center gap-4 transition-shadow hover:shadow-[0_8px_24px_rgba(30,27,46,0.08)]"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center shrink-0`}
                >
                  <Icon size={22} className={stat.iconColor} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-lg font-extrabold text-[#1E1B2E]">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
