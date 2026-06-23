import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      children: { select: { email: true, name: true, image: true, id: true } },
      institution: { select: { name: true } },
      department: { select: { name: true } },
      certificates: true,
      _count: {
        select: {
          enrollments: true,
          courses: true,
          marks: true,
        }
      }
    }
  });

  if (!user) redirect("/login");

  // Fetch role-specific data
  let roleData: any = {};
  
  if (user.role === "teacher") {
    const teacherCourses = await prisma.course.findMany({
      where: { teacherId: user.id },
      include: { _count: { select: { enrollments: true } } }
    });
    roleData.totalStudentsTaught = teacherCourses.reduce((sum, c) => sum + c._count.enrollments, 0);
  }

  if (user.role === "student") {
    roleData.recentActivity = await prisma.enrollment.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { enrolledAt: "desc" },
      include: { course: { select: { title: true, subject: true } } }
    });
    
    // Calculate average score if they have marks
    const studentMarks = await prisma.marks.findMany({
      where: { studentId: user.id }
    });
    if (studentMarks.length > 0) {
      const totalScore = studentMarks.reduce((sum, m) => sum + m.score, 0);
      roleData.averageScore = (totalScore / studentMarks.length).toFixed(1);
    }
  }

  if (user.role === "parent") {
    roleData.childrenDetails = await prisma.user.findMany({
      where: { parents: { some: { id: user.id } } },
      include: {
        _count: { select: { enrollments: true } },
        enrollments: { take: 3, include: { course: true } }
      }
    });
  }

  return <ProfileClient user={user} roleData={roleData} />;
}
