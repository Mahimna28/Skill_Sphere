import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManageCourseClient from "./ManageCourseClient";
import ClassroomClient from "./ClassroomClient";

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
        include: { user: { select: { id: true, name: true, email: true, image: true, department: { select: { name: true } } } } }
      },
      leaveRequests: {
        where: { status: "pending" },
        include: { user: { select: { id: true, name: true, email: true } } }
      },
      assignments: {
        include: {
          submissions: true,
          topic: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: "desc" }
      },
      topics: {
        include: {
          assignments: { include: { submissions: true } },
          materials: true,
          quizzes: { include: { submissions: true } }
        },
        orderBy: { order: "asc" }
      },
      materials: { orderBy: { createdAt: "desc" } },
      questions: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: { include: { author: { select: { id: true, name: true, image: true } } } }
        },
        orderBy: { createdAt: "desc" }
      },
      coTeachers: { select: { id: true, name: true, email: true, image: true } },
      events: { orderBy: { startTime: "asc" } },
      subjects: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { assignments: true, materials: true, quizzes: true, questions: true } }
        }
      },
      teacher: { select: { id: true, name: true, email: true, image: true } },
      announcements: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!course) redirect("/dashboard/teacher/courses");

  const isCoTeacher = course.coTeachers.some(t => t.id === decoded.id);

  if (course.teacherId !== decoded.id && !isCoTeacher && decoded.role !== "superadmin" && decoded.role !== "institute_admin") {
    redirect("/dashboard/teacher/courses");
  }

  // BRANCH: private class → Classroom UI, public course → legacy UI
  if (!course.isPublic) {
    return <ClassroomClient course={course as any} isPrimaryTeacher={course.teacherId === decoded.id} currentUserId={decoded.id} />;
  }

  // Public course — legacy management UI
  const courseModuleIds = course.modules.map(m => m.id);
  const lessonCompletions = await prisma.lessonCompletion.findMany({
    where: { lesson: { moduleId: { in: courseModuleIds } } }
  });

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
