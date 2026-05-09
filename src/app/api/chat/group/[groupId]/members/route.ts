import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET: List group members
export async function GET(req: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const { groupId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const members = await prisma.groupMember.findMany({
      where: { groupId, status: "accepted" },
      include: { user: { select: { id: true, name: true, username: true, image: true, role: true } } },
    });

    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: Add new members by username (admin only)
export async function POST(req: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const { groupId } = await params;
    const { usernames } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Check admin
    const adminMember = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: decoded.id } },
    });
    if (!adminMember || adminMember.role !== "admin") {
      return NextResponse.json({ message: "Only group admins can add members" }, { status: 403 });
    }

    const group = await prisma.groupChat.findUnique({ where: { id: groupId } });
    const adder = await prisma.user.findUnique({ where: { id: decoded.id }, select: { name: true } });
    let added = 0;

    for (const username of (usernames || [])) {
      const cleanUsername = username.replace(/^@/, "").toLowerCase();
      const user = await prisma.user.findUnique({ where: { username: cleanUsername } });
      if (user && user.id !== decoded.id) {
        const existing = await prisma.groupMember.findUnique({
          where: { groupId_userId: { groupId, userId: user.id } },
        });
        if (!existing) {
          await prisma.groupMember.create({
            data: { groupId, userId: user.id, status: "pending" },
          });
          await prisma.notification.create({
            data: {
              userId: user.id,
              type: "group_invite",
              title: "Group Invite",
              body: `${adder?.name} invited you to join "${group?.name}"`,
              linkUrl: "/dashboard/chat/direct",
              fromId: decoded.id,
            },
          });
          added++;
        }
      }
    }

    return NextResponse.json({ message: `${added} member(s) invited` });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
