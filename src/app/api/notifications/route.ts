import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET: Fetch notifications for the logged-in user
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: decoded.id, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PATCH: Mark notifications as read
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { ids, markAllRead } = await req.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: decoded.id, read: false },
        data: { read: true },
      });
    } else if (ids && Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: { id: { in: ids }, userId: decoded.id },
        data: { read: true },
      });
    }

    return NextResponse.json({ message: "Notifications updated" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Dismiss notifications
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const clearAll = url.searchParams.get("clearAll");

    if (clearAll === "true") {
      await prisma.notification.deleteMany({
        where: { userId: decoded.id },
      });
    } else if (id) {
      await prisma.notification.deleteMany({
        where: { id, userId: decoded.id },
      });
    }

    return NextResponse.json({ message: "Notifications deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

