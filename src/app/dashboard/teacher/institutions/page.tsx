import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import JoinInstitutionClient from "./JoinInstitutionClient";

export default async function TeacherInstitutions() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) redirect("/login");

  const teacher = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      department: true,
      institution: {
        include: { _count: { select: { members: true } } }
      },
      courses: {
        where: { isPublic: false },
        include: { _count: { select: { enrollments: true } } },
        orderBy: { createdAt: "desc" },
      }
    }
  });

  const institutions = await prisma.institution.findMany({
    select: { id: true, name: true, _count: { select: { members: true } } }
  });

  return (
    <JoinInstitutionClient 
      institutions={institutions} 
      userInstitutionId={teacher?.institutionId} 
      teacherData={teacher}
    />
  );
}
