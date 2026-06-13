import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: lessonId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content, videoUrl } = await req.json();

    // Verify the lesson belongs to a course owned by this teacher
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: { select: { teacherId: true } } } } },
    });

    if (!lesson) return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
    if (lesson.module.course.teacherId !== decoded.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
      },
    });

    return NextResponse.json({ message: "Lesson updated!", lesson: updated });
  } catch (error: any) {
    console.error("Lesson update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
