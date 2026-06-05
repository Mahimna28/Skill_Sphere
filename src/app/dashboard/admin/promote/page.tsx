import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import PromoteClient from "./PromoteClient";

export default async function PromoteAdmins() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  // Only the platform superadmin can access this
  if (!decoded || decoded.role !== "superadmin") redirect("/dashboard/admin");

  const users = await prisma.user.findMany({
    where: { role: { in: ["teacher", "institute_admin"] } },
    select: { id: true, name: true, email: true, role: true, institution: { select: { name: true } } },
    orderBy: { name: "asc" }
  });

  const requests = await prisma.promotionRequest.findMany({
    where: { status: "pending" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" }
  });

  return <PromoteClient users={users} initialRequests={requests} />;
}
