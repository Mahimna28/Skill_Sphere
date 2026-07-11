import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== "teacher" && decoded.role !== "admin" && decoded.role !== "superadmin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id: courseId } = params;

    // Verify course belongs to teacher or is admin
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    
    if (decoded.role === "teacher" && course.teacherId !== decoded.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    let classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    while (await prisma.course.findUnique({ where: { classCode } })) {
      classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { classCode },
    });

    return NextResponse.json({ classCode });
  } catch (error) {
    console.error("Failed to generate class code:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
