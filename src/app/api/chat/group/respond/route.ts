import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST: Accept or reject a group invite
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { groupId, action } = await req.json();
    if (!groupId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: decoded.id } },
    });

    if (!membership || membership.status !== "pending") {
      return NextResponse.json({ message: "No pending invite found" }, { status: 404 });
    }

    if (action === "accept") {
      await prisma.groupMember.update({
        where: { id: membership.id },
        data: { status: "accepted" },
      });
    } else {
      await prisma.groupMember.delete({ where: { id: membership.id } });
    }

    return NextResponse.json({ message: `Invite ${action}ed` });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
