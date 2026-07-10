import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import InstituteClient from "./InstituteClient";

export default async function AdminInstitute() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["superadmin", "institute_admin"].includes(decoded.role)) redirect("/login");

  if (decoded.role === "superadmin") {
    redirect("/dashboard/admin/system");
  }

  // Fetch the user to get their institutionId
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { institutionId: true, role: true }
  });

  // If the user belongs to an institution and is an institute_admin, let them manage it.
  // Otherwise, fallback to checking if they own one (for first time creation).
  const queryWhere = (user?.role === "institute_admin" && user?.institutionId)
    ? { id: user.institutionId }
    : { adminId: decoded.id };

  // Fetch the institution along with departments, members, and requests
  const institutions = await prisma.institution.findMany({
    where: queryWhere,
    include: {
      departments: { include: { _count: { select: { courses: { where: { isPublic: false } } } } } },
      members: { select: { id: true, name: true, email: true, role: true, department: { select: { name: true } } } },
      joinRequests: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
      leaveRequests: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
      _count: { select: { members: true, joinRequests: true } },
    },
  });

  return <InstituteClient initialInstitutions={institutions} />;
}
