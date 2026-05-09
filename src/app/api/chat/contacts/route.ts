import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET: Return users with active conversations or accepted chat requests
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all users who have exchanged messages with the current user in the last 24h
    const sentTo = await prisma.privateMessage.findMany({
      where: { 
        senderId: decoded.id,
        createdAt: { gte: last24h }
      },
      select: { receiverId: true },
      distinct: ["receiverId"],
    });
    const receivedFrom = await prisma.privateMessage.findMany({
      where: { 
        receiverId: decoded.id,
        createdAt: { gte: last24h }
      },
      select: { senderId: true },
      distinct: ["senderId"],
    });

    // Also find users with accepted chat requests
    const acceptedRequests = await prisma.chatRequest.findMany({
      where: {
        status: "accepted",
        OR: [
          { senderId: decoded.id },
          { receiverId: decoded.id },
        ],
      },
    });

    // Collect unique user IDs
    const contactIds = new Set<string>();
    sentTo.forEach(m => contactIds.add(m.receiverId));
    receivedFrom.forEach(m => contactIds.add(m.senderId));
    acceptedRequests.forEach(r => {
      contactIds.add(r.senderId === decoded.id ? r.receiverId : r.senderId);
    });
    contactIds.delete(decoded.id);

    if (contactIds.size === 0) {
      return NextResponse.json({ contacts: [] });
    }

    const contacts = await prisma.user.findMany({
      where: { id: { in: Array.from(contactIds) } },
      select: { id: true, name: true, email: true, username: true, image: true, role: true, isProfilePublic: true },
    });

    // For each contact, get the last message
    const contactsWithLastMsg = await Promise.all(
      contacts.map(async (contact) => {
        const lastMsg = await prisma.privateMessage.findFirst({
          where: {
            createdAt: { gte: last24h },
            OR: [
              { senderId: decoded.id, receiverId: contact.id },
              { senderId: contact.id, receiverId: decoded.id },
            ],
          },
          orderBy: { createdAt: "desc" },
          select: { text: true, createdAt: true, senderId: true },
        });
        return { ...contact, lastMessage: lastMsg };
      })
    );

    // Sort by last message time
    contactsWithLastMsg.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt?.getTime() || 0;
      const bTime = b.lastMessage?.createdAt?.getTime() || 0;
      return bTime - aTime;
    });

    return NextResponse.json({ contacts: contactsWithLastMsg });
  } catch (error: any) {
    console.error("Contacts error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
