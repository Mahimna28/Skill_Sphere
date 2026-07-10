import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded?.id || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, details, subject, thumbnail, isPublic, section, room } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { departmentId: true }
    });

    const isPublicBool = isPublic ?? true;
    let classCode = null;
    if (!isPublicBool) {
      classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      // Ensure unique by re-generating if exists (simplified for now)
      while (await prisma.course.findUnique({ where: { classCode } })) {
        classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      }
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        details: details || null,
        subject,
        thumbnail: thumbnail || null,
        isPublic: isPublicBool,
        classCode,
        section: section || null,
        room: room || null,
        teacherId: decoded.id,
        departmentId: user?.departmentId || null,
      },
    });

    return NextResponse.json({ message: "Course created!", course });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
