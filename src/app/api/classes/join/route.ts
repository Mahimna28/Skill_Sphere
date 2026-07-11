import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// POST /api/classes/join — student joins a class using a 6-char code
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { classCode } = await req.json();
    if (!classCode) return NextResponse.json({ message: "Class code is required" }, { status: 400 });

    const course = await prisma.course.findUnique({
      where: { classCode: classCode.toUpperCase() },
      select: { id: true, isPublic: true, departmentId: true, department: { select: { institutionId: true } } }
    });

    if (!course || course.isPublic) {
      return NextResponse.json({ message: "Invalid class code" }, { status: 404 });
    }

    // Check institution logic
    if (course.departmentId && course.department?.institutionId) {
      const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { institutionId: true } });
      if (!user?.institutionId) {
        return NextResponse.json({ message: "You cannot join an institute class because you are not in any institute" }, { status: 403 });
      }
      if (user.institutionId !== course.department.institutionId) {
        return NextResponse.json({ message: "This class is not in this institute" }, { status: 403 });
      }
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: decoded.id, courseId: course.id } }
    });
    if (existing) {
      return NextResponse.json({ message: "Already enrolled in this class", courseId: course.id }, { status: 200 });
    }

    await prisma.enrollment.create({
      data: { userId: decoded.id, courseId: course.id }
    });

    return NextResponse.json({ message: "Joined class successfully!", courseId: course.id });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
