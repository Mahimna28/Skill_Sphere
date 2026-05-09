import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user?.institutionId) return NextResponse.json({ message: "You are not in an institution" }, { status: 400 });

    const request = await prisma.leaveRequest.create({
      data: {
        userId: decoded.id,
        institutionId: user.institutionId,
        status: "pending"
      }
    });

    return NextResponse.json({ message: "Leave request sent to Admin!", request });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ message: "Leave request already pending" }, { status: 400 });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
