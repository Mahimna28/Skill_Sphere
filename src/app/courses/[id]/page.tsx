import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { select: { name: true, image: true, expertise: true, username: true, bio: true } },
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

  // Fetch suggested courses (max 3)
  let suggestedCourses = await prisma.course.findMany({
    where: { 
      isPublic: true, 
      id: { not: courseId },
      subject: course.subject
    },
    take: 3,
    include: {
      teacher: { select: { name: true } }
    }
  });

  if (suggestedCourses.length < 3) {
    const additionalCourses = await prisma.course.findMany({
      where: {
        isPublic: true,
        id: { notIn: [courseId, ...suggestedCourses.map(c => c.id)] }
      },
      take: 3 - suggestedCourses.length,
      include: {
        teacher: { select: { name: true } }
      }
    });
    suggestedCourses = [...suggestedCourses, ...additionalCourses];
  }

  return (
    <CourseDetailClient 
      course={course} 
      userRole={decoded?.role || null} 
      isEnrolled={isEnrolled}
      suggestedCourses={suggestedCourses}
    />
  );
}
