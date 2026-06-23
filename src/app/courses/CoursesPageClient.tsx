"use client";

import { useState } from "react";
import { Search, BookOpen, Clock, Star, Users, Filter, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const appleEase = [0.4, 0, 0.2, 1];

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  teacher: { name: string };
  _count: { enrollments: number };
  price?: number;
  originalPrice?: number;
  rating?: number;
  lessons?: number;
  duration?: string;
}

interface Props {
  courses: Course[];
  userRole: string | null;
  initialEnrolledIds: string[];
}

const MOCK_COURSES: Course[] = [
  {
    id: "m1",
    title: "Advanced React Architecture Patterns",
    description: "Learn how to build scalable React applications.",
    subject: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Sarah Jenkins" },
    _count: { enrollments: 1240 },
    price: 99,
    originalPrice: 149,
    rating: 4.9,
    lessons: 42,
    duration: "12h 30m"
  },
  {
    id: "m2",
    title: "Data Science Fundamentals with Python",
    description: "Your complete guide to data analysis and machine learning.",
    subject: "Data Science",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "David Chen" },
    _count: { enrollments: 3420 },
    price: 89,
    rating: 4.8,
    lessons: 56,
    duration: "18h 15m"
  },
  {
    id: "m3",
    title: "UI/UX Design Masterclass",
    description: "Design beautiful interfaces from wireframe to prototype.",
    subject: "Design",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Elena Rodriguez" },
    _count: { enrollments: 2150 },
    price: 129,
    originalPrice: 199,
    rating: 4.9,
    lessons: 64,
    duration: "22h 00m"
  },
  {
    id: "m4",
    title: "Digital Marketing Strategy 2026",
    description: "Master modern SEO, content, and growth loops.",
    subject: "Marketing",
    thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Marcus Johnson" },
    _count: { enrollments: 890 },
    price: 79,
    rating: 4.7,
    lessons: 32,
    duration: "9h 45m"
  },
  {
    id: "m5",
    title: "Full-Stack Next.js 16 Bootcamp",
    description: "Build production-ready apps with App Router and Prisma.",
    subject: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Sarah Jenkins" },
    _count: { enrollments: 4500 },
    price: 149,
    originalPrice: 249,
    rating: 5.0,
    lessons: 84,
    duration: "34h 20m"
  },
  {
    id: "m6",
    title: "Business Leadership & Management",
    description: "Essential skills for leading effective teams.",
    subject: "Business",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Amanda Lewis" },
    _count: { enrollments: 1120 },
    price: 199,
    rating: 4.8,
    lessons: 28,
    duration: "8h 10m"
  },
  {
    id: "m7",
    title: "Machine Learning Algorithms A-Z",
    description: "Deep dive into regression, classification, and neural nets.",
    subject: "Data Science",
    thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "David Chen" },
    _count: { enrollments: 2800 },
    price: 139,
    originalPrice: 189,
    rating: 4.9,
    lessons: 72,
    duration: "26h 40m"
  },
  {
    id: "m8",
    title: "Framer Motion Animation Secrets",
    description: "Create Apple-level cinematic web experiences.",
    subject: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Elena Rodriguez" },
    _count: { enrollments: 950 },
    price: 69,
    rating: 4.9,
    lessons: 24,
    duration: "6h 15m"
  },
  {
    id: "m9",
    title: "Brand Identity Design",
    description: "Craft memorable logos, palettes, and brand guidelines.",
    subject: "Design",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
    teacher: { name: "Marcus Johnson" },
    _count: { enrollments: 1640 },
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    lessons: 38,
    duration: "11h 50m"
  }
];

