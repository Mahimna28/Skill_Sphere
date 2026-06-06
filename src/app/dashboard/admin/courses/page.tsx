import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import GlobalCoursesClient from "./GlobalCoursesClient";

export default async function AdminGlobalCourses() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "superadmin") {
    redirect("/login");
  }

  const superadmin = await prisma.user.findUnique({ where: { id: decoded.id } });
  
  // Global courses are simply courses created by the superadmin, marked as public
  const courses = await prisma.course.findMany({
    where: { teacherId: decoded.id, isPublic: true },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <GlobalCoursesClient superadmin={superadmin} initialCourses={courses} />;
}
