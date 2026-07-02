import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import JoinInstitutionClient from "./JoinInstitutionClient";

export default async function InstitutionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  // Fetch the student's institution
  const student = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      institutionId: true,
      institution: { select: { name: true, id: true } },
    },
  });

  // Fetch private (institution) courses assigned to this student
  const privateClasses = await prisma.course.findMany({
    where: {
      isPublic: false,
      enrollments: { some: { userId: decoded.id } },
    },
    include: {
      teacher: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-4">
      <JoinInstitutionClient
        userInstitutionId={student?.institutionId}
        institutionName={student?.institution?.name}
        privateClasses={privateClasses.map((c) => ({
          id: c.id,
          title: c.title,
          subject: c.subject ?? "General",
          thumbnail: c.thumbnail,
          isPublic: c.isPublic,
          teacher: { name: c.teacher?.name ?? "Unknown Teacher" },
          _count: { enrollments: c._count.enrollments },
        }))}
      />
    </div>
  );
}

