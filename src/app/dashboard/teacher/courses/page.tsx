import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherCoursesClient from "./TeacherCoursesClient";

export default async function TeacherCoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin"].includes(decoded.role)) {
    redirect("/login");
  }

  const courses = decoded?.id
    ? await prisma.course.findMany({
        where: { teacherId: decoded.id, isPublic: true },
        include: { _count: { select: { enrollments: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return <TeacherCoursesClient courses={courses} />;
}
