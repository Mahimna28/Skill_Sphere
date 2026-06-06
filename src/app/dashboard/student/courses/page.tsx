import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { BookOpen } from "lucide-react";
import CoursesClient from "./CoursesClient";

export default async function StudentCourses() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const [allCourses, enrollments, leaveRequests, lessonCompletions] = await Promise.all([
    prisma.course.findMany({
      include: { 
        teacher: { select: { name: true } }, 
        _count: { select: { enrollments: true, modules: true } },
        modules: { include: { _count: { select: { lessons: true } } } }
      },
      orderBy: { createdAt: "asc" },
    }),
    decoded?.id
      ? prisma.enrollment.findMany({ where: { userId: decoded.id }, select: { courseId: true } })
      : Promise.resolve([]),
    decoded?.id
      ? prisma.courseLeaveRequest.findMany({ where: { userId: decoded.id, status: "pending" } })
      : Promise.resolve([]),
    decoded?.id
      ? prisma.lessonCompletion.findMany({
          where: { userId: decoded.id },
          include: { lesson: { select: { moduleId: true } } }
        })
      : Promise.resolve([]),
  ]);

  const enrolledIds = enrollments.map((e) => e.courseId);
  const pendingLeaveCourseIds = leaveRequests.map((r) => r.courseId);

  // Calculate progress for each course
  const enrolledCourses = allCourses.filter(c => enrolledIds.includes(c.id)).map(course => {
    const totalLessons = course.modules.reduce((sum, mod) => sum + mod._count.lessons, 0);
    // Find completions for lessons in this course's modules
    const courseModuleIds = course.modules.map(m => m.id);
    const completedLessons = lessonCompletions.filter(lc => courseModuleIds.includes(lc.lesson.moduleId)).length;
    
    return {
      ...course,
      totalLessons,
      completedLessons,
      progress: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
    };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <BookOpen size={32} />
          </div>
          My Courses
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Here are the courses you are currently enrolled in. Keep learning and earn your points!
        </p>
      </div>
      <CoursesClient courses={enrolledCourses} enrolledIds={enrolledIds} pendingLeaveCourseIds={pendingLeaveCourseIds} />
    </div>
  );
}
