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

  // Search by username (strip @ if included)
  const cleanUsername = username.replace(/^@/, "").toLowerCase();

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: { id: true, name: true, email: true, username: true, role: true, image: true, isProfilePublic: true }
  });

  if (!user) {
    return NextResponse.json({ message: "No user found with this username" }, { status: 404 });
  }

  if (user.id === decoded.id) {
    return NextResponse.json({ message: "You cannot chat with yourself" }, { status: 400 });
  }

  // Teachers and admins are always private
  const responseUser = {
    ...user,
    isProfilePublic: ["teacher", "superadmin", "institute_admin"].includes(user.role) ? false : user.isProfilePublic,
  };

  return NextResponse.json({ user: responseUser });
}
