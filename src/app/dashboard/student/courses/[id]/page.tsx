import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient";
import StudentClassroomClient from "./StudentClassroomClient";

export default async function CoursePlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  if (decoded.role !== "student") {
    redirect(`/dashboard/${decoded.role}`);
  }

  // 1. Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: decoded.id,
        courseId: id,
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses/${id}`);
  }

  const course = await prisma.course.findUnique({
    where: { id: id },
    include: {
      teacher: { select: { name: true, email: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
      assignments: {
        orderBy: { dueDate: "asc" },
        include: {
          submissions: {
            where: { studentId: decoded.id },
            select: { id: true, content: true, fileUrl: true, createdAt: true, grade: true, feedback: true, status: true }
          }
        }
      },
      topics: {
        include: {
          assignments: { 
            include: { 
              submissions: { where: { studentId: decoded.id } } 
            } 
          },
          quizzes: {
            include: {
              submissions: { where: { userId: decoded.id } }
            }
          },
          materials: true
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
      enrollments: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } }
      },
      coTeachers: { select: { id: true, name: true, email: true, image: true } },
      events: { orderBy: { startTime: "asc" } },
      subjects: { orderBy: { order: "asc" } },
      announcements: { orderBy: { createdAt: "desc" } }
    },
  });

  if (!course) redirect("/dashboard/student/courses");

  if (!course.isPublic) {
    return <StudentClassroomClient course={course} studentId={decoded.id} />;
  }

  // Fetch user's certificate for this public course if it exists
  const earnedCertificate = await prisma.certificate.findFirst({
    where: {
      userId: decoded.id,
      title: `Certificate of Completion: ${course.title}`,
    },
  });

  // Fetch completed lessons for this course
  const completedLessons = await prisma.lessonCompletion.findMany({
    where: {
      userId: decoded.id,
      lesson: { module: { courseId: id } }
    },
    select: { lessonId: true }
  });
  const completedLessonIds = completedLessons.map(cl => cl.lessonId);

  return (
    <CoursePlayerClient 
      course={course} 
      earnedCertificate={earnedCertificate} 
      completedLessonIds={completedLessonIds} 
    />
  );
}
