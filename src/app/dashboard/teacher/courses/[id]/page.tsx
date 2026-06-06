import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManageCourseClient from "./ManageCourseClient";

export default async function ManageCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin"].includes(decoded.role)) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } }
      },
      enrollments: {
        include: { user: { select: { id: true, name: true, email: true } } }
      },
      leaveRequests: {
        where: { status: "pending" },
        include: { user: { select: { id: true, name: true, email: true } } }
      }
    }
  });

  if (!course || course.teacherId !== decoded.id) redirect("/dashboard/teacher/courses");

  return <ManageCourseClient course={course} />;
}
