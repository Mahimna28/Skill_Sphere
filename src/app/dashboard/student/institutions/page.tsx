import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import JoinInstitutionClient from "./JoinInstitutionClient";

export default async function StudentInstitutions() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "student") redirect("/login");

  let user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      institutionId: true,
      institution: { select: { id: true, name: true } },
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              subject: true,
              thumbnail: true,
              isPublic: true,
              teacher: { select: { name: true, institutionId: true } },
              _count: { select: { enrollments: true } },
            },
          },
        },
      },
    },
  });

  // --- Backfill: if student has no institution but is in a private class, auto-assign ---
  if (!user?.institutionId) {
    const privateEnrollment = user?.enrollments.find(
      (e) => !e.course.isPublic && e.course.teacher.institutionId
    );
    if (privateEnrollment) {
      const teacherInstitutionId = privateEnrollment.course.teacher.institutionId!;
      await prisma.user.update({
        where: { id: decoded.id },
        data: { institutionId: teacherInstitutionId },
      });
      // Re-fetch with updated institution data
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          institutionId: true,
          institution: { select: { id: true, name: true } },
          enrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  subject: true,
                  thumbnail: true,
                  isPublic: true,
                  teacher: { select: { name: true, institutionId: true } },
                  _count: { select: { enrollments: true } },
                },
              },
            },
          },
        },
      });
    }
  }

  // Fetch all public institutions available for enrollment
  const allInstitutions = await prisma.institution.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { members: true, departments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch user's pending join requests
  const pendingRequests = await prisma.joinRequest.findMany({
    where: { userId: decoded.id, status: "pending" },
    select: { institutionId: true },
  });
  const pendingIds = pendingRequests.map((r) => r.institutionId);

  // Private classes = courses they're enrolled in that are NOT public (teacher assigned)
  const privateClasses = (user?.enrollments ?? [])
    .map((e) => e.course)
    .filter((c) => !c.isPublic);

  return (
    <JoinInstitutionClient
      userInstitutionId={user?.institutionId}
      institutionName={user?.institution?.name}
      privateClasses={privateClasses}
      allInstitutions={allInstitutions}
      pendingIds={pendingIds}
    />
  );
}
