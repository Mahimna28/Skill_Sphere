"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, Clock, Star, ArrowRight, ArrowLeft, ShieldCheck, Mail, MapPin, Briefcase } from "lucide-react";

import { useRouter } from "next/navigation";

const appleEase = [0.25, 0.1, 0.25, 1.0] as any;

interface TeacherProps {
  id: string;
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  expertise: string | null;
}

interface CourseProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  rating?: number;
  duration?: string;
  lessons?: number;
  _count: { enrollments: number };
}

export default function TeacherProfileClient({ teacher, courses }: { teacher: TeacherProps, courses: CourseProps[] }) {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-[#F5F1EB] min-h-screen">
      {/* 1. TEACHER HERO SECTION */}
      <section className="relative pt-[180px] pb-[80px] bg-[#1E1B2E] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center text-[#8E8E93] hover:text-white transition-colors font-sans text-[14px] mb-8 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> Back
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#C9A96E] shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-white relative"
            >
              {teacher.image ? (
                <Image src={teacher.image} alt={teacher.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1E1B2E] text-[#C9A96E] font-heading text-6xl">
                  {teacher.name.charAt(0)}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
              className="flex-1 text-center md:text-left text-white"
            >
              <h1 className="font-heading font-bold text-[36px] md:text-[56px] leading-none mb-2">
                {teacher.name}
              </h1>
              <div className="font-sans text-[18px] text-[#C9A96E] mb-6">
                {teacher.expertise || "Expert Instructor"} • @{teacher.username}
              </div>
              <p className="font-sans text-[16px] md:text-[18px] text-[#F5F1EB] leading-relaxed opacity-90 max-w-2xl">
                {teacher.bio || "An experienced educator dedicated to sharing knowledge and helping students achieve their potential."}
              </p>
              
              <div className="mt-8 flex items-center justify-center md:justify-start gap-6">
                <div className="flex flex-col">
                  <span className="font-heading text-3xl font-bold text-white">{courses.length}</span>
                  <span className="font-sans text-[14px] text-[#8E8E93] uppercase tracking-wider">Courses</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex flex-col">
                  <span className="font-heading text-3xl font-bold text-white">
                    {courses.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0).toLocaleString()}
                  </span>
                  <span className="font-sans text-[14px] text-[#8E8E93] uppercase tracking-wider">Students</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. COURSES SECTION */}
      <section className="py-[80px] bg-[#F5F1EB] flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <h2 className="font-heading font-medium text-[32px] md:text-[40px] text-[#1E1B2E]">Courses by {teacher.name.split(" ")[0]}</h2>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => {
                const mockLessons = course.lessons || 12;
                const mockDuration = course.duration || "5h 30m";
                const mockRating = course.rating || 4.8;

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
                        className="bg-white rounded-[16px] overflow-hidden h-full flex flex-col shadow-[0_4px_20px_rgba(30,27,46,0.06)] border border-[rgba(30,27,46,0.03)]"
                      >
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

                        <div className="p-7 flex flex-col flex-1">
                          <h3 className="font-heading text-[22px] text-[#1E1B2E] mb-3 leading-[1.2] group-hover:text-[#C9A96E] transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          
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
                                <span className="font-heading text-[18px] text-[#1E1B2E] leading-none">Free</span>
                              </div>
                            </div>
                            <div className="flex items-center text-[#C9A96E] font-sans text-[14px] font-medium transition-colors group-hover:text-[#1E1B2E]">
                              View Details <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[16px] shadow-[0_2px_12px_rgba(30,27,46,0.04)] border border-[rgba(30,27,46,0.06)]">
              <BookOpen size={48} className="mx-auto text-[#8E8E93] opacity-30 mb-4" />
              <h3 className="font-heading text-[24px] text-[#1E1B2E] mb-2">No Public Courses</h3>
              <p className="font-sans text-[16px] text-[#8E8E93]">This instructor hasn't published any public courses yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
