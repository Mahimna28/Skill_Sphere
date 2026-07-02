import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminOverviewClient from "./AdminOverviewClient";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded?.role !== "superadmin") {
    redirect("/login");
  }

  // Fetch REAL stats
  const [userCount, instCount, courseCount, teacherCount] = await Promise.all([
    prisma.user.count(),
    prisma.institution.count(),
    prisma.course.count(),
    prisma.user.count({ where: { role: "teacher" } })
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { name: true, email: true, role: true, createdAt: true }
  });

  return (
    <AdminOverviewClient 
      userCount={userCount}
      instCount={instCount}
      courseCount={courseCount}
      teacherCount={teacherCount}
      recentUsers={recentUsers}
    />
  );
}
