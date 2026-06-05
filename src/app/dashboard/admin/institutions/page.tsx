import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import InstitutionsClient from "./InstitutionsClient";

export default async function AdminInstitutions() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["superadmin", "institute_admin"].includes(decoded.role)) redirect("/login");

  if (decoded.role === "superadmin") {
    redirect("/dashboard/admin/system");
  }

  const institutions = await prisma.institution.findMany({
    where: { adminId: decoded.id },
    include: {
      departments: { include: { _count: { select: { courses: true } } } },
      _count: { select: { members: true, joinRequests: true } },
    },
  });

  return <InstitutionsClient initialInstitutions={institutions} />;
}
