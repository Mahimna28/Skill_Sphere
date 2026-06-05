import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const { userId, role } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    // Only superadmin can promote/demote
    if (!decoded || decoded.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized — Super Admin only" }, { status: 401 });
    }

    const validRoles = ["teacher", "institute_admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ message: `User role updated to ${role}` });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
