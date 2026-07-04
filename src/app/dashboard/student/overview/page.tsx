import React from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import StudentOverviewClient from "../StudentOverviewClient";

export default async function StudentOverviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  let enrollments: any[] = [];
  let marks: any[] = [];
  let certificates: any[] = [];
  let user: any = null;

  if (decoded?.id) {
    user = await prisma.user.findUnique({ where: { id: decoded.id } });
    const rawEnrollments = await prisma.enrollment.findMany({
      where: { userId: decoded.id },
      include: { course: { include: { teacher: { select: { name: true } } } } },
    });
    enrollments = rawEnrollments.map((e) => ({
      id: e.course.id,
      title: e.course.title,
      progress: e.progress,
      teacher: e.course.teacher?.name || "Instructor",
      thumbnail: e.course.thumbnail || null,
    }));
    marks = await prisma.marks.findMany({ where: { studentId: decoded.id } });
    certificates = await prisma.certificate.findMany({
      where: { userId: decoded.id },
      orderBy: { issueDate: "desc" },
    });
  }

  const safeUser = {
    name: user?.name || "Student",
    points: user?.points || 0,
    studyHours: user?.studyHours || 0,
    currentStreak: user?.currentStreak || 0,
    level: Math.floor((user?.points || 0) / 100) + 1,
  };

  return (
    <StudentOverviewClient
      user={safeUser}
      enrollments={enrollments}
      marks={marks}
      certificates={certificates}
    />
  );
}
