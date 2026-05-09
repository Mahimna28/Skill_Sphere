"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Loader2, CheckCircle } from "lucide-react";

const courseColors = [
  { bg: "bg-primary/20", badge: "bg-primary text-white" },
  { bg: "bg-secondary/20", badge: "bg-secondary text-black" },
  { bg: "bg-accent/20", badge: "bg-accent text-black" },
  { bg: "bg-[#F9A8D4]/30", badge: "bg-[#F9A8D4] text-black" },
];

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail: string | null;
  teacher: { name: string };
  _count: { enrollments: number };
  isPublic?: boolean;
}

interface Props {
  courses: Course[];
  enrolledIds: string[];
  pendingLeaveCourseIds?: string[];
}

export default function CoursesClient({ courses, enrolledIds: initialEnrolledIds, pendingLeaveCourseIds = [] }: Props) {
  const router = useRouter();
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set(initialEnrolledIds));
  const [pendingLeave, setPendingLeave] = useState<Set<string>>(new Set(pendingLeaveCourseIds));
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEnroll = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setEnrolledIds((prev) => new Set([...prev, courseId]));
        showToast("🎉 Enrolled! +50 points awarded!", "success");
        router.refresh();
      } else {
        showToast(data.message || "Enrollment failed", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "DELETE" });
      if (res.ok) {
        setEnrolledIds((prev) => { const s = new Set(prev); s.delete(courseId); return s; });
        showToast("Unenrolled from course.", "success");
        router.refresh();
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRequestLeave = async (courseId: string) => {
    setLoadingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/leave-request`, { method: "POST" });
      if (res.ok) {
        setPendingLeave((prev) => new Set([...prev, courseId]));
        showToast("Leave request sent to teacher.", "success");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to send request.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="relative">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl border-4 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-4 duration-300 ${toast.type === "success" ? "bg-secondary text-black" : "bg-[#ef4444] text-white"}`}>
          {toast.message}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="py-24 text-center border-4 border-dashed border-gray-300 rounded-2xl bg-white">
          <BookOpen className="h-20 w-20 mx-auto text-muted-foreground/20 mb-4" />
          <h3 className="text-2xl font-black mb-2">No Courses Available</h3>
          <p className="text-muted-foreground font-medium">Check back soon — new courses are being added!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => {
            const color = courseColors[i % courseColors.length];
            const isEnrolled = enrolledIds.has(course.id);
            const isLoading = loadingId === course.id;

            return (
              <Card key={course.id} className="flex flex-col overflow-hidden neo-brutalism bg-white hover:translate-x-1 hover:-translate-y-1 transition-transform">
                {/* Thumbnail */}
                <div className={`h-44 ${color.bg} border-b-2 border-black flex items-center justify-center relative overflow-hidden`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="h-16 w-16 opacity-20" />
                  )}
                  {isEnrolled && (
                    <div className="absolute top-3 right-3 bg-secondary text-black text-xs font-black px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Enrolled
                    </div>
                  )}
                  <div className={`absolute top-3 left-3 text-xs font-black px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${color.badge}`}>
                    {course.subject}
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-black">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 border border-black flex items-center justify-center text-xs">👨‍🏫</span>
                    {course.teacher.name}
                    <span className="ml-auto text-xs font-bold">{course._count.enrollments} students</span>
                  </p>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium line-clamp-3">{course.description}</p>
                </CardContent>

                <CardFooter className="p-4 border-t-2 border-black bg-muted/30 flex gap-2">
                  {isEnrolled ? (
                    <>
                      <Button 
                        className="flex-1 font-bold neo-brutalism bg-secondary text-black hover:bg-secondary/90" 
                        disabled={isLoading}
                        onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" /> Continue
                      </Button>
                      {course.isPublic ? (
                        <Button
                          variant="outline"
                          className="font-bold border-2 border-black text-xs px-3"
                          onClick={() => handleUnenroll(course.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave"}
                        </Button>
                      ) : (
                        pendingLeave.has(course.id) ? (
                          <Button variant="outline" disabled className="font-bold border-2 border-black text-xs px-3 opacity-50">
                            Pending
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="font-bold border-2 border-black text-xs px-3 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            onClick={() => handleRequestLeave(course.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Req. Leave"}
                          </Button>
                        )
                      )}
                    </>
                  ) : (
                    <Button
                      className="w-full font-bold neo-brutalism"
                      onClick={() => handleEnroll(course.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...</>
                      ) : (
                        "Enroll Now — Free"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
