import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import CourseDetailsClient from "./CourseDetailsClient";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["student", "parent"].includes(decoded.role)) {
    redirect("/login");
  }

  const { id } = await params;

  // Check if student is already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: decoded.id, courseId: id } }
  });

  if (existingEnrollment) {
    // If already enrolled, just redirect to the course player
    redirect(`/dashboard/student/courses/${id}`);
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      modules: { include: { _count: { select: { lessons: true } } } },
      _count: { select: { enrollments: true } }
    }
  });

  if (!course) {
    redirect("/dashboard/student/courses");
  }

  return <CourseDetailsClient course={course} />;
}
