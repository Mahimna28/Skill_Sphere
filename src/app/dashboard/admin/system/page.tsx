import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import SystemClient from "./SystemClient";

export default async function SystemControl() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "superadmin") {
    redirect("/login");
  }

  // Fetch all users with basic info and relationships
  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      institution: { select: { id: true, name: true } },
    }
  });

  // Fetch all institutions
  const allInstitutions = await prisma.institution.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { name: true, email: true } },
      _count: { select: { members: true, departments: true } }
    }
  });

  return <SystemClient initialUsers={allUsers} initialInstitutions={allInstitutions} />;
}
