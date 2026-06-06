import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManageCourseClient from "./ManageCourseClient";

export default async function ManageCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } }
      },
      enrollments: {
        include: { user: { select: { id: true, name: true, email: true } } }
      },
      leaveRequests: {
        where: { status: "pending" },
        include: { user: { select: { id: true, name: true, email: true } } }
      },
      assignments: {
        include: { submissions: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!course || course.teacherId !== decoded.id) redirect("/dashboard/teacher/courses");

  // Fetch all lesson completions for this course's modules
  const courseModuleIds = course.modules.map(m => m.id);
  const lessonCompletions = await prisma.lessonCompletion.findMany({
    where: { lesson: { moduleId: { in: courseModuleIds } } }
  });

  // Calculate student progress
  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  const studentsWithProgress = course.enrollments.map(enr => {
    const studentCompletions = lessonCompletions.filter(lc => lc.userId === enr.user.id).length;
    return {
      ...enr.user,
      completedLessons: studentCompletions,
      totalLessons,
      progress: totalLessons === 0 ? 0 : Math.round((studentCompletions / totalLessons) * 100)
    };
  });

  return <ManageCourseClient course={course} studentsProgress={studentsWithProgress} />;
}
