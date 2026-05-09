import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST: Accept or reject a chat request
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { requestId, action } = await req.json();
    if (!requestId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const chatRequest = await prisma.chatRequest.findUnique({
      where: { id: requestId },
      include: { sender: { select: { name: true } }, receiver: { select: { name: true } } },
    });

    if (!chatRequest || chatRequest.receiverId !== decoded.id) {
      return NextResponse.json({ message: "Request not found or unauthorized" }, { status: 404 });
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";

    await prisma.chatRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
    });

    // Notify the sender
    await prisma.notification.create({
      data: {
        userId: chatRequest.senderId,
        type: action === "accept" ? "chat_accepted" : "chat_rejected",
        title: action === "accept" ? "Chat Request Accepted!" : "Chat Request Declined",
        body: action === "accept"
          ? `${chatRequest.receiver.name} accepted your chat request. You can now message them.`
          : `${chatRequest.receiver.name} declined your chat request.`,
        linkUrl: "/dashboard/chat/direct",
        fromId: decoded.id,
      },
    });

    return NextResponse.json({ message: `Request ${newStatus}` });
  } catch (error: any) {
    console.error("Respond error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