export default function CoursesPageClient({ courses, userRole, initialEnrolledIds }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrolledIds] = useState<Set<string>>(new Set(initialEnrolledIds));
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Merge real courses from DB with mock courses
  const displayCourses = [...courses, ...MOCK_COURSES];

  const filterCategories = ["All", "Web Development", "Data Science", "Design", "Business", "Marketing"];

  const filteredCourses = displayCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Reset to first page when filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSubscribe = async () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setSubscribeMessage({ text: "Please enter a valid email address.", type: "error" });
      return;
    }
    
    setIsSubscribing(true);
    setSubscribeMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail })
      });

      const data = await res.json();

      if (res.ok) {
        setSubscribeMessage({ text: data.message || "Subscribed successfully!", type: "success" });
        setNewsletterEmail("");
      } else {
        setSubscribeMessage({ text: data.error || "Failed to subscribe.", type: "error" });
      }
    } catch (error) {
      setSubscribeMessage({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      {/* 1. PAGE HEADER — EDITORIAL OPENING */}
      <section className="pt-[160px] pb-[80px] bg-[#F5F1EB] border-b border-[#1E1B2E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <span className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#C9A96E] mb-6 block">
              Explore
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="font-heading font-bold text-[40px] md:text-[56px] text-[#1E1B2E] leading-[0.95] mb-4"
          >
            Our Courses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: appleEase }}
            className="font-sans text-[18px] text-[#8E8E93] leading-[1.5] max-w-[560px] mb-12"
          >
            Expert-led programmes designed to fit your life. Whether you're starting a new career or advancing your existing skills.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
            className="relative max-w-[800px]"
          >
            <input                type="text" 
                placeholder="Search courses, topics, or instructors..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-[56px] bg-white rounded-full px-6 pl-14 font-sans text-[16px] text-[#1E1B2E] placeholder-[#8E8E93] shadow-[0_2px_12px_rgba(30,27,46,0.06)] border-0 focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-shadow"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8E8E93] w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: appleEase }}
        className="sticky top-[72px] z-40 bg-[#F5F1EB]/90 backdrop-blur-md border-b border-[rgba(30,27,46,0.08)] py-4"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex-1 overflow-x-auto scrollbar-none flex gap-3 items-center pb-1">
            {filterCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={cn(
                  "whitespace-nowrap px-5 py-2 rounded-full font-sans text-[14px] transition-all duration-300",
                  selectedCategory === cat 
                  ? "bg-[#1E1B2E] text-white shadow-md" 
                  : "bg-white text-[#1E1B2E] border border-[rgba(30,27,46,0.08)] hover:shadow-[0_2px_8px_rgba(30,27,46,0.05)] hover:-translate-y-0.5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="shrink-0 flex items-center gap-2 px-5 py-2 rounded-full border border-[#1E1B2E] text-[#1E1B2E] font-sans text-[14px] hover:bg-[#1E1B2E] hover:text-white transition-colors duration-300 apple-ease">
            <Filter size={16} /> Filters
          </button>
        </div>
      </motion.div>

      {/* 3. COURSE GRID */}
      <section className="py-[60px] flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {currentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCourses.map((course, idx) => {
                const isEnrolled = enrolledIds.has(course.id);
                const mockLessons = course.lessons || ((idx * 7) % 40) + 10;
                const mockDuration = course.duration || `${(idx % 10) + 2}h 30m`;
                const mockRating = course.rating || 4.8;
                const mockPrice = course.price || 99;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: appleEase }}
                  >
                    <Link href={`/courses/${course.id}`} className="block h-full group">
                      <motion.div 
                        whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(30,27,46,0.12)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white rounded-[16px] overflow-hidden h-full flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.06)]"
                      >
                        {/* Image Top */}
                        <div className="w-full aspect-[16/9] relative overflow-hidden bg-[#1E1B2E]">
                          {course.thumbnail ? (
                            <Image 
                              src={course.thumbnail} 
                              alt={course.title} 
                              fill 
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-30 transition-transform duration-700 ease-out group-hover:scale-105">
                              <BookOpen size={48} className="text-white" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-[#C9A96E] text-[#1E1B2E] px-3 py-1 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.1em] shadow-md">
                            {course.subject}
                          </div>
                        </div>

                        {/* Content Bottom */}
                        <div className="p-7 flex flex-col flex-1">
                          <h3 className="font-heading text-[22px] text-[#1E1B2E] mb-3 leading-[1.2] group-hover:text-[#C9A96E] transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-6 text-[#8E8E93] font-sans text-[14px]">
                            <Briefcase size={14} />
                            <span>by {course.teacher?.name || "Expert Instructor"}</span>
                          </div>

                          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[rgba(30,27,46,0.06)] font-sans text-[13px] text-[#8E8E93]">
                            <div className="flex items-center gap-1.5">
                              <Users size={14} /> {course._count?.enrollments || 0}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <BookOpen size={14} /> {mockLessons}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} /> {mockDuration}
                            </div>
                          </div>

                          <div className="mt-auto flex items-end justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-1 text-[#8E8E93] font-sans text-[14px]">
                                <Star size={14} className="text-[#C9A96E] fill-[#C9A96E]" />
                                <span>{mockRating}</span>
                              </div>
                              <div className="flex items-end gap-2">
                                <span className="font-heading text-[18px] text-[#1E1B2E] leading-none">
                                  Free
                                </span>
                              </div>
                            </div>

                            {isEnrolled ? (
                              <div className="flex items-center text-[#34D399] font-sans text-[14px] font-medium">
                                Enrolled <CheckCircle2 size={16} className="ml-1" />
                              </div>
                            ) : (
                              <div className="flex items-center text-[#C9A96E] font-sans text-[14px] font-medium transition-colors group-hover:text-[#1E1B2E]">
                                View Details <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                <Search className="w-10 h-10 text-[#8E8E93]" />
              </div>
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-3">No courses found</h3>
              <p className="font-sans text-[16px] text-[#8E8E93] mb-8 leading-relaxed">
                We couldn't find any courses matching your current search or filters. Try adjusting your terms.
              </p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                className="text-[#C9A96E] font-sans text-[15px] font-medium hover:text-[#1E1B2E] transition-colors duration-300 border-b border-transparent hover:border-[#1E1B2E]"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-[60px] flex items-center justify-center gap-6"
            >
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[#8E8E93] hover:text-[#1E1B2E] transition-colors disabled:opacity-30 disabled:hover:text-[#8E8E93]" 
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-4 font-sans text-[16px]">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-1 font-medium transition-colors ${
                      currentPage === i + 1 
                        ? "text-[#1E1B2E] border-b-2 border-[#C9A96E]" 
                        : "text-[#8E8E93] hover:text-[#1E1B2E]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-[#8E8E93] hover:text-[#1E1B2E] transition-colors disabled:opacity-30 disabled:hover:text-[#8E8E93]" 
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. NEWSLETTER CTA */}
      <section className="py-[120px] bg-[#1E1B2E] text-center border-t border-[#C9A96E]/20">
        <div className="max-w-xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 className="font-heading font-black text-[36px] text-white mb-4">
              Stay Updated
            </h2>
            <p className="font-sans text-[16px] text-[#F5F1EB]/80 mb-10 font-light">
              Get notified when new courses are released and receive exclusive educational content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                disabled={isSubscribing}
                className="w-full h-[56px] bg-white/5 border border-white/10 rounded-full px-6 font-sans text-[16px] text-white placeholder-white/50 focus:ring-2 focus:ring-[#C9A96E] focus:outline-none transition-shadow disabled:opacity-50"
              />
              <motion.button 
                onClick={handleSubscribe}
                disabled={isSubscribing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full sm:w-auto shrink-0 bg-[#C9A96E] text-[#1E1B2E] font-sans font-medium text-[16px] rounded-full px-8 h-[56px] disabled:opacity-70 flex items-center justify-center min-w-[140px]"
              >
                {isSubscribing ? (
                  <div className="w-5 h-5 border-2 border-[#1E1B2E]/20 border-t-[#1E1B2E] rounded-full animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </motion.button>
            </div>
            
            {/* Subscription Message */}
            <AnimatePresence>
              {subscribeMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 font-sans text-[14px] ${subscribeMessage.type === "success" ? "text-green-400" : "text-red-400"}`}
                >
                  {subscribeMessage.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
