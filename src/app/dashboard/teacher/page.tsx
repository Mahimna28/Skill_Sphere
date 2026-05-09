import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import TeacherOverviewClient from "./TeacherOverviewClient";

export default async function TeacherDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  let courses: any[] = [];
  let teacher: any = null;

  if (decoded?.id) {
    teacher = await prisma.user.findUnique({ where: { id: decoded.id } });
    courses = await prisma.course.findMany({
      where: { teacherId: decoded.id, isPublic: true },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return <TeacherOverviewClient teacher={teacher} initialCourses={courses} />;
}
