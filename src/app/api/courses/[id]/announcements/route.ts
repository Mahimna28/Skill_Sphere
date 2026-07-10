import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId }, include: { coTeachers: true } });
    if (!course) return NextResponse.json({ message: "Course not found" }, { status: 404 });

    const isCoTeacher = course.coTeachers.some(t => t.id === decoded.id);
    if (course.teacherId !== decoded.id && !isCoTeacher && decoded.role !== "superadmin" && decoded.role !== "institute_admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, content, subjectId } = await req.json();

    if (!content) {
      return NextResponse.json({ message: "Missing content" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title || "Announcement",
        content,
        courseId,
        authorId: decoded.id,
        subjectId: subjectId || null
      }
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
