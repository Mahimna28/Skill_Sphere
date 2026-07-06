import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // Find users who have set up a username, excluding the current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: decoded.id },
        username: { not: null }
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        image: true,
        isProfilePublic: true,
        lastActiveAt: true
      },
      take: 10,
      orderBy: { lastActiveAt: "desc" }
    });

    // Apply privacy masking for teachers/admins
    const maskedUsers = users.map(user => ({
      ...user,
      isProfilePublic: ["teacher", "superadmin", "institute_admin"].includes(user.role) ? false : user.isProfilePublic,
    }));

    return NextResponse.json({ users: maskedUsers });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch suggestions" }, { status: 500 });
  }
}
