import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient";

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
            select: { id: true, content: true, fileUrl: true, createdAt: true, grade: true, feedback: true }
          }
        }
      }
    },
  });

  if (!course) redirect("/dashboard/student/courses");

  // Fetch user's certificate for this course if it exists
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

