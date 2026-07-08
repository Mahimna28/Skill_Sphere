import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeacherStudentsClient from "./TeacherStudentsClient";

export default async function TeacherStudents() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) redirect("/login");

  // Fetch real enrollments for this teacher's courses
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { teacherId: decoded.id }
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } }
    },
    orderBy: { enrolledAt: "desc" }
  });

  return <TeacherStudentsClient enrollments={enrollments} />;
}
