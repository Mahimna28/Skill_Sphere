import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!id) return NextResponse.json({ message: "User ID required" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, username: true, role: true, image: true, isProfilePublic: true, lastActiveAt: true },
  });

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const responseUser = {
    ...user,
    isProfilePublic: ["teacher", "superadmin", "institute_admin"].includes(user.role) ? false : user.isProfilePublic,
  };

  return NextResponse.json({ user: responseUser });
}
