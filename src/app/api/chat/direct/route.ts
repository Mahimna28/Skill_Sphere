import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const otherId = searchParams.get("otherId");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded: any = token ? verifyToken(token) : null;

  if (!decoded || !otherId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const messages = await prisma.privateMessage.findMany({
    where: {
      createdAt: { gte: last24h },
      OR: [
        { senderId: decoded.id, receiverId: otherId },
        { senderId: otherId, receiverId: decoded.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  try {
    const { receiverId, text } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !receiverId || !text) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Check privacy: is the receiver's account private?
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { isProfilePublic: true, name: true, role: true },
    });

    if (!receiver) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Teachers and admins are ALWAYS private, regardless of DB flag
    const isEffectivelyPrivate = ["teacher", "admin"].includes(receiver.role) || !receiver.isProfilePublic;

    if (isEffectivelyPrivate) {
      // Private account: check for an accepted chat request
      const acceptedRequest = await prisma.chatRequest.findFirst({
        where: {
          status: "accepted",
          OR: [
            { senderId: decoded.id, receiverId },
            { senderId: receiverId, receiverId: decoded.id },
          ],
        },
      });

      if (!acceptedRequest) {
        // Also allow if there are existing messages (legacy conversations)
        const existingConvo = await prisma.privateMessage.findFirst({
          where: {
            OR: [
              { senderId: decoded.id, receiverId },
              { senderId: receiverId, receiverId: decoded.id },
            ],
          },
        });

        if (!existingConvo) {
          return NextResponse.json(
            { message: "This user has a private account. Send a chat request first." },
            { status: 403 }
          );
        }
      }
    }

    const message = await prisma.privateMessage.create({
      data: {
        text,
        senderId: decoded.id,
        receiverId,
      },
    });

    // Create notification for the receiver
    const sender = await prisma.user.findUnique({ where: { id: decoded.id }, select: { name: true } });
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "new_message",
        title: "New Message",
        body: `${sender?.name || "Someone"}: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`,
        linkUrl: "/dashboard/chat/direct",
        fromId: decoded.id,
      },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const otherId = searchParams.get("otherId");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !otherId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.privateMessage.deleteMany({
      where: {
        OR: [
          { senderId: decoded.id, receiverId: otherId },
          { senderId: otherId, receiverId: decoded.id },
        ],
      },
    });

    return NextResponse.json({ message: "Conversation deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
