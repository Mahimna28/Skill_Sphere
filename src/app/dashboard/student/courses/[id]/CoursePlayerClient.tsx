"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  BookText,
  ArrowLeft,
  Trophy,
  Download,
  File,
  Award,
  X,
  Upload,
  FileText,
  Sparkles,
  Eye,
  ExternalLink,
} from "lucide-react";

const easing = [0.25, 0.1, 0.25, 1.0] as const;

export default function CoursePlayerClient({ 
  course, 
  earnedCertificate, 
  completedLessonIds 
}: { 
  course: any; 
  earnedCertificate?: any; 
  completedLessonIds?: string[]; 
}) {
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const [activeLesson, setActiveLesson] = useState(allLessons[0] || null);
  const [loading, setLoading] = useState(false);
  const [completedCertId, setCompletedCertId] = useState<string | null>(null);
  const [showCertPreview, setShowCertPreview] = useState(false);
  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>(completedLessonIds || []);
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Assignment submission modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitToast, setSubmitToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setSubmitToast({ message, type });
    setTimeout(() => setSubmitToast(null), 3500);
  };

  const handleComplete = async () => {
    if (!activeLesson) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${activeLesson.id}/complete`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setLocalCompletedIds(prev => [...prev, activeLesson.id]);
        if (data.courseCompleted && data.certificateId) {
          setCompletedCertId(data.certificateId);
          setShowCertPreview(true);
          return;
        }
      }

      const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson.id);
      if (currentIndex < allLessons.length - 1) {
        setActiveLesson(allLessons[currentIndex + 1]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1]);
    }
  };

  const openSubmitModal = (assignment: any) => {
    setActiveAssignment(assignment);
    setSubmissionText("");
    setSubmissionFile(null);
    setShowSubmitModal(true);
  };

  const handleSubmitAssignment = async () => {
    if (!activeAssignment) return;
    if (!submissionText.trim() && !submissionFile) {
      showToast("Please add text or upload a file.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", activeAssignment.id);
      formData.append("text", submissionText);
      if (submissionFile) {
        formData.append("file", submissionFile);
      }
      const res = await fetch(`/api/assignments/${activeAssignment.id}/submit`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("🎉 Assignment submitted successfully!", "success");
        setShowSubmitModal(false);
      } else {
        const data = await res.json();
        showToast(data.message || "Submission failed. Please try again.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: easing },
    },
  };

  if (!activeLesson) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center justify-center h-[60vh] text-center font-sans"
      >
        <div className="w-20 h-20 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center mb-6">
          <BookText size={40} className="text-[#C9A96E]" />
        </div>
        <h2
          className="text-3xl font-extrabold text-[#1E1B2E]"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          No content available yet.
        </h2>
        <p className="text-[#8E8E93] font-medium mt-2 text-sm">
          The teacher is still preparing this course.
        </p>
        <Link href="/dashboard/student/courses">
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="mt-6 h-11 px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.3)]"
          >
            Go Back
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id);
  const isLastLesson = currentIndex === allLessons.length - 1;

  // Certificate completion view with inline preview modal
  if (completedCertId && !showCertPreview) {
    return (
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: easing }}
        className="flex flex-col items-center justify-center h-[calc(100vh-160px)] text-center font-sans"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-6, 6, -6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#C9A96E] to-[#E5C992] text-[#1E1B2E] flex items-center justify-center mb-8 shadow-[0_12px_40px_rgba(201,169,110,0.4)]"
        >
          <Award size={56} />
        </motion.div>
        <h2
          className="text-4xl md:text-5xl font-extrabold text-[#1E1B2E] tracking-tight mb-3"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          Course Finished!
        </h2>
        <p className="text-base font-medium text-[#8E8E93] mb-8 max-w-lg">
          Congratulations! You have successfully completed all modules and earned a new certificate.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/student/courses">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="h-12 px-6 rounded-xl bg-white/80 backdrop-blur-md border border-[#1E1B2E]/15 text-[#1E1B2E] font-bold text-sm cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              Back to Dashboard
            </motion.button>
          </Link>
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={() => setShowCertPreview(true)}
            className="h-12 px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.3)] flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Preview Certificate
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-160px)] font-sans relative"
    >
      {/* Toast */}
      <AnimatePresence>
        {submitToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl font-bold text-sm flex items-center gap-3 ${
              submitToast.type === "success"
                ? "bg-[#22C55E]/90 text-white border-white/20"
                : "bg-[#DC2626]/90 text-white border-white/20"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{submitToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {showCertPreview && completedCertId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowCertPreview(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_24px_80px_rgba(30,27,46,0.15)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#1E1B2E]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
                      Certificate Preview
                    </h3>
                    <p className="text-xs text-[#8E8E93] font-medium">Your achievement is ready</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCertPreview(false)}
                  className="p-2 rounded-xl hover:bg-[#1E1B2E]/5 text-[#8E8E93] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Certificate Preview Content */}
              <div className="p-8">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#F5F1EB] to-white border border-[#C9A96E]/30 p-10 text-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-48 h-48 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#1E1B2E]/5 rounded-full blur-3xl pointer-events-none" />

                  <motion.div
                    animate={shouldReduceMotion ? {} : { rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#C9A96E] to-[#E5C992] flex items-center justify-center shadow-lg"
                  >
                    <Trophy className="w-8 h-8 text-[#1E1B2E]" />
                  </motion.div>
                  <p className="text-xs font-bold text-[#C9A96E] uppercase tracking-[0.2em] mb-2">
                    Certificate of Completion
                  </p>
                  <h4
                    className="text-2xl font-extrabold text-[#1E1B2E] mb-2"
                    style={{ fontFamily: "var(--font-heading, serif)" }}
                  >
                    {course.title}
                  </h4>
                  <p className="text-sm text-[#8E8E93] font-medium">
                    Awarded on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <div className="w-20 h-0.5 bg-[#C9A96E] mx-auto mt-4 mb-3 rounded-full" />
                  <p className="text-xs text-[#8E8E93] font-medium">
                    {course.modules?.length || 0} Modules · {allLessons.length} Lessons Completed
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex justify-end gap-3">
                <button
                  onClick={() => setShowCertPreview(false)}
                  className="h-11 px-5 rounded-xl bg-[#F5F1EB] text-[#1E1B2E] font-bold text-sm cursor-pointer hover:bg-[#EDE8E0] transition-colors"
                >
                  Close
                </button>
                <Link href={`/certificates/${completedCertId}`} target="_blank">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="h-11 px-6 rounded-xl bg-[#C9A96E] text-[#1E1B2E] font-bold text-sm cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.3)] flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Full Certificate
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment Submission Modal */}
      <AnimatePresence>
        {showSubmitModal && activeAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_24px_80px_rgba(30,27,46,0.15)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#1E1B2E]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1E1B2E]" style={{ fontFamily: "var(--font-heading, serif)" }}>
                      Submit Assignment
                    </h3>
                    <p className="text-xs text-[#8E8E93] font-medium truncate max-w-[240px]">
                      {activeAssignment.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-2 rounded-xl hover:bg-[#1E1B2E]/5 text-[#8E8E93] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Text submission */}
                <div>
                  <label className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider mb-2 block">
                    Your Answer / Notes
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Write your response here..."
                    rows={5}
                    className="w-full rounded-xl border border-[#1E1B2E]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 focus:border-[#C9A96E] resize-none transition-all"
                  />
                </div>

                {/* File upload */}
                <div>
                  <label className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider mb-2 block">
                    Attach File (Optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.png"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 rounded-xl border-2 border-dashed border-[#1E1B2E]/15 hover:border-[#C9A96E]/50 bg-[#F5F1EB]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {submissionFile ? (
                      <>
                        <File className="w-5 h-5 text-[#C9A96E]" />
                        <span className="text-xs font-bold text-[#1E1B2E] truncate max-w-[280px]">
                          {submissionFile.name}
                        </span>
                        <span className="text-[10px] text-[#8E8E93]">Click to change file</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#8E8E93]" />
                        <span className="text-xs font-medium text-[#8E8E93]">
                          Click to upload (PDF, DOC, ZIP, images)
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 pt-0 flex justify-end gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="h-11 px-5 rounded-xl bg-[#F5F1EB] text-[#1E1B2E] font-bold text-sm cursor-pointer hover:bg-[#EDE8E0] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  onClick={handleSubmitAssignment}
                  disabled={submitting}
                  className="h-11 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-[#1E1B2E] border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Submit Work
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#1E1B2E]/10 pb-12">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/dashboard/student/courses"
            className="flex items-center gap-2 text-sm font-bold text-[#8E8E93] hover:text-[#C9A96E] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-xs font-bold text-[#1E1B2E]">
            <Trophy size={14} className="text-[#C9A96E]" /> +50 POINTS EARNED
          </div>
        </div>

        <h2
          className="text-3xl md:text-4xl font-extrabold text-[#1E1B2E] tracking-tight"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          {activeLesson.title}
        </h2>

        {/* Video Player or Notes Only View */}
        {activeLesson.videoUrl ? (
          <div className="aspect-video w-full bg-[#1E1B2E] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(30,27,46,0.12)] border border-white/10 relative group">
            <iframe
              src={activeLesson.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="aspect-[21/9] w-full bg-white/70 backdrop-blur-xl border border-[#1E1B2E]/10 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center mb-4">
              <BookText size={32} className="text-[#C9A96E]" />
            </div>
            <p
              className="text-lg font-extrabold text-[#1E1B2E]"
              style={{ fontFamily: "var(--font-heading, serif)" }}
            >
              Lecture Notes Only
            </p>
            <p className="text-sm font-medium text-[#8E8E93] mt-1">
              This lesson is reading-based. No video content available.
            </p>
          </div>
        )}

        {/* Lesson Overview Card */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] p-8 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/8 rounded-full blur-3xl pointer-events-none" />

          <h3
            className="text-xl font-extrabold text-[#1E1B2E] relative z-10"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            Lesson Overview
          </h3>
          <div className="w-12 h-1 rounded-full bg-[#C9A96E]" />
          <p className="text-base font-medium text-[#1E1B2E]/70 leading-relaxed relative z-10">
            {activeLesson.content ||
              "This lesson contains essential information to build your foundation in this subject."}
          </p>

          {activeLesson.fileUrl && (
            <div className="mt-8 p-6 bg-[#C9A96E]/10 border border-[#C9A96E]/25 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 bg-white/80 border border-[#C9A96E]/30 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <File size={28} className="text-[#C9A96E]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1E1B2E] uppercase tracking-wider">
                    Academic Materials Attached
                  </h4>
                  <p className="text-xs font-bold text-[#8E8E93] uppercase">
                    {activeLesson.fileType || "Document"} FILE READY
                  </p>
                </div>
              </div>
              <a href={activeLesson.fileUrl} download className="w-full md:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="w-full h-12 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.3)] transition-all"
                >
                  <Download size={18} /> Download Materials
                </motion.button>
              </a>
            </div>
          )}

          <div className="pt-6 flex justify-between items-center border-t border-[#1E1B2E]/10 relative z-10 flex-wrap gap-4">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="h-11 px-5 rounded-xl bg-white/80 border border-[#1E1B2E]/15 text-[#1E1B2E] font-bold text-sm cursor-pointer hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={allLessons.findIndex((l: any) => l.id === activeLesson?.id) === 0}
              onClick={handlePrevious}
            >
              Previous Lesson
            </motion.button>

            {earnedCertificate ? (
              <div className="flex items-center gap-3">
                <div className="px-4 h-11 rounded-xl bg-[#22C55E]/10 text-[#22C55E] font-bold text-sm flex items-center gap-2 border border-[#22C55E]/20">
                  <CheckCircle2 size={16} /> Completed
                </div>
                <Link href={`/certificates/${earnedCertificate.id}`} target="_blank">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="h-11 px-5 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm shadow-[0_4px_14px_rgba(201,169,110,0.3)] flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download size={16} /> Download Certificate
                  </motion.button>
                </Link>
              </div>
            ) : localCompletedIds.includes(activeLesson.id) ? (
              <div className="flex items-center gap-3">
                <div className="px-4 h-11 rounded-xl bg-[#22C55E]/10 text-[#22C55E] font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /> Lesson Completed
                </div>
                {!isLastLesson && (
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="h-11 px-6 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-sm cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.3)] flex items-center gap-2 transition-all"
                    onClick={() => {
                      const nextIndex = allLessons.findIndex((l: any) => l.id === activeLesson.id) + 1;
                      if (nextIndex < allLessons.length) setActiveLesson(allLessons[nextIndex]);
                    }}
                  >
                    Next Lesson <ChevronRight size={16} />
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="h-11 px-6 rounded-xl bg-[#22C55E] hover:bg-[#1DB954] text-white font-bold text-sm cursor-pointer shadow-[0_4px_14px_rgba(34,197,94,0.3)] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleComplete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Completing...
                  </>
                ) : (
                  <>{isLastLesson ? "Finish Course" : "Complete & Next"}</>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Assignments Section */}
        {course.assignments && course.assignments.length > 0 && (
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/8 rounded-full blur-3xl pointer-events-none" />

            <h3
              className="text-xl font-extrabold text-[#1E1B2E] relative z-10"
              style={{ fontFamily: "var(--font-heading, serif)" }}
            >
              Course Assignments
            </h3>
            <div className="w-12 h-1 rounded-full bg-[#C9A96E]" />

            <div className="space-y-4 relative z-10">
              {course.assignments.map((assignment: any) => {
                const submission = assignment.submissions?.[0] ?? null;
                const isDeadlinePassed = new Date() > new Date(assignment.dueDate);
                return (
                  <div
                    key={assignment.id}
                    className="rounded-xl bg-white/80 border border-[#1E1B2E]/10 p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-extrabold text-[#1E1B2E]">
                        {assignment.title}
                      </h4>
                      <p className="text-xs font-bold text-red-500 mb-1.5 flex items-center gap-1">
                        Due: {new Date(assignment.dueDate).toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-[#8E8E93]">
                        {assignment.description}
                      </p>
                      {/* Show grade & feedback if graded */}
                      {submission?.grade != null && (
                        <div className="mt-3 p-3 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] rounded-xl">
                          <p className="text-xs font-bold text-[#C9A96E] mb-1">Grade: {submission.grade} / 100</p>
                          {submission.feedback && <p className="text-xs text-[#8E8E93]">{submission.feedback}</p>}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {submission ? (
                        <span className="px-4 py-2.5 rounded-xl bg-[rgba(34,197,94,0.1)] text-[#16a34a] font-bold text-xs whitespace-nowrap flex items-center gap-2 border border-[rgba(34,197,94,0.2)]">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          Submitted
                        </span>
                      ) : isDeadlinePassed ? (
                        <span className="px-4 py-2.5 rounded-xl bg-[#F5F1EB] text-[#8E8E93] font-bold text-xs whitespace-nowrap opacity-60">
                          Deadline Passed
                        </span>
                      ) : (
                        <motion.button
                          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                          onClick={() => openSubmitModal(assignment)}
                          className="h-10 px-5 rounded-xl bg-[#C9A96E] hover:bg-[#D6B87D] text-[#1E1B2E] font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer shadow-[0_4px_14px_rgba(201,169,110,0.25)] transition-all flex items-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5" /> Submit Work
                        </motion.button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Sidebar — Course Content */}
      <aside className="w-full lg:w-80 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(30,27,46,0.05)] flex flex-col overflow-hidden shrink-0 lg:max-h-full">
        <div className="p-6 border-b border-[#1E1B2E]/10 bg-gradient-to-r from-[#1E1B2E] to-[#2D2844]">
          <h3
            className="text-lg font-extrabold text-white leading-tight line-clamp-1"
            style={{ fontFamily: "var(--font-heading, serif)" }}
          >
            {course.title}
          </h3>
          <p className="text-xs font-bold text-[#C9A96E] mt-1 uppercase tracking-widest">
            {course.subject}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#1E1B2E]/10">
          {course.modules.map((module: any) => (
            <div key={module.id} className="space-y-2.5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#8E8E93] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full" /> {module.title}
              </h4>
              <div className="space-y-1">
                {module.lessons.map((lesson: any) => {
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#C9A96E]/15 border border-[#C9A96E]/40 shadow-sm"
                          : "border border-transparent hover:bg-[#F5F1EB]/50"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                          isActive
                            ? "bg-[#C9A96E]/20 border-[#C9A96E]/40 text-[#C9A96E]"
                            : "bg-[#F5F1EB] border-[#1E1B2E]/10 text-[#8E8E93]"
                        }`}
                      >
                        {lesson.videoUrl ? <PlayCircle size={16} /> : <BookText size={16} />}
                      </div>
                      <span
                        className={`text-sm font-bold line-clamp-1 ${
                          isActive ? "text-[#1E1B2E]" : "text-[#8E8E93]"
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {isActive && <ChevronRight size={14} className="ml-auto text-[#C9A96E]" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </motion.div>
  );
}
