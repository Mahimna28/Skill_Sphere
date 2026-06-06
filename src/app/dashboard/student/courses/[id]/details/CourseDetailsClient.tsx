"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Loader2, Trophy, Users, LayoutList } from "lucide-react";
import Link from "next/link";

interface Props {
  course: any;
}

export default function CourseDetailsClient({ course }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-4 duration-300 ${toast.type === "success" ? "bg-secondary text-black" : "bg-[#ef4444] text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Header / Back */}
      <Link href="/dashboard/student/courses" className="inline-flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      {/* Hero Section */}
      <div className="neo-brutalism bg-white overflow-hidden flex flex-col md:flex-row border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
        <div className="w-full md:w-1/2 aspect-video bg-primary/10 border-b-4 md:border-b-0 md:border-r-4 border-black relative">
          {course.thumbnail ? (
             <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={64} className="text-primary opacity-20" />
             </div>
          )}
          <div className="absolute top-4 left-4 bg-accent border-2 border-black text-black text-sm font-black px-3 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
            {course.subject}
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">{course.title}</h1>
          <p className="text-muted-foreground font-bold text-lg flex items-center gap-2 mb-8">
            <span className="w-8 h-8 rounded-full bg-primary/20 border-2 border-black flex items-center justify-center text-sm">👨‍🏫</span>
            {course.teacher.name}
          </p>
          
          <Button
            className="w-full h-16 text-xl font-black neo-brutalism bg-[#4F7DF3] text-white hover:bg-[#4F7DF3]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all"
            onClick={handleEnroll}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Enrolling...</>
            ) : (
              "Enroll Now For Free"
            )}
          </Button>
        </div>
      </div>

      {/* Details & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="neo-brutalism bg-[#F5C84C] border-4 border-black p-8 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase mb-4 border-b-4 border-black pb-2 inline-block">About This Course</h2>
            <p className="text-xl font-medium leading-relaxed whitespace-pre-wrap">
               {course.details || course.description}
            </p>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-6">
          <div className="neo-brutalism bg-white border-4 border-black p-6 rounded-2xl flex items-center gap-4">
             <div className="w-14 h-14 bg-[#34D399] border-4 border-black rounded-xl flex items-center justify-center">
                <LayoutList size={24} />
             </div>
             <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Content</p>
                <p className="text-2xl font-black">{course.modules.length} Modules</p>
             </div>
          </div>

          <div className="neo-brutalism bg-white border-4 border-black p-6 rounded-2xl flex items-center gap-4">
             <div className="w-14 h-14 bg-[#F9A8D4] border-4 border-black rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
             </div>
             <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Curriculum</p>
                <p className="text-2xl font-black">{totalLessons} Lessons</p>
             </div>
          </div>

          <div className="neo-brutalism bg-white border-4 border-black p-6 rounded-2xl flex items-center gap-4">
             <div className="w-14 h-14 bg-[#4F7DF3] text-white border-4 border-black rounded-xl flex items-center justify-center">
                <Users size={24} />
             </div>
             <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Students</p>
                <p className="text-2xl font-black">{course._count.enrollments} Enrolled</p>
             </div>
          </div>

          <div className="neo-brutalism bg-white border-4 border-black p-6 rounded-2xl flex items-center gap-4">
             <div className="w-14 h-14 bg-secondary border-4 border-black rounded-xl flex items-center justify-center">
                <Trophy size={24} />
             </div>
             <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Rewards</p>
                <p className="text-2xl font-black">+50 Points</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
