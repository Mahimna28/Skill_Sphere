import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
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

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || (course.teacherId !== decoded.id && decoded.role !== "superadmin" && decoded.role !== "institute_admin")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, dueDate } = body;

    if (!title || !description || !dueDate) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        courseId
      }
    });

    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Assignment error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
