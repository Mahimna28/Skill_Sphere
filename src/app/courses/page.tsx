import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import CoursesPageClient from "./CoursesPageClient";

export default async function CoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const [allCourses, enrollments] = await Promise.all([
    prisma.course.findMany({
      where: { isPublic: true },
      include: { teacher: { select: { name: true } }, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "asc" },
    }),
    decoded?.id
      ? prisma.enrollment.findMany({ where: { userId: decoded.id }, select: { courseId: true } })
      : Promise.resolve([]),
  ]);

  const enrolledIds = enrollments.map((e) => e.courseId);

  return (
    <CoursesPageClient 
      courses={allCourses} 
      userRole={decoded?.role || null} 
      initialEnrolledIds={enrolledIds} 
    />
  );
}
