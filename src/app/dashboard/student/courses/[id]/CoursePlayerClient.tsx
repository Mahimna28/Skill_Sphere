"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, PlayCircle, BookText, ArrowLeft, Trophy, Download, File, Award } from "lucide-react";
import Link from "next/link";

export default function CoursePlayerClient({ course }: { course: any }) {
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const [activeLesson, setActiveLesson] = useState(allLessons[0] || null);
  const [loading, setLoading] = useState(false);
  const [completedCertId, setCompletedCertId] = useState<string | null>(null);

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
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-accent p-6 rounded-full border-4 border-black mb-6">
          <BookText size={48} />
        </div>
        <h2 className="text-3xl font-black">No content available yet.</h2>
        <p className="text-muted-foreground mt-2">The teacher is still preparing this course.</p>
        <Link href="/dashboard/student/courses">
          <Button className="mt-6 neo-brutalism">Go Back</Button>
        </Link>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id);
  const isLastLesson = currentIndex === allLessons.length - 1;

  if (completedCertId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] text-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-[#F5C84C] text-black border-4 border-black rounded-full flex items-center justify-center mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Award size={64} />
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Course Finished!</h2>
        <p className="text-xl font-bold text-muted-foreground mb-8 max-w-xl">
          Congratulations! You have successfully completed all modules in this course and earned a new certificate.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/student/courses">
            <Button variant="outline" className="h-14 px-8 font-black border-4 border-black text-lg">
              Back to Dashboard
            </Button>
          </Link>
          <Link href={`/certificates/${completedCertId}`} target="_blank">
            <Button className="neo-brutalism bg-[#4F7DF3] text-white h-14 px-8 font-black text-lg">
              View Certificate
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)]">
      {/* 1. Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none pb-12">
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard/student/courses" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1 border-2 border-black rounded-full text-xs font-black">
            <Trophy size={14} className="text-primary" /> +50 POINTS EARNED
          </div>
        </div>
        
        <h2 className="text-4xl font-black uppercase tracking-tighter">{activeLesson.title}</h2>
        
        {/* Video Player or Notes Only View */}
        {activeLesson.videoUrl ? (
          <div className="aspect-video w-full bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden relative group">
            <iframe
              src={activeLesson.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="aspect-[21/9] w-full bg-accent/10 border-4 border-black border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8">
             <div className="w-16 h-16 rounded-full bg-white border-2 border-black flex items-center justify-center mb-4">
                <BookText size={32} />
             </div>
             <p className="text-xl font-black uppercase">Lecture Notes Only</p>
             <p className="text-sm font-bold text-muted-foreground mt-1">This lesson is reading-based. No video content available.</p>
          </div>
        )}

        <div className="neo-brutalism bg-white p-8 space-y-4">
          <h3 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">Lesson Overview</h3>
          <p className="text-lg font-medium text-black/70 leading-relaxed">
            {activeLesson.content || "This lesson contains essential information to build your foundation in this subject."}
          </p>

          {activeLesson.fileUrl && (
            <div className="mt-8 p-6 bg-accent/20 border-4 border-black rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
               <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                     <File size={32} className="text-primary" />
                  </div>
                  <div>
                     <h4 className="font-black uppercase text-sm">Academic Materials Attached</h4>
                     <p className="text-xs font-bold text-muted-foreground uppercase">{activeLesson.fileType || "Document"} FILE READY</p>
                  </div>
               </div>
               <a href={activeLesson.fileUrl} download className="w-full md:w-auto">
                 <Button className="w-full neo-brutalism bg-[#F5C84C] text-black font-black h-14 px-8 uppercase flex items-center gap-2">
                   <Download size={20} /> Download Materials
                 </Button>
               </a>
            </div>
          )}

          <div className="pt-6 flex justify-between items-center border-t-2 border-black border-dashed">
            <Button 
              variant="outline" 
              className="font-bold border-2 border-black" 
              disabled={allLessons.findIndex((l: any) => l.id === activeLesson?.id) === 0}
              onClick={handlePrevious}
            >
               Previous Lesson
            </Button>
            <Button 
              className="neo-brutalism bg-[#34D399] font-black h-12 px-8"
              onClick={handleComplete}
              disabled={loading}
            >
               {loading ? "Completing..." : (isLastLesson ? "Finish Course" : "Complete & Next")}
            </Button>
          </div>
        </div>

        {/* Assignments Section */}
        {course.assignments && course.assignments.length > 0 && (
          <div className="neo-brutalism bg-[#F5C84C] p-8 space-y-6 mt-8">
            <h3 className="text-2xl font-black border-b-4 border-black pb-2 inline-block">Course Assignments</h3>
            <div className="space-y-4">
              {course.assignments.map((assignment: any) => (
                <div key={assignment.id} className="bg-white border-4 border-black p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                  <div>
                    <h4 className="text-lg font-black uppercase">{assignment.title}</h4>
                    <p className="text-xs font-bold text-red-600 mb-2">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
                    <p className="text-sm font-medium">{assignment.description}</p>
                  </div>
                  {new Date() > new Date(assignment.dueDate) ? (
                    <Button disabled className="neo-brutalism font-black border-2 border-black whitespace-nowrap opacity-50 bg-gray-300 text-black">
                      Deadline Passed
                    </Button>
                  ) : (
                    <Button className="neo-brutalism font-black border-2 border-black whitespace-nowrap" onClick={() => alert("Submission UI coming soon!")}>
                      Submit Work
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Sidebar - Course Content */}
      <aside className="w-full lg:w-80 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b-4 border-black bg-primary text-white">
          <h3 className="text-xl font-black uppercase tracking-tight line-clamp-1">{course.title}</h3>
          <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">{course.subject}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {course.modules.map((module: any) => (
            <div key={module.id} className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-black rounded-full" /> {module.title}
              </h4>
              <div className="space-y-1">
                {module.lessons.map((lesson: any) => {
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        isActive 
                          ? "bg-accent border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" 
                          : "border-transparent hover:bg-muted"
                      }`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${isActive ? "bg-white" : "bg-muted"}`}>
                        {lesson.videoUrl ? <PlayCircle size={16} /> : <BookText size={16} />}
                      </div>
                      <span className={`text-sm font-bold line-clamp-1 ${isActive ? "text-black" : "text-slate-600"}`}>
                        {lesson.title}
                      </span>
                      {isActive && <ChevronRight size={14} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
