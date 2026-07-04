"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { School, CheckCircle2, Lock, BookOpen, Users, Building2, Sparkles, Clock, Check } from "lucide-react";

// Global motion easing
const easing = [0.25, 0.1, 0.25, 1.0] as const;

interface PrivateClass {
  id: string;
  title: string;
  subject: string;
  thumbnail: string | null;
  isPublic: boolean;
  teacher: { name: string };
  _count: { enrollments: number };
}

interface InstitutionData {
  id: string;
  name: string;
  _count: { members: number; departments: number };
}

interface Props {
  userInstitutionId: string | null | undefined;
  institutionName: string | null | undefined;
  privateClasses: PrivateClass[];
  allInstitutions?: InstitutionData[];
  pendingIds?: string[];
}

export default function JoinInstitutionClient({
  userInstitutionId,
  institutionName,
  privateClasses,
  allInstitutions = [],
  pendingIds = [],
}: Props) {
  const [pendingSet, setPendingSet] = useState<Set<string>>(new Set(pendingIds));
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const handleEnrollRequest = async (institutionId: string) => {
    if (loadingId || pendingSet.has(institutionId) || userInstitutionId === institutionId) return;

    setLoadingId(institutionId);
    try {
      const res = await fetch("/api/institutions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionId }),
      });

      if (res.ok) {
        setPendingSet((prev) => new Set([...prev, institutionId]));
      } else {
        const data = await res.json();
        alert(data?.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Error joining institution:", error);
      alert("Network error while submitting request.");
    } finally {
      setLoadingId(null);
    }
  };

  // Page container animation: fadeInUp + scale from 0.95 -> 1, 0.4s
  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: easing },
    },
  };

  // Grid container stagger
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  // Card slide in from bottom
  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
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
      className="space-y-8 max-w-7xl mx-auto font-sans pb-12"
    >
      {/* Sleek Page Header */}
      <div className="border-b border-[#1E1B2E]/10 pb-5 shrink-0">
        <h1
          className="text-[28px] sm:text-3xl font-bold text-[#1E1B2E] leading-tight tracking-tight flex items-center gap-3"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          <span>Institutions</span>
        </h1>
        <p className="text-[#8E8E93] text-sm font-medium mt-1">
          Explore and connect with institutions
        </p>
      </div>

      {/* Active Affiliation Banner (Frosted Glass Card with Gold Glow Pulse if Enrolled) */}
      {userInstitutionId ? (
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
          className="relative p-6 sm:p-8 rounded-2xl bg-white/70 backdrop-blur-xl border-2 border-[#C9A96E] shadow-[0_12px_40px_rgba(30,27,46,0.06)] overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Pulsing Gold Glow Border Effect */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-[#C9A96E]/50"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E1B2E] to-[#2D2844] text-[#C9A96E] flex items-center justify-center shrink-0 shadow-md ring-2 ring-[#C9A96E]/30">
              <School className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#1E1B2E] text-xs font-bold mb-1">
                <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                Primary Affiliation
              </span>
              <h2
                className="text-2xl font-bold text-[#1E1B2E]"
                style={{ fontFamily: "var(--font-heading, serif)" }}
              >
                {institutionName || "Enrolled Institution"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-sm font-bold relative z-10">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Active Student Member</span>
          </div>
        </motion.div>
      ) : (
        <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(30,27,46,0.06)] text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[#1E1B2E]/5 border border-[#1E1B2E]/10 flex items-center justify-center mx-auto mb-3 text-[#8E8E93]">
            <School className="w-7 h-7" />
          </div>
          <h3
            className="text-lg font-bold text-[#1E1B2E] mb-1"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            No Active Affiliation Yet
          </h3>
          <p className="text-xs text-[#8E8E93] max-w-md mx-auto font-medium">
            Browse the institutions directory below to submit a membership request or ask your course instructor for an access invite.
          </p>
        </div>
      )}

      {/* Available Institutions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold text-[#1E1B2E] flex items-center gap-2"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            <Building2 className="w-5 h-5 text-[#C9A96E]" />
            <span>Directory of Institutions</span>
          </h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1E1B2E]/5 text-[#8E8E93]">
            {allInstitutions.length} Available
          </span>
        </div>

        {allInstitutions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 text-[#8E8E93]">
            <p className="font-bold text-sm">No public institutions found at this time.</p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allInstitutions.map((inst) => {
              const isEnrolled = userInstitutionId === inst.id;
              const isPending = pendingSet.has(inst.id);
              const isLoading = loadingId === inst.id;

              const initials = inst.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <motion.div
                  key={inst.id}
                  variants={cardVariants}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: 1.02,
                          transition: { duration: 0.25, ease: easing },
                        }
                  }
                  className={`relative rounded-2xl bg-white/70 backdrop-blur-xl p-6 flex flex-col items-center justify-between overflow-hidden transition-shadow duration-300 shadow-[0_8px_30px_rgba(30,27,46,0.05)] hover:shadow-[0_12px_32px_rgba(30,27,46,0.1)] ${
                    isEnrolled
                      ? "border-2 border-[#C9A96E] ring-4 ring-[#C9A96E]/10"
                      : "border border-white/80"
                  }`}
                >
                  {/* Liquid Ripple Shimmer Sweep on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full pointer-events-none"
                    whileHover={{ translateX: "100%" }}
                    transition={{ duration: 0.85, ease: "easeInOut" }}
                  />

                  <div className="w-full flex flex-col items-center text-center relative z-10 mb-6">
                    {/* 64px Circle / Rounded-square Logo centered at top */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg mb-4 shadow-md ring-4 ring-white/80 ${
                        isEnrolled
                          ? "bg-gradient-to-tr from-[#1E1B2E] to-[#2D2844] text-[#C9A96E]"
                          : "bg-[#1E1B2E]/10 text-[#1E1B2E]"
                      }`}
                    >
                      {initials}
                    </div>

                    {/* Institution Name (Inter 16px bold, navy text) */}
                    <h3 className="text-base font-bold text-[#1E1B2E] line-clamp-1 mb-1.5 w-full">
                      {inst.name}
                    </h3>

                    {/* Description (Inter 14px, soft gray text, max 3 lines) */}
                    <p className="text-sm text-[#8E8E93] line-clamp-3 font-medium leading-relaxed">
                      Leading center for higher learning and practical skill development. Supporting{" "}
                      <span className="font-semibold text-[#1E1B2E]">{inst._count.members}</span>{" "}
                      active learners and professionals.
                    </p>
                  </div>

                  {/* Footer Metrics & Enrollment Button */}
                  <div className="w-full pt-4 border-t border-[#1E1B2E]/10 flex flex-col gap-3 relative z-10">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#8E8E93] px-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
                        {inst._count.members} Students
                      </span>
                      <span>{inst._count.departments} Departments</span>
                    </div>

                    {/* Enrollment Button */}
                    {isEnrolled ? (
                      <div className="w-full h-11 rounded-xl bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#1E1B2E] font-bold text-sm flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-[#C9A96E]" />
                        <span>Active Enrolled</span>
                      </div>
                    ) : isPending ? (
                      <div className="w-full h-11 rounded-xl bg-[#1E1B2E]/10 text-[#8E8E93] font-bold text-sm flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 animate-spin text-[#8E8E93]" />
                        <span>Request Pending</span>
                      </div>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={() => handleEnrollRequest(inst.id)}
                        disabled={isLoading}
                        whileHover={shouldReduceMotion || isLoading ? {} : { scale: 1.03 }}
                        whileTap={shouldReduceMotion || isLoading ? {} : { scale: 0.97 }}
                        className="w-full h-11 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_18px_rgba(201,169,110,0.6)] transition-all cursor-pointer"
                      >
                        {isLoading ? (
                          <span className="animate-pulse">Submitting…</span>
                        ) : (
                          <>
                            <span>Request Enrollment</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Private Classes Section */}
      {privateClasses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#1E1B2E]/10">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold text-[#1E1B2E] flex items-center gap-2"
              style={{ fontFamily: "var(--font-heading, serif)" }}
            >
              <Lock className="w-5 h-5 text-[#C9A96E]" />
              <span>Assigned Private Classes</span>
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1E1B2E]/5 text-[#8E8E93]">
              {privateClasses.length} Assigned
            </span>
          </div>

          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {privateClasses.map((cls) => (
              <motion.div
                key={cls.id}
                variants={cardVariants}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 p-5 shadow-[0_8px_30px_rgba(30,27,46,0.05)] hover:shadow-[0_12px_32px_rgba(30,27,46,0.1)] flex flex-col justify-between transition-shadow relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full pointer-events-none"
                  whileHover={{ translateX: "100%" }}
                  transition={{ duration: 0.85, ease: "easeInOut" }}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#1E1B2E] text-[10px] font-bold uppercase tracking-wider">
                      {cls.subject}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#8E8E93]">
                      <Lock className="w-3 h-3" /> Private
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1E1B2E] group-hover:text-[#C9A96E] transition-colors line-clamp-2">
                    {cls.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E1B2E]/10 flex items-center justify-between text-xs text-[#8E8E93] font-medium">
                  <span>Instructor: {cls.teacher.name}</span>
                  <span>{cls._count.enrollments} Enrolled</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
