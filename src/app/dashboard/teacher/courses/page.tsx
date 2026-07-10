import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherCoursesClient from "./TeacherCoursesClient";

export default async function TeacherCoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
    redirect("/login");
  }

  const allCourses = decoded?.id
    ? await prisma.course.findMany({
        where: {
          OR: [
            { teacherId: decoded.id },
            { coTeachers: { some: { id: decoded.id } } }
          ]
        },
        include: { _count: { select: { enrollments: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const publicCourses = allCourses.filter(c => c.isPublic);
  const privateClasses = allCourses.filter(c => !c.isPublic);

  return <TeacherCoursesClient courses={publicCourses} classes={privateClasses} />;
}
