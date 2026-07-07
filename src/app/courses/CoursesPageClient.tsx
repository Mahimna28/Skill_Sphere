"use client";

import { useState } from "react";
import { Search, Star, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useReducedMotion, useIsMobile } from "@/lib/animations";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  teacher: { name: string };
  _count: { enrollments: number };
  rating?: number;
  lessons?: number;
  duration?: string;
}

interface Props {
  courses: Course[];
  userRole: string | null;
  initialEnrolledIds: string[];
}


export default function CoursesPageClient({ courses, userRole, initialEnrolledIds }: Props) {
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrolledIds] = useState<Set<string>>(new Set(initialEnrolledIds));
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const getStaggerDelay = (desktopDelay: number) => isMobile ? desktopDelay * 0.5 : desktopDelay;

  // Use only real courses from DB
  const displayCourses = courses;

  const filterCategories = ["All", "Programming", "AI", "Web Development", "Data Science", "Design", "Business"];

  const filteredCourses = displayCourses.filter(course => {
    const matchesSearch = !searchQuery || 
                         course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           course.subject?.toLowerCase() === selectedCategory.toLowerCase() ||
                           (course as any).category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      
      {/* HERO SECTION */}
      <section className="pt-[100px] pb-[40px] px-[32px] max-w-[800px] mx-auto text-center w-full">
        <FadeIn delay={0.1}>
          <span className="font-sans text-[12px] uppercase text-[#C9A96E] tracking-[0.08em] font-semibold block mb-4">OUR COURSES</span>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <h1 className="font-heading text-[42px] text-[#1E1B2E] leading-[1.15]">Explore Our Courses</h1>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <p className="font-sans text-[16px] text-[#8E8E93] mt-[12px] mb-10">
            Find the perfect course to advance your skills.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-row items-center bg-white rounded-full h-[56px] max-w-[600px] mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden focus-within:shadow-inner transition-shadow">
            <Search className="text-[#8E8E93] ml-[20px] shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 border-none h-full px-[16px] font-sans text-[16px] text-[#1E1B2E] placeholder:text-[#8E8E93] focus:outline-none bg-transparent"
            />
            <button className="w-[44px] h-[44px] rounded-full bg-[#1E1B2E] text-white flex items-center justify-center mr-[6px] hover:bg-[#C9A96E] transition-colors shrink-0">
              <Search size={18} />
            </button>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={getStaggerDelay(0.05)} delayChildren={0.5} className="flex flex-row flex-wrap justify-center gap-[10px] mt-[24px]">
          {filterCategories.map((cat, i) => (
            <StaggerItem key={cat}>
              <button
                onClick={() => handleCategorySelect(cat)}
                className={cn(
                  "px-[16px] py-[8px] rounded-full font-sans text-[13px] transition-all duration-200 border cursor-pointer",
                  selectedCategory === cat
                    ? "bg-[#1E1B2E] text-white border-[#1E1B2E] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-[#8E8E93] border-[rgba(30,27,46,0.1)] hover:border-[#C9A96E] hover:text-[#1E1B2E] hover:bg-[rgba(201,169,110,0.06)]"
                )}
              >
                {cat}
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* COURSE GRID */}
      <section className="px-[32px] py-[40px] max-w-[1200px] mx-auto w-full">
        {currentCourses.length > 0 ? (
          <StaggerContainer key={`${selectedCategory}-${currentPage}`} staggerDelay={getStaggerDelay(0.15)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {currentCourses.map((course, i) => {
              const isEnrolled = enrolledIds.has(course.id);
              return (
                <StaggerItem key={course.id}>
                  <Link href={`/courses/${course.id}`} className="block h-full">
                    <motion.div 
                      className="group relative bg-white rounded-[16px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.05)] h-full flex flex-col hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300"
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                    >
                      {/* Thumbnail */}
                      <div className="w-full aspect-[16/9] relative bg-[#1E1B2E] rounded-t-[16px] overflow-hidden">
                        {course.thumbnail ? (
                          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                        )}
                        <div className="absolute top-[12px] left-[12px] bg-[rgba(30,27,46,0.7)] text-white font-sans text-[11px] px-[10px] py-[4px] rounded-full">
                          {course.subject}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-[20px] flex flex-col flex-1">
                        <h3 className="font-heading text-[18px] text-[#1E1B2E] line-clamp-2 leading-tight">
                          {course.title}
                        </h3>
                        <p className="font-sans text-[13px] text-[#8E8E93] mt-[6px]">By {course.teacher.name}</p>

                        <div className="mt-[10px] flex items-center gap-[4px]">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-[#C9A96E] text-[#C9A96E]" />
                            ))}
                          </div>
                          <span className="font-sans text-[13px] text-[#8E8E93] ml-1">{course.rating || "4.8"}</span>
                        </div>

                        <div className="mt-[12px] flex flex-row items-center justify-between pb-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[rgba(201,169,110,0.12)] text-[#C9A96E]">
                            Free
                          </span>
                        </div>
                      </div>

                      {/* Hover Reveal (Bottom of Card) */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-[20px] bg-gradient-to-t from-white via-white to-transparent pt-8"
                        variants={{
                          rest: { opacity: isMobile || shouldReduceMotion ? 1 : 0, y: isMobile || shouldReduceMotion ? 0 : 10 },
                          hover: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                      >
                        <button className="w-full h-[40px] bg-[#C9A96E] text-[#1E1B2E] rounded-xl font-sans font-medium text-[14px] hover:scale-[1.02] transition-transform">
                          {isEnrolled ? "Go to Course" : "Enroll Now"}
                        </button>
                      </motion.div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl border border-[rgba(30,27,46,0.04)] shadow-sm max-w-2xl mx-auto px-6"
          >
            <BookOpen className="w-12 h-12 text-[#1E1B2E]/20 mx-auto" />
            <h3 className="mt-4 font-heading text-2xl text-[#1E1B2E] mb-2">No courses available yet</h3>
            <p className="font-sans text-[16px] text-[#8E8E93] mb-8">
              Our instructors are working on bringing you top-quality content. 
              In the meantime, check out our latest articles and updates.
            </p>
            <Link href="/blog">
              <button className="bg-[rgba(201,169,110,0.15)] text-[#C9A96E] font-sans font-medium text-[15px] px-8 py-3 rounded-xl hover:bg-[rgba(201,169,110,0.25)] transition-colors border border-[#C9A96E]/20">
                Explore Blog
              </button>
            </Link>
          </motion.div>
        )}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <section className="mt-[40px] mb-[40px] flex flex-row gap-[8px] items-center justify-center">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-[36px] h-[36px] rounded-full border border-[rgba(30,27,46,0.1)] flex items-center justify-center text-[#8E8E93] hover:bg-[#1E1B2E] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#8E8E93]"
          >
            <ChevronLeft size={20} />
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            
            return (
              <motion.button
                key={page}
                onClick={() => handlePageChange(page)}
                whileHover={!isActive ? { scale: 1.05 } : {}}
                className={cn(
                  "px-[14px] py-[8px] rounded-lg font-sans text-[14px] transition-colors duration-200",
                  isActive
                    ? "bg-[#C9A96E] text-[#1E1B2E] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-110 transform"
                    : "bg-transparent text-[#1E1B2E] hover:bg-[rgba(201,169,110,0.1)]"
                )}
              >
                {page}
              </motion.button>
            );
          })}

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-[36px] h-[36px] rounded-full border border-[rgba(30,27,46,0.1)] flex items-center justify-center text-[#8E8E93] hover:bg-[#1E1B2E] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#8E8E93]"
          >
            <ChevronRight size={20} />
          </button>
        </section>
      )}

    </div>
  );
}
