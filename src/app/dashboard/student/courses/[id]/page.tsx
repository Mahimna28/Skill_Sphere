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
    // If not enrolled, redirect back to course details page so they can enroll
    redirect(`/courses/${id}`);
  }

  // 2. Fetch course with modules and lessons
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
        orderBy: { dueDate: "asc" }
      }
    },
  });

  if (!course) redirect("/dashboard/student/courses");

  return <CoursePlayerClient course={course} />;
}
