"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Play, FileText, HelpCircle, Star, Clock, BookOpen, 
  BarChart, CheckCircle2, ChevronDown, Lock, ShieldCheck, Award, ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const appleEase = [0.4, 0, 0.2, 1];

interface Lesson {
  id: string;
  title: string;
  fileType: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  teacher: { name: string; image?: string | null; expertise?: string | null };
  modules: Module[];
  _count: { enrollments: number };
}

interface Props {
  course: Course;
  userRole: string | null;
  isEnrolled: boolean;
}

const MOCK_REVIEWS = [
  { id: 1, name: "Sarah J.", date: "2 weeks ago", rating: 5, text: "This course completely changed how I approach scalable architecture. The instructor explains complex patterns with incredible clarity.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: 2, name: "Michael T.", date: "1 month ago", rating: 5, text: "Worth every penny. The curriculum is perfectly structured to build your understanding organically without feeling overwhelmed.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=80" },
  { id: 3, name: "Elena R.", date: "3 months ago", rating: 4, text: "Excellent material, though some of the later modules go very deep very quickly. The AI tutor feature was a lifesaver.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80" }
];

const MOCK_MODULES = [
  {
    id: "m1", title: "Foundations & Environment Setup",
    lessons: [
      { id: "l1", title: "Welcome & Course Philosophy", fileType: "video", duration: "12:45" },
      { id: "l2", title: "Local Environment Architecture", fileType: "video", duration: "18:20" },
      { id: "l3", title: "Configuration Cheatsheet", fileType: "pdf", duration: "5 Pages" },
    ]
  },
  {
    id: "m2", title: "Core Design Patterns",
    lessons: [
      { id: "l4", title: "The Singleton & Factory Models", fileType: "video", duration: "24:15", isLocked: true },
      { id: "l5", title: "Observer Pattern Implementation", fileType: "video", duration: "31:05", isLocked: true },
      { id: "l6", title: "Module 2 Knowledge Check", fileType: "quiz", duration: "15 Questions", isLocked: true },
    ]
  },
  {
    id: "m3", title: "Advanced State Management",
    lessons: [
      { id: "l7", title: "Unidirectional Data Flow", fileType: "video", duration: "42:10", isLocked: true },
      { id: "l8", title: "Context vs Global Stores", fileType: "video", duration: "28:30", isLocked: true },
    ]
  }
];

export default function CourseDetailClient({ course, userRole, isEnrolled }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "reviews">("overview");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["m1", course.modules[0]?.id]));
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 1000], [0, 200]);
  
  // Fallback to mock data if real data is missing/empty
  const displayTitle = course.title || "Advanced TypeScript Patterns";
  const displayDescription = course.description || "Master enterprise-scale application architecture. Learn how to write code that is maintainable, predictable, and fully type-safe from end to end.";
  const displaySubject = course.subject || "WEB DEVELOPMENT";
  const displayModules = course.modules.length > 0 ? course.modules : MOCK_MODULES;
  const totalLessons = displayModules.reduce((acc, m) => acc + m.lessons.length, 0);

  const toggleModule = (id: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedModules(newExpanded);
  };

  const getIconForType = (type: string) => {
    if (type === "video") return <Play size={16} className="fill-current" />;
    if (type === "pdf") return <FileText size={16} />;
    if (type === "quiz") return <HelpCircle size={16} />;
    return <Play size={16} className="fill-current" />;
  };

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      {/* 1. HERO SECTION — PRODUCT HERO */}
      <section className="relative pt-[180px] pb-[80px] bg-[#1E1B2E] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[100px]">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="w-full lg:w-[55%] z-10"
            >
              <div className="inline-block bg-[#C9A96E] text-[#1E1B2E] px-3 py-1 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.1em] mb-6">
                {displaySubject}
              </div>
              <h1 className="font-heading font-bold text-[28px] md:text-[48px] text-white leading-[0.95] max-w-[500px]">
                {displayTitle}
              </h1>
              <p className="font-sans text-[18px] text-[#F5F1EB] leading-[1.6] max-w-[480px] mt-4 opacity-90">
                {displayDescription}
              </p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-[#F5F1EB] font-sans text-[14px]">
                  <Clock size={16} className="text-[#C9A96E]" /> 12h 30m
                </div>
                <div className="flex items-center gap-2 text-[#F5F1EB] font-sans text-[14px]">
                  <BookOpen size={16} className="text-[#C9A96E]" /> {totalLessons} Lessons
                </div>
                <div className="flex items-center gap-2 text-[#F5F1EB] font-sans text-[14px]">
                  <BarChart size={16} className="text-[#C9A96E]" /> Intermediate
                </div>
                <div className="flex items-center gap-2 text-[#F5F1EB] font-sans text-[14px]">
                  <Star size={16} className="text-[#C9A96E] fill-[#C9A96E]" /> 4.8
                </div>
              </div>

              {/* CTA Row */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(201,169,110,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full sm:w-auto bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full px-8 py-4 shadow-[0_4px_14px_rgba(201,169,110,0.2)]"
                >
                  Enroll Now
                </motion.button>
                <motion.button 
                  whileHover={{ backgroundColor: "#FFFFFF", color: "#1E1B2E" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:w-auto bg-transparent border border-white text-white font-sans font-medium text-[16px] rounded-full px-8 py-4"
                >
                  Try for Free
                </motion.button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 mt-6 text-[#8E8E93] font-sans text-[13px]">
                <ShieldCheck size={16} /> 14-day money-back guarantee
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 40, rotate: -6 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              className="w-full lg:w-[45%] hidden md:block"
            >
              <motion.div 
                style={{ y: yImage }}
                className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                {course.thumbnail ? (
                  <Image src={course.thumbnail} alt={displayTitle} fill className="object-cover" priority />
                ) : (
                  <Image src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" alt="Code Background" fill className="object-cover" priority />
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN MAIN CONTENT */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT COLUMN (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col">
            
            {/* TAB NAVIGATION — STICKY */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="sticky top-[72px] z-40 bg-[#F5F1EB]/90 backdrop-blur-md border-b border-[rgba(30,27,46,0.08)] flex gap-8 pb-3 pt-4 mb-10 overflow-x-auto scrollbar-none"
            >
              {(["overview", "curriculum", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "font-sans text-[14px] capitalize pb-2 whitespace-nowrap transition-colors duration-300 relative",
                    activeTab === tab ? "text-[#1E1B2E] font-medium" : "text-[#8E8E93] hover:text-[#1E1B2E]"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E]" 
                    />
                  )}
                </button>
              ))}
            </motion.div>

            {/* TAB CONTENT */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: appleEase }}
                  >
                    <h2 className="font-heading text-[28px] text-[#1E1B2E] mb-4">About This Course</h2>
                    <p className="font-sans text-[17px] text-[#8E8E93] leading-[1.7] mb-10 whitespace-pre-wrap">
                      {course.description || "In this comprehensive program, you will dive deep into the advanced concepts required to build scalable, enterprise-grade applications. We go beyond the basics to explore architectural patterns, performance optimization, and robust testing strategies.\n\nWhether you're looking to level up your current role or prepare for a senior position, this curriculum provides the exact tools and mental models used by top tech companies."}
                    </p>

                    <h2 className="font-heading text-[22px] text-[#1E1B2E] mb-6">What you'll learn</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Build scalable application architectures",
                        "Master advanced state management",
                        "Implement enterprise security patterns",
                        "Optimize rendering performance",
                        "Set up robust CI/CD pipelines",
                        "Write maintainable end-to-end tests"
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.4 }}
                          whileHover={{ y: -2 }}
                          className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(30,27,46,0.04)] flex gap-3"
                        >
                          <CheckCircle2 size={20} className="text-[#C9A96E] shrink-0" />
                          <span className="font-sans text-[15px] text-[#1E1B2E] leading-snug">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CURRICULUM TAB */}
                {activeTab === "curriculum" && (
                  <motion.div 
                    key="curriculum"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: appleEase }}
                  >
                    <div className="flex flex-col gap-2">
                      {displayModules.map((module: any, i: number) => {
                        const isExpanded = expandedModules.has(module.id);
                        return (
                          <motion.div 
                            key={module.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="bg-transparent border-b border-[rgba(30,27,46,0.08)] last:border-0"
                          >
                            {/* Module Header */}
                            <button 
                              onClick={() => toggleModule(module.id)}
                              className="w-full flex items-center justify-between py-5 text-left group"
                            >
                              <div className="flex items-center gap-4">
                                <h3 className="font-heading text-[18px] text-[#1E1B2E] group-hover:text-[#C9A96E] transition-colors">
                                  {i + 1}. {module.title}
                                </h3>
                                <div className="hidden sm:block bg-[#C9A96E]/10 text-[#C9A96E] px-2 py-0.5 rounded-full font-sans text-[11px] uppercase tracking-wider font-bold">
                                  {module.lessons.length} Lessons
                                </div>
                              </div>
                              <ChevronDown 
                                size={20} 
                                className={cn(
                                  "text-[#8E8E93] transition-transform duration-300",
                                  isExpanded && "rotate-180"
                                )} 
                              />
                            </button>

                            {/* Lesson List */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-5 pl-4 flex flex-col gap-1">
                                    {module.lessons.map((lesson: any) => (
                                      <div 
                                        key={lesson.id} 
                                        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[#C9A96E]/5 border-l-2 border-[#C9A96E]/30 hover:border-[#C9A96E] transition-all cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="text-[#8E8E93] group-hover:text-[#C9A96E] transition-colors">
                                            {getIconForType(lesson.fileType || "video")}
                                          </div>
                                          <span className="font-sans text-[15px] text-[#1E1B2E]">{lesson.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="font-sans text-[13px] text-[#8E8E93]">{lesson.duration || "15:00"}</span>
                                          {lesson.isLocked ? (
                                            <Lock size={14} className="text-[#8E8E93]" />
                                          ) : (
                                            <Play size={14} className="text-[#1E1B2E]" />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === "reviews" && (
                  <motion.div 
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: appleEase }}
                  >
                    <div className="flex items-end gap-6 mb-10">
                      <div className="font-heading text-[64px] text-[#1E1B2E] leading-none">4.8</div>
                      <div className="pb-2 flex flex-col gap-1">
                        <div className="flex gap-1 text-[#C9A96E]">
                          {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-current" />)}
                        </div>
                        <div className="font-sans text-[14px] text-[#8E8E93]">
                          Based on 124 reviews
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {MOCK_REVIEWS.map((review, i) => (
                        <motion.div 
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.4 }}
                          className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(30,27,46,0.04)]"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-sans font-medium text-[15px] text-[#1E1B2E]">{review.name}</span>
                                <span className="font-sans text-[13px] text-[#8E8E93]">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-[#C9A96E]">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < review.rating ? "fill-current" : "fill-transparent opacity-30"} />
                              ))}
                            </div>
                          </div>
                          <p className="font-sans text-[15px] text-[#8E8E93] leading-[1.6]">
                            "{review.text}"
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN (40%) — STICKY SIDEBAR */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:sticky lg:top-[120px] lg:self-start z-10">
            
            {/* Pricing Card */}
            <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_24px_rgba(30,27,46,0.08)]">
              <div className="flex items-end gap-3 mb-2">
                <span className="font-heading text-[36px] text-[#1E1B2E] leading-none">Free</span>
              </div>
              <p className="font-sans text-[13px] text-[#8E8E93] mb-8">Enroll now. Full lifetime access.</p>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full py-4 mb-3 shadow-[0_4px_14px_rgba(201,169,110,0.2)]"
              >
                Enroll Now
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: "#1E1B2E", color: "#FFFFFF" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-transparent border border-[#1E1B2E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full py-4 transition-colors"
              >
                Try for Free
              </motion.button>

              <div className="my-6 border-t border-[rgba(30,27,46,0.08)]" />

              <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#8E8E93] mb-4 block">
                This course includes:
              </span>
              <ul className="flex flex-col gap-3">
                {[
                  "12 hours of on-demand video",
                  "24 downloadable resources",
                  "Full lifetime access",
                  "Access on mobile and desktop",
                  "24/7 AI Tutor assistance",
                  "Certificate of completion"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[#C9A96E] shrink-0" />
                    <span className="font-sans text-[14px] text-[#8E8E93]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor Card */}
            <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_24px_rgba(30,27,46,0.04)]">
              <div className="flex gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[rgba(30,27,46,0.08)]">
                  {course.teacher.image ? (
                    <Image src={course.teacher.image} alt={course.teacher.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1E1B2E] flex items-center justify-center text-[#C9A96E] font-heading text-xl">
                      {course.teacher.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-[18px] text-[#1E1B2E] mb-1">{course.teacher.name}</span>
                  <span className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#C9A96E] mb-2">
                    {course.teacher.expertise || "Senior Developer"}
                  </span>
                  <p className="font-sans text-[14px] text-[#8E8E93] line-clamp-2 leading-relaxed mb-3">
                    A veteran engineer who has built systems for Fortune 500s. Passionate about teaching clean architecture.
                  </p>
                  <Link href="#" className="font-sans text-[13px] text-[#C9A96E] font-medium hover:text-[#1E1B2E] transition-colors inline-flex items-center">
                    View Profile <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_24px_rgba(30,27,46,0.04)] border-t-[3px] border-[#C9A96E]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                  <Award size={20} className="text-[#C9A96E]" />
                </div>
                <h3 className="font-heading text-[18px] text-[#1E1B2E]">Earn a Certificate</h3>
              </div>
              <p className="font-sans text-[14px] text-[#8E8E93] mb-4">
                Prove your skills with a recognized credential. Shareable directly to LinkedIn.
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C9A96E]" />
                  <span className="font-sans text-[13px] text-[#8E8E93]">Blockchain-verified</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C9A96E]" />
                  <span className="font-sans text-[13px] text-[#8E8E93]">Direct LinkedIn Integration</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 3. RELATED COURSES */}
      <section className="py-[100px] bg-[#F5F1EB] border-t border-[rgba(30,27,46,0.05)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="font-sans text-[12px] uppercase tracking-[0.15em] text-[#C9A96E] mb-4 block">
            You Might Also Like
          </span>
          <h2 className="font-heading text-[32px] text-[#1E1B2E] mb-10">
            Continue exploring.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: appleEase }}
              >
                <div className="bg-white rounded-[16px] overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.04)] hover:shadow-[0_12px_40px_rgba(30,27,46,0.08)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                  <div className="w-full aspect-[16/9] bg-[#1E1B2E] relative overflow-hidden">
                    <Image src={`https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800`} alt="Course" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-[20px] text-[#1E1B2E] mb-2 leading-[1.2]">Data Science Fundamentals</h3>
                    <div className="flex items-center gap-2 mb-4 text-[#8E8E93] font-sans text-[13px]">
                      <span>by David Chen</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <span className="font-heading text-[20px] text-[#1E1B2E]">Free</span>
                      <span className="font-sans text-[13px] text-[#C9A96E] font-medium group-hover:text-[#1E1B2E] transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-[160px] bg-[#1E1B2E] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 className="font-heading font-black text-[36px] text-white mb-10">
              Ready to start learning?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full px-10 py-4"
              >
                Enroll Now
              </motion.button>
              <Link href="/courses">
                <motion.button 
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-transparent border border-white text-white font-sans font-medium text-[16px] rounded-full px-10 py-4"
                >
                  View All Courses
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
