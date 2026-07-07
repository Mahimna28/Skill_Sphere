import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;

    if (!decoded || !["teacher", "institute_admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, moduleId, title, content, videoUrl, fileUrl, fileType } = await req.json();

    // Verify course ownership
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || (course.teacherId !== decoded.id && decoded.role !== "superadmin" && decoded.role !== "institute_admin")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (type === "module") {
      const module = await prisma.module.create({
        data: { title, courseId, order: 0 },
      });
      revalidatePath(`/dashboard/teacher/courses/${courseId}`);
      return NextResponse.json({ message: "Module created!", module });
    }

    if (type === "lesson" && moduleId) {
      const lesson = await prisma.lesson.create({
        data: { 
          title, 
          content, 
          videoUrl: videoUrl || null, 
          fileUrl: fileUrl || null,
          fileType: fileType || null,
          moduleId, 
          order: 0 
        },
      });
      revalidatePath(`/dashboard/teacher/courses/${courseId}`);
      return NextResponse.json({ message: "Lesson created!", lesson });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id: courseId } = await params;
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type");
      const targetId = searchParams.get("targetId");
  
      if (!targetId) return NextResponse.json({ message: "Missing targetId" }, { status: 400 });
  
      if (type === "module") {
        await prisma.module.delete({ where: { id: targetId } });
        revalidatePath(`/dashboard/teacher/courses/${courseId}`);
        return NextResponse.json({ message: "Module deleted!" });
      }
  
      if (type === "lesson") {
        await prisma.lesson.delete({ where: { id: targetId } });
        revalidatePath(`/dashboard/teacher/courses/${courseId}`);
        return NextResponse.json({ message: "Lesson deleted!" });
      }
  
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    } catch (error: any) {
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
