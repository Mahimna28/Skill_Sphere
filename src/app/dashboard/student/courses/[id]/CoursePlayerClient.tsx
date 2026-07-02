"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, ChevronRight, PlayCircle, BookText, ArrowLeft, Trophy, 
  Download, File, Award, ThumbsUp, MessageCircle, Bookmark, Check, Play, Lock, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/animations";

export default function CoursePlayerClient({ course }: { course: any }) {
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const [activeLesson, setActiveLesson] = useState(allLessons[0] || null);
  const [loading, setLoading] = useState(false);
  const [completedCertId, setCompletedCertId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleComplete = async () => {
    if (!activeLesson) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${activeLesson.id}/complete`, { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        if (data.courseCompleted && data.certificateId) {
          setCompletedCertId(data.certificateId);
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

  if (!activeLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-[60px]">
        <div className="mb-[24px]">
          <BookText size={56} className="text-[#1E1B2E] opacity-25" />
        </div>
        <h2 className="font-heading text-[24px] text-[#1E1B2E]">
          No content available yet.
        </h2>
        <p className="font-sans text-[14px] text-[#8E8E93] mt-[8px]">
          The teacher is still preparing this course.
        </p>
        <div>
          <Link href="/dashboard/student/courses" className="inline-block mt-[28px]">
            <button className="h-[44px] px-[24px] rounded-xl border border-[#1E1B2E] text-[#1E1B2E] font-sans text-[14px] font-medium hover:bg-[#1E1B2E] hover:text-white transition-colors duration-200">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id);
  const isLastLesson = currentIndex === allLessons.length - 1;

  if (completedCertId) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-32 h-32 bg-[rgba(201,169,110,0.15)] rounded-full flex items-center justify-center mb-8"
        >
          <Award size={64} className="text-[#C9A96E]" />
        </motion.div>
        <h2 className="font-heading text-5xl text-[#1E1B2E] mb-4">Course Finished!</h2>
        <p className="text-[#8E8E93] mb-8 max-w-xl text-lg">
          Congratulations! You have successfully completed all modules in this course and earned a new certificate.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/student/courses">
            <button className="h-12 px-8 rounded-xl border border-[rgba(30,27,46,0.1)] text-[#1E1B2E] font-medium hover:bg-[rgba(30,27,46,0.03)] transition-colors">
              Back to Dashboard
            </button>
          </Link>
          <Link href={`/certificates/${completedCertId}`} target="_blank">
            <button className="h-12 px-8 rounded-xl bg-[#1E1B2E] text-white font-medium hover:bg-[#2d2a3d] transition-colors">
              View Certificate
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Active module based on active lesson
  const activeModule = course.modules.find((m: any) => 
    m.lessons.some((l: any) => l.id === activeLesson.id)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-6 py-6 pb-20">
      {/* 1. Main Content Area - 65% */}
      <div className="flex-1 min-w-0">
        
        {/* Breadcrumb */}
        <motion.div 
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[#8E8E93] mb-3"
        >
          <Link href="/dashboard/student/courses" className="hover:text-[#1E1B2E] transition-colors">
            My Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1E1B2E] truncate">{course.title}</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-3xl text-[#1E1B2E] mb-1"
        >
          {activeLesson.title}
        </motion.h1>

        <motion.p 
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#8E8E93] text-sm mb-6"
        >
          {activeModule?.title}
        </motion.p>

        {/* Video Player or Notes Only View */}
        {activeLesson.videoUrl ? (
          <motion.div 
            key={activeLesson.id}
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-black"
          >
            <div className="aspect-video">
              <iframe
                src={activeLesson.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title="Course Video"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={activeLesson.id}
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="aspect-[21/9] w-full bg-[rgba(201,169,110,0.04)] border border-[rgba(201,169,110,0.2)] rounded-2xl flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-16 h-16 rounded-full bg-white border border-[rgba(30,27,46,0.06)] shadow-sm flex items-center justify-center mb-4">
              <BookText size={24} className="text-[#C9A96E]" />
            </div>
            <h3 className="font-heading text-xl text-[#1E1B2E]">Lecture Notes Only</h3>
            <p className="text-sm text-[#8E8E93] mt-1 max-w-md">This lesson is reading-based. No video content available.</p>
          </motion.div>
        )}

        {/* Video Controls / Meta Bar */}
        <motion.div 
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-5 px-1"
        >
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-[#8E8E93] hover:text-[#1E1B2E] transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Helpful
            </button>
            <button className="flex items-center gap-2 text-sm text-[#8E8E93] hover:text-[#1E1B2E] transition-colors">
              <MessageCircle className="w-4 h-4" />
              Discuss
            </button>
            <button className="flex items-center gap-2 text-sm text-[#8E8E93] hover:text-[#1E1B2E] transition-colors">
              <Bookmark className="w-4 h-4" />
              Save
            </button>
          </div>
        </motion.div>

        {/* Lesson Description / Notes */}
        <motion.div 
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[rgba(30,27,46,0.04)]"
        >
          <h3 className="font-heading text-xl text-[#1E1B2E] mb-4">About this lesson</h3>
          <p className="text-[#8E8E93] text-sm md:text-base leading-relaxed">
            {activeLesson.content || "This lesson contains essential information to build your foundation in this subject. Pay close attention to the concepts discussed, as they will be critical for upcoming modules and assignments."}
          </p>
          
          {/* Key Takeaways */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[rgba(201,169,110,0.12)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#C9A96E]" />
              </div>
              <span className="text-sm text-[#1E1B2E]">Understand the core principles presented in this lecture</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[rgba(201,169,110,0.12)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#C9A96E]" />
              </div>
              <span className="text-sm text-[#1E1B2E]">Apply the knowledge to upcoming assignments and quizzes</span>
            </div>
          </div>

          {/* Attached Files */}
          {activeLesson.fileUrl && (
            <div className="mt-8 p-5 bg-[#F5F1EB] border border-[rgba(30,27,46,0.06)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                     <File size={24} className="text-[#C9A96E]" />
                  </div>
                  <div>
                     <h4 className="font-medium text-[#1E1B2E] text-sm">Academic Materials Attached</h4>
                     <p className="text-xs text-[#8E8E93]">{activeLesson.fileType || "Document"} File Ready</p>
                  </div>
               </div>
               <a href={activeLesson.fileUrl} download className="w-full sm:w-auto">
                 <button className="w-full h-10 px-5 rounded-xl bg-white border border-[rgba(30,27,46,0.1)] text-[#1E1B2E] text-sm font-medium hover:bg-[rgba(30,27,46,0.03)] transition-colors flex items-center justify-center gap-2">
                   <Download size={16} /> Download
                 </button>
               </a>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div 
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4"
        >
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(30,27,46,0.1)] text-sm text-[#1E1B2E] hover:bg-[rgba(30,27,46,0.03)] transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button 
            onClick={handleComplete}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E1B2E] text-white text-sm hover:bg-[#2d2a3d] transition-colors disabled:opacity-70 shadow-[0_4px_14px_rgba(30,27,46,0.1)]"
          >
            {loading ? "Saving..." : (isLastLesson ? "Finish Course" : "Mark Complete & Next")}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </motion.div>
        
        {/* Assignments Section (if any) */}
        {course.assignments && course.assignments.length > 0 && (
          <motion.div 
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h3 className="font-heading text-xl text-[#1E1B2E] mb-4">Course Assignments</h3>
            <div className="space-y-4">
              {course.assignments.map((assignment: any) => (
                <div key={assignment.id} className="bg-white border border-[rgba(30,27,46,0.06)] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                  <div>
                    <h4 className="text-base font-medium text-[#1E1B2E]">{assignment.title}</h4>
                    <p className="text-sm text-[#8E8E93] mt-1">{assignment.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md inline-flex">
                      Due: {new Date(assignment.dueDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  {new Date() > new Date(assignment.dueDate) ? (
                    <button disabled className="h-10 px-5 rounded-xl border border-[rgba(30,27,46,0.1)] bg-[rgba(30,27,46,0.04)] text-[#8E8E93] text-sm font-medium shrink-0">
                      Deadline Passed
                    </button>
                  ) : (
                    <button className="h-10 px-5 rounded-xl border border-[rgba(30,27,46,0.1)] text-[#1E1B2E] text-sm font-medium hover:bg-[rgba(30,27,46,0.03)] transition-colors shrink-0">
                      Submit Work
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
      </div>

      {/* 2. Sidebar - 35% */}
      <div className="w-full lg:w-80 flex-shrink-0">
        
        {/* Course Card */}
        <motion.div 
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[rgba(30,27,46,0.04)] sticky top-6"
        >
          {/* Course Header Image */}
          <div className="h-32 bg-gradient-to-br from-[#1E1B2E] to-[#2d2a3d] relative p-5 flex flex-col justify-end">
            <span className="text-[#C9A96E] text-[11px] font-semibold uppercase tracking-wider mb-1">
              {course.subject}
            </span>
            <h2 className="font-heading text-xl text-white truncate">{course.title}</h2>
          </div>
          
          {/* Progress */}
          <div className="p-5 border-b border-[rgba(30,27,46,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#8E8E93]">Course Progress</span>
              <span className="text-sm font-medium text-[#1E1B2E]">35%</span>
            </div>
            <div className="h-2 bg-[#F5F1EB] rounded-full overflow-hidden">
              <motion.div 
                initial={shouldReduceMotion ? {} : { width: 0 }}
                animate={{ width: "35%" }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="h-full bg-[#C9A96E] rounded-full"
              />
            </div>
            
            {/* Points Badge */}
            <motion.div 
              initial={shouldReduceMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)]"
            >
              <Trophy className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="text-xs font-medium text-[#1E1B2E]">+50 Points Earned</span>
            </motion.div>
          </div>

          {/* Module List */}
          <div className="p-2 space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-none">
            {course.modules.map((module: any) => (
              <div key={module.id} className="mb-4 last:mb-0">
                {/* Module Header */}
                <div className="px-3 py-2">
                  <h4 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                    {module.title}
                  </h4>
                </div>
                
                {/* Lesson Items */}
                <div className="space-y-1">
                  {module.lessons.map((lesson: any, i: number) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const isCompleted = false; // Add actual completion logic if available in data model
                    
                    return (
                      <motion.div
                        key={lesson.id}
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        onClick={() => setActiveLesson(lesson)}
                        className={`mx-1 rounded-xl px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-all ${
                          isActive 
                            ? "bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.2)] shadow-sm" 
                            : "hover:bg-[rgba(30,27,46,0.03)] border border-transparent"
                        }`}
                      >
                        {/* Status Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted 
                            ? "bg-[#C9A96E]" 
                            : isActive 
                              ? "bg-[rgba(201,169,110,0.2)]" 
                              : "bg-[#F5F1EB]"
                        }`}>
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : isActive ? (
                            <Play className="w-3.5 h-3.5 text-[#C9A96E]" />
                          ) : (
                            <Lock className="w-3 h-3 text-[#8E8E93]" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isActive ? "text-[#1E1B2E]" : "text-[#8E8E93]"
                          }`}>
                            {lesson.title}
                          </p>
                        </div>
                        
                        {isActive && (
                          <motion.div 
                            layoutId="activeIndicator"
                            className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
