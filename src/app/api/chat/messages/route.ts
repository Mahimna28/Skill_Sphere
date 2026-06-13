import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    
    if (!courseId) {
      return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { name: true }
        }
      }
    });

    // Map to the format the client expects
    const formattedMessages = messages.map(msg => ({
      courseId: msg.courseId,
      text: msg.text,
      senderId: msg.senderId,
      senderName: msg.sender.name,
      createdAt: msg.createdAt
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { courseId, text } = await req.json();

    if (!courseId || !text) {
      return NextResponse.json({ message: "Course ID and text are required" }, { status: 400 });
    }

    // Save to DB
    const newMessage = await prisma.message.create({
      data: {
        courseId,
        text,
        senderId: decoded.id
      },
      include: {
        sender: { select: { name: true } }
      }
    });

    return NextResponse.json({ 
      message: "Saved successfully",
      savedMessage: {
        courseId: newMessage.courseId,
        text: newMessage.text,
        senderId: newMessage.senderId,
        senderName: newMessage.sender.name,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error("Save message error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
