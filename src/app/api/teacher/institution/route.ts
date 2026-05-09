import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || decoded.role !== "teacher") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { institutionId: true }
  });

  if (!teacher?.institutionId) return NextResponse.json({ departments: [] });

  const departments = await prisma.department.findMany({
    where: { institutionId: teacher.institutionId },
    select: { id: true, name: true }
  });

  return NextResponse.json({ departments });
}
