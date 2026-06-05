import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManageUsersClient from "./ManageUsersClient";

export default async function AdminUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !["superadmin", "institute_admin"].includes(decoded.role)) redirect("/login");

  const institutions = await prisma.institution.findMany({
    include: {
      departments: true,
      members: { select: { id: true, name: true, email: true, role: true, department: { select: { name: true } } } },
      joinRequests: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
      leaveRequests: { include: { user: { select: { id: true, name: true, email: true, role: true } } } }
    }
  });

  return <ManageUsersClient initialInstitutions={institutions} />;
}
