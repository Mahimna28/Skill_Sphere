import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!username) return NextResponse.json({ message: "Username required" }, { status: 400 });

  // Search by username or name (partial match)
  const cleanUsername = username.replace(/^@/, "").toLowerCase();

  const users = await prisma.user.findMany({
    where: {
      id: { not: decoded.id },
      username: { not: null },
      OR: [
        { username: { contains: cleanUsername } },
        { name: { contains: cleanUsername } }
      ]
    },
    select: { id: true, name: true, email: true, username: true, role: true, image: true, isProfilePublic: true },
    take: 10
  });

  if (users.length === 0) {
    return NextResponse.json({ message: "No users found" }, { status: 404 });
  }

  // Teachers and admins are always private
  const responseUsers = users.map(user => ({
    ...user,
    isProfilePublic: ["teacher", "superadmin", "institute_admin"].includes(user.role) ? false : user.isProfilePublic,
  }));

  return NextResponse.json({ users: responseUsers });
}
