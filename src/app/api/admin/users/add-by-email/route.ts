import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const isAdmin = (role: string) => ["superadmin", "institute_admin"].includes(role);

export async function POST(req: Request) {
  try {
    const { email, institutionId, departmentId } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !isAdmin(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "No user found with this Gmail. They must register first." }, { status: 404 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        institutionId,
        departmentId: departmentId || null
      }
    });

    return NextResponse.json({ message: "User added to institution & department!" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
