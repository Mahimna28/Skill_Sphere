import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: { select: { name: true, image: true, expertise: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" }, select: { id: true, title: true, fileType: true } }
        }
      },
      _count: { select: { enrollments: true } }
    }
  });

  if (!course || !course.isPublic) notFound();

  // Check if current user is enrolled
  let isEnrolled = false;
  if (decoded?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: decoded.id, courseId: course.id } }
    });
    if (enrollment) isEnrolled = true;
  }

  return (
    <CourseDetailClient 
      course={course} 
      userRole={decoded?.role || null} 
      isEnrolled={isEnrolled} 
    />
  );
}
