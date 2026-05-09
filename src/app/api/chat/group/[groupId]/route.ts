import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET: Fetch group messages
export async function GET(req: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const { groupId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Check membership
    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: decoded.id } },
    });
    if (!member || member.status !== "accepted") {
      return NextResponse.json({ message: "You are not a member of this group" }, { status: 403 });
    }

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const messages = await prisma.groupMessage.findMany({
      where: { 
        groupId,
        createdAt: { gte: last24h }
      },
      include: { sender: { select: { id: true, name: true, username: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    const group = await prisma.groupChat.findUnique({
      where: { id: groupId },
      include: {
        createdBy: { select: { name: true, username: true } },
        _count: { select: { members: { where: { status: "accepted" } } } },
      },
    });

    return NextResponse.json({ messages, group });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: Send a message to the group
export async function POST(req: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const { groupId } = await params;
    const { text } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !text) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    // Check membership
    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: decoded.id } },
    });
    if (!member || member.status !== "accepted") {
      return NextResponse.json({ message: "You are not a member of this group" }, { status: 403 });
    }

    const message = await prisma.groupMessage.create({
      data: { text, groupId, senderId: decoded.id },
      include: { sender: { select: { id: true, name: true, username: true, image: true } } },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
