import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST: Send a chat request
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { receiverId } = await req.json();
    if (!receiverId) return NextResponse.json({ message: "Receiver ID required" }, { status: 400 });
    if (receiverId === decoded.id) return NextResponse.json({ message: "Cannot send request to yourself" }, { status: 400 });

    // Check if a request already exists in either direction
    const existing = await prisma.chatRequest.findFirst({
      where: {
        OR: [
          { senderId: decoded.id, receiverId },
          { senderId: receiverId, receiverId: decoded.id },
        ],
      },
    });

    if (existing) {
      if (existing.status === "accepted") {
        return NextResponse.json({ message: "Already connected", status: "accepted" });
      }
      if (existing.status === "pending") {
        return NextResponse.json({ message: "Request already pending", status: "pending" });
      }
    }

    const sender = await prisma.user.findUnique({ where: { id: decoded.id }, select: { name: true } });

    // Create the chat request
    const chatRequest = await prisma.chatRequest.create({
      data: { senderId: decoded.id, receiverId },
    });

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "chat_request",
        title: "New Chat Request",
        body: `${sender?.name || "Someone"} wants to chat with you.`,
        linkUrl: "/dashboard/chat/direct",
        fromId: decoded.id,
      },
    });

    return NextResponse.json({ message: "Chat request sent!", chatRequest });
  } catch (error: any) {
    console.error("Chat request error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET: Fetch chat requests for the logged-in user
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const received = await prisma.chatRequest.findMany({
      where: { receiverId: decoded.id, status: "pending" },
      include: { sender: { select: { id: true, name: true, email: true, image: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    const sent = await prisma.chatRequest.findMany({
      where: { senderId: decoded.id, status: "pending" },
      include: { receiver: { select: { id: true, name: true, email: true, image: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ received, sent });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
