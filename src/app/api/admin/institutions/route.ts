import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const isAdmin = (role: string) => ["superadmin", "institute_admin"].includes(role);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !isAdmin(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const institutions = await prisma.institution.findMany({
    include: {
      departments: { include: { _count: { select: { courses: { where: { isPublic: false } } } } } },
      _count: { select: { members: true, joinRequests: true } },
    },
  });

  return NextResponse.json({ institutions });
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !isAdmin(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const institution = await prisma.institution.create({
      data: { name, adminId: decoded.id },
    });

    await prisma.user.update({
      where: { id: decoded.id },
      data: { institutionId: institution.id },
    });

    return NextResponse.json({ message: "Institution created!", institution });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
