import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import CoursesClient from "./CoursesClient";

export default async function StudentCourses() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const [allCourses, enrollments, leaveRequests, lessonCompletions, certificates] = await Promise.all([
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
    decoded?.id
      ? prisma.certificate.findMany({ where: { userId: decoded.id } })
      : Promise.resolve([]),
  ]);

  const enrolledIds = enrollments.map((e) => e.courseId);
  const pendingLeaveCourseIds = leaveRequests.map((r) => r.courseId);

  const enrolledAll = allCourses.filter(c => enrolledIds.includes(c.id)).map(course => {
    const totalLessons = course.modules.reduce((sum, mod) => sum + mod._count.lessons, 0);
    const courseModuleIds = course.modules.map(m => m.id);
    const completedLessons = lessonCompletions.filter(lc => courseModuleIds.includes(lc.lesson.moduleId)).length;
    const cert = certificates.find(c => c.title === `Certificate of Completion: ${course.title}`);
    
    return {
      ...course,
      totalLessons,
      completedLessons,
      progress: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
      certificateId: cert?.id
    };
  });

  const enrolledCourses = enrolledAll.filter(c => c.isPublic);
  const enrolledClasses = enrolledAll.filter(c => !c.isPublic);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      <CoursesClient
        courses={enrolledCourses}
        classes={enrolledClasses}
        enrolledIds={enrolledIds}
        pendingLeaveCourseIds={pendingLeaveCourseIds}
      />
    </div>
  );
}
