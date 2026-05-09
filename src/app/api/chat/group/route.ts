import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST: Create a new group
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, memberUsernames } = await req.json();
    if (!name || name.length > 30) {
      return NextResponse.json({ message: "Group name is required (max 30 chars)" }, { status: 400 });
    }

    // Create the group
    const group = await prisma.groupChat.create({
      data: {
        name,
        createdById: decoded.id,
        members: {
          create: { userId: decoded.id, role: "admin", status: "accepted" },
        },
      },
    });

    // Find and invite members by username
    const creator = await prisma.user.findUnique({ where: { id: decoded.id }, select: { name: true } });
    
    if (memberUsernames && Array.isArray(memberUsernames)) {
      for (const username of memberUsernames.slice(0, 49)) {
        const cleanUsername = username.replace(/^@/, "").toLowerCase();
        const user = await prisma.user.findUnique({ where: { username: cleanUsername } });
        if (user && user.id !== decoded.id) {
          await prisma.groupMember.create({
            data: { groupId: group.id, userId: user.id, role: "member", status: "pending" },
          });
          // Send notification
          await prisma.notification.create({
            data: {
              userId: user.id,
              type: "group_invite",
              title: "Group Invite",
              body: `${creator?.name || "Someone"} invited you to join "${name}"`,
              linkUrl: "/dashboard/chat/direct",
              fromId: decoded.id,
            },
          });
        }
      }
    }

    return NextResponse.json({ message: "Group created!", group });
  } catch (error: any) {
    console.error("Group create error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET: List groups the user belongs to (accepted)
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const memberships = await prisma.groupMember.findMany({
      where: { userId: decoded.id, status: "accepted" },
      include: {
        group: {
          include: {
            _count: { select: { members: { where: { status: "accepted" } } } },
            messages: { 
              where: { createdAt: { gte: last24h } },
              orderBy: { createdAt: "desc" }, 
              take: 1, 
              select: { text: true, createdAt: true } 
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const groups = memberships.map(m => ({
      ...m.group,
      myRole: m.role,
      memberCount: m.group._count.members,
      lastMessage: m.group.messages[0] || null,
    }));

    // Also get pending invites
    const pendingInvites = await prisma.groupMember.findMany({
      where: { userId: decoded.id, status: "pending" },
      include: {
        group: { include: { createdBy: { select: { name: true, username: true } } } },
      },
    });

    return NextResponse.json({ groups, pendingInvites });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
