import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { checkClassAccess } from "@/lib/classroom";

const isTeacher = (role: string) => ["teacher", "institute_admin", "superadmin"].includes(role);

// GET /api/classes/[id]/people
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true, department: { select: { name: true } } }
        }
      }
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { 
        teacher: { select: { id: true, name: true, email: true, image: true } },
        coTeachers: { select: { id: true, name: true, email: true, image: true } }
      }
    });

    return NextResponse.json({ students: enrollments.map(e => e.user), teacher: course?.teacher, coTeachers: course?.coTeachers || [] });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/classes/[id]/people — teacher removes a student
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: courseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? verifyToken(token) : null;
    if (!decoded || !isTeacher(decoded.role)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const courseIdForAccess = (await params).id;
    const canEdit = await checkClassAccess(courseIdForAccess, decoded.id);
    if (!canEdit) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { studentId } = await req.json();
    if (!studentId) return NextResponse.json({ message: "studentId required" }, { status: 400 });

    await prisma.enrollment.deleteMany({ where: { userId: studentId, courseId } });
    return NextResponse.json({ message: "Student removed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
