"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, ArrowRight, CheckCircle, List, PlayCircle, FileText, Lock } from "lucide-react";
import Link from "next/link";

export default function CourseDetailClient({ course, userRole, isEnrolled }: { course: any, userRole: string | null, isEnrolled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!userRole || userRole !== "student") {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: "POST" });
      if (res.ok) {
        router.push(`/dashboard/student/courses/${course.id}`);
      } else {
        alert("Enrollment failed. Please try again.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const totalLessons = course.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Hero Header */}
      <div className="bg-[#4F7DF3] border-b-4 border-black pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://patterns.dev/img/grid.svg')] opacity-[0.05] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1 text-white">
            <div className="inline-block bg-[#F5C84C] text-black px-4 py-1.5 border-4 border-black font-black text-sm uppercase mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {course.subject}
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              {course.title}
            </h1>
            <p className="text-xl font-bold opacity-90 max-w-2xl mb-8 leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8 font-black text-sm uppercase">
               <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border-2 border-transparent">
                  <Users size={18} className="text-[#34D399]" /> {course._count.enrollments} Enrolled
               </div>
               <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border-2 border-transparent">
                  <BookOpen size={18} className="text-[#F5C84C]" /> {totalLessons} Lessons
               </div>
               <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border-2 border-transparent">
                  <Clock size={18} className="text-[#4F7DF3]" /> Self-Paced
               </div>
            </div>

            {isEnrolled ? (
              <Button onClick={() => router.push(`/dashboard/student/courses/${course.id}`)} className="neo-brutalism bg-[#34D399] text-black font-black h-16 px-10 text-xl">
                <CheckCircle className="mr-3 h-6 w-6" /> Resume Learning
              </Button>
            ) : (
              <Button onClick={handleEnroll} disabled={loading} className="neo-brutalism bg-[#F5C84C] text-black font-black h-16 px-10 text-xl hover:-translate-y-1">
                {loading ? "Enrolling..." : "Enroll Now for Free"} <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            )}
          </div>

          <div className="w-full md:w-[400px] shrink-0">
            <div className="aspect-video bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center relative rotate-2">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen size={100} className="text-black/10" />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Col: Details & Syllabus */}
        <div className="md:col-span-2 space-y-12">
          
          <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
              <List className="text-[#4F7DF3]" /> About This Course
            </h2>
            <div className="prose prose-lg font-medium leading-relaxed text-black/80">
              {course.details ? (
                <div dangerouslySetInnerHTML={{ __html: course.details.replace(/\n/g, '<br />') }} />
              ) : (
                <p>Detailed description coming soon. This course covers the fundamental concepts of {course.subject}.</p>
              )}
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
              <BookOpen className="text-[#34D399]" /> Course Syllabus
            </h2>
            
            {course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map((mod: any, index: number) => (
                  <div key={mod.id} className="border-4 border-black rounded-2xl overflow-hidden">
                    <div className="bg-muted/30 p-5 border-b-4 border-black flex justify-between items-center">
                      <h3 className="font-black text-lg">Module {index + 1}: {mod.title}</h3>
                      <span className="font-bold text-xs uppercase bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {mod.lessons.length} Lessons
                      </span>
                    </div>
                    <div className="divide-y-2 divide-black">
                      {mod.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="p-4 bg-white flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            {lesson.fileType?.includes("video") ? (
                              <PlayCircle className="text-red-500 w-5 h-5" />
                            ) : (
                              <FileText className="text-blue-500 w-5 h-5" />
                            )}
                            <span className="font-bold text-sm">{lesson.title}</span>
                          </div>
                          {!isEnrolled && <Lock size={16} className="text-muted-foreground opacity-50" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-bold text-muted-foreground italic text-center py-8">Syllabus is currently being updated.</p>
            )}
          </div>

        </div>

        {/* Right Col: Teacher Info */}
        <div className="space-y-8">
          <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <h3 className="font-black uppercase text-xs tracking-widest text-muted-foreground mb-6 border-b-2 border-black pb-4">Your Instructor</h3>
            
            <div className="w-24 h-24 bg-[#F5C84C] border-4 border-black rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               {course.teacher.image ? (
                 <img src={course.teacher.image} alt={course.teacher.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-3xl font-black">{course.teacher.name.charAt(0)}</span>
               )}
            </div>
            
            <h4 className="text-2xl font-black uppercase mb-2">{course.teacher.name}</h4>
            <p className="font-bold text-sm text-[#4F7DF3] mb-6">{course.teacher.expertise || "Expert Educator"}</p>
            
            <p className="text-xs font-bold text-muted-foreground leading-relaxed">
              Passionate about making education accessible and engaging for everyone.
            </p>
          </div>

          <div className="bg-[#F5C84C] border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-xl uppercase mb-4">Earn a Certificate</h3>
            <p className="font-bold text-sm leading-relaxed mb-6">
              Complete all lessons in this course to earn a shareable digital certificate of completion.
            </p>
            <div className="aspect-[1.4/1] bg-white border-4 border-black p-2 relative shadow-inner">
               <div className="absolute inset-2 border-2 border-black border-dashed flex items-center justify-center flex-col">
                  <div className="w-8 h-8 bg-black rounded-full mb-2"></div>
                  <div className="w-16 h-2 bg-black/20 mb-1"></div>
                  <div className="w-24 h-2 bg-black/20"></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
