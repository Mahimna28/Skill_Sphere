"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Trophy, Crown, Flame, BarChart3 } from "lucide-react";

// Global motion easing
const easing = [0.25, 0.1, 0.25, 1.0] as const;

export interface StudentRankItem {
  id: string;
  name: string;
  image: string | null;
  points: number;
  currentStreak: number;
  institutionName: string;
  progress: number;
}

interface LeaderboardClientProps {
  students: StudentRankItem[];
  currentUserId?: string;
}

export default function LeaderboardClient({
  students,
  currentUserId,
}: LeaderboardClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Page container animation
  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: easing },
    },
  };

  // Staggered rows container (0.08s increments)
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // Individual row slide in right-to-left
  const rowVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: easing },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-7xl mx-auto pb-12 font-sans"
    >
      {/* Sleek Page Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1B2E]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#C9A96E]/30 text-[#1E1B2E] text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-[#C9A96E]" /> Global Standing
          </div>
          <h1
            className="text-[28px] sm:text-3xl font-extrabold text-[#1E1B2E] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            Leaderboard
          </h1>
          <p className="text-[#8E8E93] text-sm font-medium mt-1">
            Track your rank among peers, build study streaks, and earn distinction.
          </p>
        </div>

        {/* Top-right "View Global Stats" CTA */}
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={() => router.push("/dashboard/student/analytics")}
          aria-label="View Global Stats"
          className="h-[44px] px-6 rounded-xl bg-gradient-to-r from-[#C9A96E] via-[#E2C48D] to-[#C9A96E] bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 text-[#1E1B2E] font-bold text-sm uppercase tracking-wider shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_8px_24px_rgba(201,169,110,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start sm:self-center"
        >
          <BarChart3 className="w-4.5 h-4.5 shrink-0" />
          <span>View Global Stats</span>
        </motion.button>
      </div>

      {/* Frosted Glass Table Card (w-full overflow-hidden min-w-0, no scrollbars) */}
      <div className="relative w-full h-auto rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(30,27,46,0.06)] overflow-hidden min-w-0">
        {/* Ambient background lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E1B2E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full overflow-hidden min-w-0">
          <div role="table" aria-label="Global Leaderboard Table" className="w-full min-w-0">
            {/* Table Header Row */}
            <div role="rowgroup">
              <div
                role="row"
                className="flex items-center justify-between w-full px-6 py-4.5 font-sans text-xs uppercase font-bold tracking-wider text-[#8E8E93] border-b border-[rgba(30,27,46,0.06)]"
                style={{ backgroundColor: "rgba(245, 241, 235, 0.6)" }}
              >
                <div role="columnheader" className="w-14 text-center shrink-0">
                  Rank
                </div>
                <div role="columnheader" className="flex-1 min-w-0 pr-3">
                  Student
                </div>
                <div role="columnheader" className="w-36 md:w-44 shrink-0 hidden md:block pr-3">
                  Institution
                </div>
                <div role="columnheader" className="w-24 sm:w-28 text-right shrink-0 pr-2">
                  Score
                </div>
                <div role="columnheader" className="w-20 text-center shrink-0 hidden sm:block">
                  Streak
                </div>
                <div role="columnheader" className="w-28 sm:w-36 text-right shrink-0">
                  Progress
                </div>
              </div>
            </div>

            {/* Staggered Right-to-Left Animated Rows */}
            <motion.div
              role="rowgroup"
              initial="hidden"
              animate="visible"
              variants={tableVariants}
              className="divide-y divide-[rgba(30,27,46,0.06)] font-sans w-full min-w-0"
            >
              {students.length === 0 ? (
                <div role="row" className="px-6 py-16 text-center text-[#8E8E93] font-medium text-sm w-full">
                  No active rankings yet. Complete courses and tasks to claim the top spot!
                </div>
              ) : (
                students.map((student, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;
                  const isCurrentUser = currentUserId === student.id;

                  // Initials fallback
                  const initials = student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <motion.div
                      key={student.id}
                      role="row"
                      variants={rowVariants}
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: 1.01,
                            }
                      }
                      transition={{ duration: 0.2, ease: easing }}
                      tabIndex={0}
                      aria-label={`Rank ${rank}: ${student.name}, Score: ${student.points.toLocaleString()} points`}
                      className={`relative flex items-center justify-between w-full px-6 py-4 group hover:bg-[#F5F1EB]/35 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-pointer z-10 hover:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A96E] ${
                        isCurrentUser
                          ? "bg-[#C9A96E]/15 border-l-4 border-l-[#C9A96E] shadow-[inset_0_0_20px_rgba(201,169,110,0.15)]"
                          : ""
                      }`}
                    >
                      {/* Active student pulsing gold glow border highlight */}
                      {isCurrentUser && (
                        <motion.div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none border-2 border-[#C9A96E]/40 rounded-lg"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}

                      {/* Rank Field */}
                      <div role="cell" className="w-14 flex justify-center shrink-0">
                        {isTop3 ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9A96E] to-[#E6CD98] text-[#1E1B2E] font-extrabold text-xs flex items-center justify-center shadow-md ring-2 ring-white/60">
                            {rank === 1 ? <Crown className="w-4 h-4 fill-current" /> : rank}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#1E1B2E]/10 text-[#1E1B2E] font-bold text-xs flex items-center justify-center">
                            {rank}
                          </div>
                        )}
                      </div>

                      {/* Avatar + Name Field */}
                      <div role="cell" className="flex-1 min-w-0 flex items-center gap-3.5 pr-3">
                        {student.image ? (
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/60 shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E1B2E] to-[#2D2844] text-[#C9A96E] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1E1B2E] text-sm truncate group-hover:text-[#C9A96E] transition-colors">
                              {student.name}
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-md bg-[#C9A96E] text-[#1E1B2E] text-[10px] font-black uppercase tracking-wider shadow-xs shrink-0">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Institution Field */}
                      <div role="cell" className="w-36 md:w-44 shrink-0 text-sm font-medium text-[#8E8E93] truncate hidden md:block pr-3">
                        {student.institutionName || "Global Academy"}
                      </div>

                      {/* Score Field */}
                      <div role="cell" className="w-24 sm:w-28 shrink-0 text-right pr-2">
                        <span className="font-extrabold text-sm text-[#1E1B2E]">
                          {student.points.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#8E8E93] font-semibold ml-1">pts</span>
                      </div>

                      {/* Streak Field */}
                      <div role="cell" className="w-20 shrink-0 hidden sm:flex justify-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 font-bold text-xs border border-orange-500/20">
                          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                          <span>{student.currentStreak}d</span>
                        </div>
                      </div>

                      {/* Mastery Progress Field */}
                      <div role="cell" className="w-28 sm:w-36 shrink-0 flex flex-col items-end">
                        <div className="space-y-1.5 w-full max-w-[128px]">
                          <div className="flex justify-between text-[11px] font-bold text-[#1E1B2E]">
                            <span className="text-[#8E8E93]">Mastery</span>
                            <span>{student.progress}%</span>
                          </div>
                          <div
                            className="relative h-2 w-full bg-[#F5F1EB] rounded-full overflow-hidden border border-[#1E1B2E]/5 shadow-inner"
                            role="progressbar"
                            aria-valuenow={student.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${student.name}'s course progress: ${student.progress}%`}
                          >
                            <motion.div
                              initial={shouldReduceMotion ? { width: `${student.progress}%` } : { width: 0 }}
                              animate={{ width: `${student.progress}%` }}
                              transition={{ duration: 0.8, ease: easing, delay: 0.2 }}
                              className="relative h-full bg-gradient-to-r from-[#C9A96E] to-[#E5C992] rounded-full"
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
